
 interface RoomMemory{
    /**
     * 当前被 repairer 或 tower 关注的墙
     */
    focusWall?: {
        id: Id<StructureWall | StructureRampart>
        endTime: number
    }
    /**
     * 建筑工的当前工地目标，用于保证多个建筑工的工作统一以及建筑工死后不会寻找新的工地
     */
    constructionSiteId?: Id<ConstructionSite>
}

interface Room{
    sources?:Source[]
    /**
     * 焦点墙，维修单位总是倾向于优先修复该墙体
     */
    _importantWall: StructureWall | StructureRampart
}


type MemoryKey = SpawnList

type SpawnList = "spawnList"
