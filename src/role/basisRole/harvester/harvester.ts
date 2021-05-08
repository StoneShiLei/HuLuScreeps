import { spawn } from "child_process";
import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig";
import { type } from "os";


export default class HarvesterConfig implements RoleConfig{

    getReady?(creep:Creep):boolean{
        const harvestRoom = creep.memory.harvestRoom
        const sourceID = creep.memory.sourceID
        if(creep.room.name !== harvestRoom){
            creep.goTo(new RoomPosition(25,25,harvestRoom))
            return false
        }

        const source = Game.getObjectById(sourceID)
        if(!source) throw new Error("harvester的source不存在")
        if(!creep.memory.harvestMode) this.setHarvestMode(creep,source)

        return this.actionStrategy[creep.memory.harvestMode].prepare(creep,source)
    }
    getResource?(creep:Creep):boolean{
        const source = Game.getObjectById(creep.memory.sourceID)
        if(!source) throw new Error("harvester的source不存在")
        return this.actionStrategy[creep.memory.harvestMode].source(creep, source)
    }
    workWithTarget(creep:Creep):boolean{
        return this.actionStrategy[creep.memory.harvestMode].target(creep)
    }

    body(room: Room, spawn: StructureSpawn): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.harvester)(room,spawn) //data
    }

    private actionStrategy:ActionStrategy = {
        /**
         * 启动模式
         *
         * 当房间内没有搬运工时，采集能量，填充 spawn 跟 extension
         * 当有搬运工时，无脑采集能量
         */
        harvestStartMode:{
            prepare: (creep, source) => {
                const { targetPos, range } = this.goToDropPos(creep, source)
                // 没有抵达位置就准备未完成
                if (!creep.pos.inRangeTo(targetPos, range)) return false

                // 启动模式下，走到之后就将其设置为能量丢弃点
                source.setDroppedPos(creep.pos)

                // 把该位置存缓存到自己内存
                const { roomName, x, y } = creep.pos
                creep.memory.droppedPos = `${roomName},${x},${y}`

                // 如果脚下没有 container 及工地的话就放工地并发布建造任务
                const posContinaer = creep.pos.lookFor(LOOK_STRUCTURES).filter(s => s.structureType === STRUCTURE_CONTAINER)
                const posContinaerSite = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES).filter(s => s.structureType === STRUCTURE_CONTAINER)

                if (posContinaer.length <= 0 && posContinaerSite.length <= 0) {
                    // container 建造任务的优先级应该是最高的
                    // creep.room.work.addTask({ type: 'buildStartContainer', sourceId: source.id, priority: 4 })
                }

                return true
            },
            // 挖能量
            source: (creep, source) => {
                const workRoom = Game.rooms[creep.memory.workRoom]
                if (!workRoom) return false

                // 如果有搬运工了就无脑采集
                if (workRoom.transport.getUnit().length <= 0 && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true

                creep.harvest(source)
                this.goToDropPos(creep, source)
                return false
            },
            // 把能量运到 spawn
            target: (creep) => {
                const workRoom = Game.rooms[creep.memory.workRoom]
                if (!workRoom) return false

                // 有运输工了就回去挖能量
                if (creep.store[RESOURCE_ENERGY] <= 0 || workRoom.transport.getUnit().length > 0) return true

                // 找到 spawn 然后把身上的能量全塞进去，不搜索 extension，因为启动时还没有 extension
                // 就算是重建，只要保证 spawn 里有能量也能孵化搬运工了
                const targetSpawns = workRoom.find<StructureSpawn>(FIND_STRUCTURES,{filter:s => (s.structureType === STRUCTURE_SPAWN &&
                    s.store[RESOURCE_ENERGY] < SPAWN_ENERGY_CAPACITY) || s})
                if(targetSpawns.length == 0){
                    creep.say('😨卧槽我家没了')
                    return false
                }

                creep.transferTo(targetSpawns[0], RESOURCE_ENERGY)
                return false
            }
        },
        /**
         * 简单模式
         *
         * 在 container 不存在时切换为启动模式
         * 往 container 移动 > 检查 container 状态 > 无脑采集
         */
        harvestContainerMode:{
            prepare: (creep, source) => {
                const container = source.getContainer()
                if (!container) {
                    creep.memory.harvestMode = "harvestStartMode"
                    return false
                }

                creep.goTo(container.pos)
                // 没抵达位置了就还没准备完成
                if (!creep.pos.inRangeTo(container, 0)) return false

                // container 掉血了就发布维修任务
                if (container.hits < container.hitsMax) {
                    const workRoom = Game.rooms[creep.memory.workRoom]
                    if (!workRoom) return false
                    // 修个小 container，派一个人来修就可以了，所以不用指定高优先级
                    workRoom.work.updateTask({ type: 'repair' }, { dispath: true })
                }

                return true
            },
            /**
             * 采集阶段会无脑采集，过量的能量会掉在 container 上然后被接住存起来
             */
            source: (creep) => {
                const sourceId = creep.memory.sourceID
                const source = Game.getObjectById<Source>(sourceId)
                if(!source){
                    creep.say("矿在哪?")
                    return false
                }
                creep.getEngryFrom(source)

                // 如果房间里有 storage，则定期发布 container 到 storage 的能量转移任务
                if (creep.room.storage && !(Game.time % 100)) {
                    const container = source.getContainer()
                    // 能量达到数量了就发布任务，这个值应该低一点
                    // 不然有可能出现 worker 吃能量比较快导致任务发布数量太少
                    if (container && container.store[RESOURCE_ENERGY] > 200) {
                        // 看看是不是已经有发布好的任务了
                        const hasTransportTask = creep.room.transport.tasks.find(task => {
                            return 'from' in task && task.from === container.id
                        })

                        // 没有任务的话才会发布
                        !hasTransportTask && creep.room.transport.addTask({
                            type: 'transport',
                            from: container.id,
                            to: creep.room.storage.id,
                            resourceType: RESOURCE_ENERGY,
                            endWith: 100
                        })
                    }
                }

                // 快死了就把身上的能量丢出去，这样就会存到下面的 container 里，否则变成墓碑后能量无法被 container 自动回收
                if (creep.ticksToLive && creep.ticksToLive < 2) creep.drop(RESOURCE_ENERGY)
                return false
            },
            /**
             * 简单模式没有 target 阶段
             */
            target: () => true
        },
        /**
         * 转移模式
         *
         * 在 link 不存在时切换为启动模式
         * 采集能量 > 存放到指定建筑
         */
        harvestStructureMode:{
            prepare: (creep, source) => {
                const link = Game.getObjectById<StructureLink>(creep.memory.targetID as Id<StructureLink>) || creep.room.storage

                // 目标没了，变更为启动模式
                if (!link) {
                    delete creep.memory.targetID
                    creep.memory.harvestMode = "harvestStartMode"
                    return false
                }

                const { x: sourceX, y: sourceY } = source.pos
                const { x: linkX, y: linkY } = link.pos

                // 移动到 link 和 source 相交的位置，这样不用移动就可以传递能量
                const targetPos = new RoomPosition(Math.max(sourceX, linkX) - 1, Math.max(sourceY, linkY) - 1, source.room.name)
                creep.goTo(targetPos)
                return creep.pos.isEqualTo(targetPos)
            },
            source: (creep, source) => {
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true

                creep.getEngryFrom(source)

                // 快死了就把能量移出去
                if (creep.ticksToLive && creep.ticksToLive < 2) return true

                return false
            },
            target: (creep) => {
                const target = Game.getObjectById(creep.memory.targetID as Id<StructureLink>) || creep.room.storage

                // 目标没了，变更为启动模式
                if (!target) {
                    delete creep.memory.targetID
                    creep.memory.harvestMode = "harvestStartMode"
                    return true
                }

                creep.transferTo(target, RESOURCE_ENERGY)
                return true
            }
        }
    }

    private setHarvestMode(creep:Creep,source:Source):void{

        //外矿
        if(!source.room.controller || source.room.controller.level <= 0){
            creep.memory.harvestMode = "harvestStartMode"
            return
        }

        //link
        const nearLink = source.getLink()
        if(nearLink){
            creep.memory.harvestMode = "harvestStructureMode"
            creep.memory.targetID = nearLink.id
            return
        }

        //container
        const nearContainer = source.getContainer()
        if(nearContainer){
            creep.memory.harvestMode = "harvestContainerMode"
            creep.memory.targetID = nearContainer.id
            return
        }

        //默认启动模式
        creep.memory.harvestMode = "harvestStartMode"
    }

    /**
     * 移动到 source 旁丢弃能量的位置
     * @param creep 执行移动的单位
     */
    private goToDropPos(creep:Creep, source: Source): GoToDropPosResult {
        let targetPos: RoomPosition
        let range = 0

        // 尝试从缓存里读位置
        const droppedPos = creep.memory.droppedPos
        if (droppedPos) {
            const [ roomName, x, y ] = creep.memory.droppedPos.split(',')
            targetPos = new RoomPosition(Number(x), Number(y), roomName)
        }
        else {
            const { pos: droppedPos } = source.getDroppedInfo()
            // 之前就已经有点位了，自己保存一份
            if (droppedPos) {
                const { roomName, x, y } = droppedPos
                creep.memory.droppedPos = `${roomName},${x},${y}`
            }
            // 没有点位的话就要移动到 source，调整移动范围
            else range = 1

            targetPos = droppedPos ? droppedPos : source.pos
        }

        // 到了就不进行移动了
        if (creep.pos.isEqualTo(targetPos)) return { result: OK, targetPos, range }

        // 执行移动
        const resultPath = PathFinder.search(creep.pos,{pos:targetPos,range:range})
        const result = creep.moveByPath(resultPath.path)
        return { result, targetPos, range }
    }
}

