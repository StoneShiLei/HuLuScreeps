

interface RoomMemory{
    /**
     * 当前被 repairer 或 tower 关注的墙
     */
    focusWall?: {
        id: Id<StructureWall | StructureRampart>
        endTime: number
    }
}

interface Room{
    sources?:Source[]
}


type MemoryKey = SpawnList

type SpawnList = "spawnList"
