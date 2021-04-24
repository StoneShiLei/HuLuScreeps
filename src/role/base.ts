

/**
 * 初级房间运维角色组
 * 本角色组包括了在没有 Storage 和 Link 的房间内运维所需的角色
 */
 const roles: {
    [role in BaseRoleConstant]: (data: CreepData) => ICreepConfig
} = {
    /**
     * 采集者
     * 从指定 source 中获取能量 > 将能量存放到身下的 container 中
     */
    harvester: (data: CreepData): ICreepConfig => ({
        // 向 container 或者 source 移动
        // 在这个阶段中，targetId 是指 container 或 conatiner 的工地或 source
        prepare: creep => {
            if(data.kind != "harvester") throw new Error("传入了错误的CreepData");
            let target: StructureContainer | Source | ConstructionSite | null = null;
            // 如果有缓存的话就获取缓存
            if (creep.memory.targetId) target = Game.getObjectById<StructureContainer | Source>(creep.memory.sourceId??"")

            // 如果还是没找到的话就用 source 当作目标
            if(!target){
                const source = Game.getObjectById<Source>(data.sourceId)
                if(!source) return false
                target = source
            }
            creep.memory.targetId = target.id

            // 设置移动范围并进行移动（source 走到附近、container 和工地就走到它上面）
            const range = target instanceof Source ? 1 : 0
            creep.moveTo(target.pos.x,target.pos.y)

            // 抵达位置了就准备完成
            if (creep.pos.inRangeTo(target.pos, range)) return true
            return false
        },

        // 采集阶段会无脑采集，过量的能量会掉在 container 上然后被接住存起来
        target: creep => {
            if(data.kind != "harvester") throw new Error("传入了错误的CreepData");


            if(creep.store.getFreeCapacity() > 0) {
                let souce = Game.getObjectById<Source>(data.sourceId ?? "")
                if(!souce) return false;


                if(creep.harvest(souce) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(souce, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }

            // 快死了就把身上的能量丢出去，这样就会存到下面的 container 里，否则变成墓碑后能量无法被 container 自动回收
            if (creep.ticksToLive && creep.ticksToLive < 2) creep.drop(RESOURCE_ENERGY)
            return false
        },
        bodys: 'harvester'
    }),


    /**
     * 升级者
     * 不会采集能量，只会从指定目标获取能量
     * 从指定建筑中获取能量 > 升级 controller
     */
    upgrader: (data: CreepData): ICreepConfig => ({
        source: creep => {
            if(data.kind != "worker") throw new Error("传入了错误的CreepData");

            // 因为只会从建筑里拿，所以只要拿到了就去升级
            if (creep.store[RESOURCE_ENERGY] > 0) return true

            const source: StructureTerminal | StructureStorage | StructureContainer | null = Game.getObjectById(data.sourceId ?? "")

            // 如果来源是 container 的话就等到其中能量大于指定数量再拿（优先满足 filler 的能量需求）
            if (source && source.structureType === STRUCTURE_CONTAINER && source.store[RESOURCE_ENERGY] <= 500) return false

            // 获取能量
            if(!source) return false;
            const result = creep.withdraw(source,RESOURCE_ENERGY)
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(source.pos)
                return false
            }
            else{
                return true
            }
        },
        target: creep => {
            if(!creep.room.controller) return false
            const result = creep.upgradeController(creep.room.controller)
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller.pos)
            }

            if (result === ERR_NOT_ENOUGH_RESOURCES) return true
            return false
        },
        bodys: 'upgrader'
    }),

    /**
     * 建筑者
     * 只有在有工地时才会生成
     * 从指定结构中获取能量 > 查找建筑工地并建造
     *
     * @param spawnRoom 出生房间名称
     * @param sourceId 要挖的矿 id
     */
    // builder: (data: CreepData): ICreepConfig => ({
    //     // 工地都建完就就使命完成
    //     isNeed: room => {
    //         const targets: ConstructionSite[] = room.find(FIND_MY_CONSTRUCTION_SITES)
    //         return targets.length > 0 ? true : false
    //     },
    //     // 把 data 里的 sourceId 挪到外边方便修改
    //     prepare: creep => {
    //         creep.memory.sourceId = data.sourceId
    //         return true
    //     },
    //     // 根据 sourceId 对应的能量来源里的剩余能量来自动选择新的能量来源
    //     source: creep => {
    //         if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true

    //         // 获取有效的能量来源
    //         let source: StructureStorage | StructureTerminal | StructureContainer | Source
    //         if (!creep.memory.sourceId) {
    //             source = creep.room.getAvailableSource()
    //             creep.memory.sourceId = source.id
    //         }
    //         else source = Game.getObjectById(creep.memory.sourceId)

    //         // 之前用的能量来源没能量了就更新来源（如果来源已经是 source 的话就不改了）
    //         if (creep.getEngryFrom(source) === ERR_NOT_ENOUGH_RESOURCES && source instanceof Structure) delete creep.memory.sourceId
    //     },
    //     target: creep => {
    //         // 有新墙就先刷新墙
    //         if (creep.memory.fillWallId) creep.steadyWall()
    //         // 没有就建其他工地
    //         else if (creep.buildStructure() !== ERR_NOT_FOUND) { }
    //         // 工地也没了就去升级
    //         else if (creep.upgrade()) { }

    //         if (creep.store.getUsedCapacity() === 0) return true
    //     },
    //     bodys: 'worker'
    // })
}

export default roles
