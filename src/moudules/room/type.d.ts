
 interface RoomMemory{
    /**
     * 基地中心点坐标, [0] 为 x 坐标, [1] 为 y 坐标
     */
    center?: [ number, number ]
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
    sources?:Source[] //room的source列表 暂时由spawn维护
    /**
     * 焦点墙，维修单位总是倾向于优先修复该墙体
     */
    _importantWall: StructureWall | StructureRampart

    /**
     * @param pos 设置基地中心点
     */
    setBaseCenter(pos: RoomPosition): OK | ERR_INVALID_ARGS

    /**
     * 占领新房间
     * @param targetRoomName
     * @param signText
     */
    claimRoom(targetRoomName: string, signText?: string): OK
}


type MemoryKey = SpawnList | CenterList

type SpawnList = "spawnList"
type CenterList = "centerList"
