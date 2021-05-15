import { filter } from "lodash"
import ConstructionController from "moudules/constructionController/constructionController"
import MoveUtil from "moudules/move/moveUtil"
import FillWallTask from "moudules/room/taskController/task/wokerTask/fillWallTask"
import { creepRoleConfig } from "role"
import { minWallHits, repairSetting } from "setting"



export default class CreepExtension extends Creep {


    public onWork(): void{
        // 检查 creep 内存中的角色是否存在
        if(!(this.memory.role in creepRoleConfig)){
            this.say('我没角色？')
        }

        if(this.spawning) return

        // 获取对应配置项
        const roleConfig = creepRoleConfig[this.memory.role]

        // 没准备的时候就执行准备阶段
        if(!this.memory.ready){
            if(roleConfig.getReady) this.memory.ready = roleConfig.getReady(this)
            else this.memory.ready = true
        }

        //　如果执行了 prepare 还没有 ready，就返回等下个 tick 再执行
        if(!this.memory.ready) return

        // 获取是否工作，没有 source 的话直接执行 target
        const working = roleConfig.getResource? this.memory.working : true
        let stateChange = false

        // 执行对应阶段
        // 阶段执行结果返回 true 就说明需要更换 working 状态
        if(working){
            if(roleConfig.workWithTarget && roleConfig.workWithTarget(this)) stateChange = true
        }
        else {
            if(roleConfig.getResource && roleConfig.getResource(this)) stateChange = true
        }


        if(stateChange) this.memory.working = !this.memory.working
    }

    public goTo(target:RoomPosition,opt?:GoToOpt):ScreepsReturnCode{
        let path:RoomPosition[] | PathStep[] | undefined = MoveUtil.findPath(this,target,opt)
        if(!path) {
            path = this.room.findPath(this.pos,target,opt)
        }
        const result = this.moveByPath(path)
        return result
    }

    /**
     * 切换为能量获取状态
     * 应在 target 阶段能量不足时调用
     *
     * @returns true
     */
    public backToGetEnergy():boolean{
        delete this.memory.sourceId
        return true
    }

    /**
     * 从目标结构获取能量
     *
     * @param target 提供能量的结构
     * @returns 执行 harvest 或 withdraw 后的返回值
     */
    public getEngryFrom(target: AllEnergySource): ScreepsReturnCode {
        let result: ScreepsReturnCode
        // 是建筑就用 withdraw
        if (target instanceof Structure) {
            // 如果建筑里没能量了就不去了，防止出现粘性
            if (target.store[RESOURCE_ENERGY] <= 0) return ERR_NOT_ENOUGH_ENERGY
            result = this.withdraw(target as Structure, RESOURCE_ENERGY)
        }
        else if (target instanceof Resource) result = this.pickup(target as Resource)
        // 不是的话就用 harvest
        else result = this.harvest(target as Source)

        if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos, { range: 1 })

