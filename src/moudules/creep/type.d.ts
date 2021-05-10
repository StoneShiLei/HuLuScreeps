

interface CreepMemory{



    /**
     * 要采集的资源 Id
     */
    sourceId?: Id<AllEnergySource>
    /**
     * 要存放到的目标建筑
     */
    targetId?: Id<Source | StructureWithStore | ConstructionSite>
    /**
     * 建筑工特有，当前缓存的建筑工地
     */
    constructionSiteId?: Id<ConstructionSite>
    /**
     * 要维修的建筑 id，维修单位特有
     */
    repairStructureId?: Id<AnyStructure>
    /**
     * manager 特有 要填充能量的建筑 id
     */
    fillStructureId?: Id<StructureWithStore>
    /**
     * 要填充的墙 id
     */
    fillWallId?: Id<StructureWall | StructureRampart>
    /**
     * 是否禁止重新孵化
     */
    cantRespawn?: boolean
    /**
     * 孵化该 creep 的房间
     */
    spawnRoom: string



    /**
     * 缓存路径
     */
    pathCache:PathStep[]
}



interface Creep{
    work():void
    goTo(target:RoomPosition,opt?:GoToOpt):ScreepsReturnCode
    getEngryFrom(target: AllEnergySource): ScreepsReturnCode
    transferTo(target:  AnyCreep | Structure, RESOURCE: ResourceConstant, moveOpt?: MoveToOpts): ScreepsReturnCode
    upgradeRoom(roomName: string): ScreepsReturnCode
    buildStructure(targetConstruction?: ConstructionSite): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND | ERR_RCL_NOT_ENOUGH
    backToGetEnergy():boolean
    steadyWall(): OK | ERR_NOT_FOUND
}


interface GoToOpt{
    range?:number
}
