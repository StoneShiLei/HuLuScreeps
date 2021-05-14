
 interface RoomMemory{
    /**
     * 基地中心点坐标, [0] 为 x 坐标, [1] 为 y 坐标
     */
    center: [ number, number ]
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
    /**
     * 中央 link 的 id
     */
    centerLinkId?: Id<StructureLink>
    /**
     * 升级 link 的 id
     */
    upgradeLinkId?: Id<StructureLink>
}

interface Room{
    sources?:Source[]
    mineral?: Mineral
    source?: Source[]
    centerLink?: StructureLink
    /**
     * 焦点墙，维修单位总是倾向于优先修复该墙体
     */
    _importantWall: StructureWall | StructureRampart
}


type MemoryKey = SpawnList

type SpawnList = "spawnList"
