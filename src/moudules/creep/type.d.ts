

interface CreepMemory{



    /**
     * 建筑工特有，当前缓存的建筑工地
     */
    constructionSiteId?: Id<ConstructionSite>
}



interface Creep{
    work():void
    goTo(target:RoomPosition,opt?:MoveToOpts):ScreepsReturnCode
    getEngryFrom(target: AllEnergySource): ScreepsReturnCode
    transferTo(target:  AnyCreep | Structure, RESOURCE: ResourceConstant, moveOpt?: MoveToOpts): ScreepsReturnCode
    upgradeRoom(roomName: string): ScreepsReturnCode
    buildStructure(targetConstruction?: ConstructionSite): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND | ERR_RCL_NOT_ENOUGH
}
