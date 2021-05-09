
export default class EnergyHelper {

    /**
     * getAvailableSource 中，建筑存储中能量大于多少才会被当作目标
     */
    static ENERGY_USE_LIMIT = {
        [STRUCTURE_TERMINAL]: 10000,
        [STRUCTURE_STORAGE]: 50000,
        [STRUCTURE_CONTAINER]: 400,
        // 一个 carry 50 容积，至少要保证能有一个 carry 的能量给填充单位用
        [RESOURCE_ENERGY]: 100,
        [STRUCTURE_LINK]: 0,
    }

    /**
     * 查找器 - 找到最多的能量来源
     */
    static getMax: EnergyTargetFinder = targets => _.max(targets, EnergyHelper.getEnergyAmount)
    /**
     * 生成查找器 - 找到离目标位置最近的能量来源
     *
     * @param pos 目标位置
     */
    static getClosestTo: (pos: RoomPosition) => EnergyTargetFinder = (pos) => {
        return targets => {
            const result = pos.findClosestByPath<EnergyTarget>(targets)
            if(!result) throw new Error("未找到最近的能量来源")
            return  result
        }
    }
    /**
     * 过滤器 - 优先保证来源中能量大于指定值
     */
    static withLimit: EnergyTargetFilter = targets => {
        return targets.filter(target => EnergyHelper.getEnergyAmount(target) > EnergyHelper.ENERGY_USE_LIMIT[EnergyHelper.getTargetType(target)])
    }

    /**
     * 获取目标中的能量数量，用于抹平差异
     */
    static getEnergyAmount(target: EnergyTarget):number {
        if ('store' in target) return target.store[RESOURCE_ENERGY]
        else if ('amount' in target) return target.amount
        else return 0
    }

    /**
     * 获取目标的类型，用于抹平差异
     */
    static getTargetType(target: EnergyTarget) {
        if ('structureType' in target) return target.structureType
        else if ('resourceType' in target) return target.resourceType
        else throw new Error("未识别的类型")
    }

    /**
     * 搜索房间内的可用能量源
     * 会先应用传入的过滤方法，然后使用搜索方法找到唯一目标
     *
     * @param room 要搜索能量来源的房间
     * @param finder 搜索方法，该方法接受房间里能量大于零的数组，并返回其中之一
     * @param filters 过滤方法，该方法接受房间里能量大于零的数组，并返回其中的一部分
     */
    static getRoomEnergyTarget(room:Room,finder?:EnergyTargetFinder,...filters:EnergyTargetFilter[]):EnergyTarget{
        let allEnergyTargets = room._energyFilterObj

        if(!allEnergyTargets){
            // 查找 storage、terminal 和 container
            const containers = room.find<StructureContainer>(FIND_STRUCTURES,{filter:s => s && s.structureType === STRUCTURE_CONTAINER})
            const structureList:(StructureContainer | StructureStorage | StructureTerminal)[] = [...containers ]
            if(room.storage) structureList.unshift(room.storage)
            if(room.terminal) structureList.unshift(room.terminal)
            const structureTargets = structureList
                .filter(structure => structure && structure.store[RESOURCE_ENERGY] > 0)

            allEnergyTargets = [...structureTargets]

            // 查找 source 旁边地上扔的
            const sources = room.find(FIND_SOURCES)
            const droppedEnergyTargets = sources
                .map(source => source.getDroppedInfo().energy).filter(Boolean)
            for(const item of droppedEnergyTargets){
                if(item) allEnergyTargets.push(item)
            }

            //缓存到房间实例上
            room._energyFilterObj = allEnergyTargets
        }


        // 遍历所有过滤器
        const filteredTargets = filters.reduce((targets,filter) => filter(targets),allEnergyTargets)

        //设置搜索方法并执行搜索
        const targetFinder:EnergyTargetFinder = finder || this.getMax
        return targetFinder(filteredTargets)
    }
}
