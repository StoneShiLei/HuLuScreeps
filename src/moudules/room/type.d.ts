

interface RoomMemory{
    /**
     * 当前被 repairer 或 tower 关注的墙
     */
    focusWall?: {
        id: Id<StructureWall | StructureRampart>
        endTime: number
    }

    /**
     * 该房间的孵化队列数据
     */
    spawnList?: string
}

interface Room{
    sources?:Source[]
}


type MemoryKey = SpawnList

type SpawnList = "spawnList"
