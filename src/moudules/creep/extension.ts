import { creepRoleConfig } from "role"



export default class CreepExtension extends Creep {


    public work():void{
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
            else {
                if(roleConfig.getResource && roleConfig.getResource(this)) stateChange = true
            }
        }


        if(stateChange) this.memory.working = !this.memory.working
    }

    public goTo(target:RoomPosition,opt?:MoveToOpts):ScreepsReturnCode{
        return this.moveTo(target,opt)
    }

    /**
     * 切换为能量获取状态
     * 应在 target 阶段能量不足时调用
     *
     * @returns true
     */
    public backToGetEnergy():boolean{
        delete this.memory.sourceID
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
    public transferTo(target: AnyCreep | Structure, RESOURCE: ResourceConstant, moveOpt: MoveToOpts = {}): ScreepsReturnCode {
        this.goTo(target.pos, moveOpt)
        return this.transfer(target, RESOURCE)
    }

    /**
     * 升级房间控制器
     * @param roomName
     * @returns
     */
    public upgradeRoom(roomName:string):ScreepsReturnCode{
        const room = Game.rooms[roomName]
        if(!roomName) return ERR_NOT_FOUND
        const controller = room.controller
        if(!controller) return ERR_NOT_FOUND
        const result = this.upgradeController(controller)
        if(result == ERR_NOT_FOUND) this.goTo(controller.pos)
        return result
    }

    /**
     * 建设房间内存在的建筑工地
     *
     * @param targetConstruction 要建造的目标工地，该参数无效的话将自行挑选工地
     */
    public buildStructure(targetConstruction?:ConstructionSite):CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_NOT_FOUND | ERR_RCL_NOT_ENOUGH{
        const target = this.getBuildTarget(targetConstruction)

        if(!target) return ERR_NOT_FOUND

        const buildResult = this.build(target)
        if(buildResult == ERR_NOT_IN_RANGE){
            this.goTo(target.pos)
        }
        return buildResult
    }

    private getBuildTarget(target?:ConstructionSite):ConstructionSite | null{
        if(target){
            this.memory.constructionSiteId = target.id
            return target
        }
        else{
            const selfKeepTarget = Game.getObjectById<ConstructionSite>(this.memory.constructionSiteId || "")
            if(selfKeepTarget) return selfKeepTarget
            else{
                delete this.memory.constructionSiteId
            }
        }

        const sites = this.room.find(FIND_MY_CONSTRUCTION_SITES)
        if(sites.length <= 0) return null
        const result = this.pos.findClosestByRange(sites)
        if(!result) return null
        this.memory.constructionSiteId = result.id
        return result
    }
}