        return result
    }

    /**
     * 转移资源到建筑
     * 包含移动逻辑
     *
     * @param target 要转移到的目标
     * @param RESOURCE 要转移的资源类型
     */
    public transferTo(target: AnyCreep | Structure, RESOURCE: ResourceConstant, moveOpt: GoToOpt = {}): ScreepsReturnCode {
        this.goTo(target.pos, moveOpt)
        return this.transfer(target, RESOURCE)
    }

    /**
     * 升级房间控制器
     * @param roomName
     * @returns
     */
     public upgradeRoom(roomName: string): ScreepsReturnCode {
        const workRoom = Game.rooms[roomName]
        if (!workRoom) {
            this.goTo(new RoomPosition(25, 25, roomName))
            return ERR_NOT_IN_RANGE
        }
        if(!workRoom.controller) return ERR_NOT_FOUND
        const result = this.upgradeController(workRoom.controller)

        if (result == ERR_NOT_IN_RANGE) this.goTo(workRoom.controller.pos)
        return result
    }

    /**
     * 稳定新墙
     * 会把内存中 fillWallId 标注的墙声明值刷到定值以上
     */
    public steadyWall(): OK | ERR_NOT_FOUND {
        const wallID = this.memory.fillWallId
        if(!wallID) return ERR_NOT_FOUND
        const wall = Game.getObjectById(wallID)
        if (!wall) return ERR_NOT_FOUND

        if (wall.hits < minWallHits) {
            const result = this.repair(wall)
            if (result == ERR_NOT_IN_RANGE) this.goTo(wall.pos)
        }
        else delete this.memory.fillWallId

        return OK
    }

    /**
     * 填充防御性建筑
     * 包括 wall 和 rempart
     * @returns 当没有墙需要刷时返回 false，否则返回 true
     */
    public fillDefenseStructure():boolean{
        const focusWall = this.room.memory.focusWall
        let targetWall: StructureWall | StructureRampart | null = null
        // 该属性不存在 或者 当前时间已经大于关注时间 就刷新
        if (!focusWall || (focusWall && Game.time >= focusWall.endTime)) {
            // 获取所有没填满的墙

            const walls =  this.room.find<StructureWall | StructureRampart>(FIND_STRUCTURES
                ,{filter:s => s && (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && s.hits < s.hitsMax})

            // 没有目标就啥都不干
            if (walls.length <= 0) return false

            // 找到血量最小的墙
            targetWall = walls.sort((a, b) => a.hits - b.hits)[0]

            // 将其缓存在内存里
            this.room.memory.focusWall = {
                id: targetWall.id,
                endTime: Game.time + repairSetting.focusTime
            }
        }

        // 获取墙壁
        if (!targetWall && focusWall) targetWall = Game.getObjectById(focusWall.id)
        // 如果缓存里的 id 找不到墙壁，就清除缓存下次再找
        if (!targetWall) {
            delete this.room.memory.focusWall
            // 这个时候返回 true，因为还不确定是否所有的墙都刷好了
            return true
        }

        // 填充墙壁
        const result = this.repair(targetWall)
        if (result == ERR_NOT_IN_RANGE) this.goTo(targetWall.pos)
        return true
    }

    /**
     * 建设房间内存在的建筑工地
     *
     * @param targetConstruction 要建造的目标工地，该参数无效的话将自行挑选工地
     */
    public buildStructure(targetConstruction?:ConstructionSite):CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_NOT_FOUND | ERR_RCL_NOT_ENOUGH{
        const target = this.getBuildTarget(targetConstruction)

        if(!target) return ERR_NOT_FOUND

        // 上面发现有墙要刷了，这个 tick 就不再造建造了
        // 防止出现造好一个 rampart，然后直接造下一个 rampart，造好后又扭头去刷第一个 rampart 的小问题出现
        if (this.memory.fillWallId) return ERR_BUSY

        //建设
        const buildResult = this.build(target)

        if (buildResult == OK) {
            // 如果修好的是 rempart 的话就移除墙壁缓存
            // 让维修单位可以快速发现新 rempart
            if (target.structureType == STRUCTURE_RAMPART) delete this.room.memory.focusWall
        }

        if(buildResult == ERR_NOT_IN_RANGE){
            this.goTo(target.pos)
        }
        return buildResult
    }

    /**
     * 建筑目标获取
     * 优先级：指定的目标 > 自己保存的目标 > 房间内保存的目标
     */
    private getBuildTarget(target?:ConstructionSite):ConstructionSite | null{
        // 指定了目标，直接用，并且把 id 备份一下
        if(target){
            this.memory.constructionSiteId = target.id
            return target
        }
        // 没有指定目标，或者指定的目标消失了，从自己内存里找
        else{
            const selfKeepTarget = Game.getObjectById<ConstructionSite>(this.memory.constructionSiteId || "")
            if(selfKeepTarget) return selfKeepTarget
            else{
                const structure = ConstructionController.buildCompleteSite[this.memory.constructionSiteId || ""]
                // 如果刚修好的是墙的话就记住该墙的 id，然后把血量刷高一点）
                if (structure && (
                    structure.structureType === STRUCTURE_WALL ||
                    structure.structureType === STRUCTURE_RAMPART
                )) {
                    this.memory.fillWallId = structure.id as Id<StructureWall | StructureRampart>
                    // 同时发布刷墙任务
                    this.room.workController.updateTask(new FillWallTask())
                }
                delete this.memory.constructionSiteId
            }
        }

        // 自己内存里没找到，去房间内存里查之前缓存的
        const roomKeepTarget = Game.getObjectById<ConstructionSite<BuildableStructureConstant>>(this.room.memory.constructionSiteId || "")
        // 找到了，保存到自己内存里
        if (roomKeepTarget) {
            this.memory.constructionSiteId = this.room.memory.constructionSiteId
            return roomKeepTarget
        }

        // 房间内存也没有缓存，重新搜索并缓存到房间
        delete this.room.memory.constructionSiteId
        const newTarget =  ConstructionController.getNearSite(this.pos)
        if(newTarget) this.room.memory.constructionSiteId = newTarget.id

        // 再没有就真没有了
        return newTarget || null
    }
}
