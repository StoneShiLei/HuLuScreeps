


interface Room{
    /**
     * 当前房间中存在的敌人
     * 已拥有的房间特有，tower 负责维护
     */
    _enemys: (Creep|PowerCreep)[]
    /**
     * 需要维修的建筑，tower 负责维护，为 1 说明建筑均良好
     */
    _damagedStructure?: AnyStructure | 1
    /**
     * 该 tick 是否已经有 tower 刷过墙了
     */
    _hasFillWall: boolean
}


interface RoomMemory {
    //防御模式
    defenseMode?:DefenseMode
}

type DefenseMode = Defense | Active
type Defense = "defense"
type Active = "active"

