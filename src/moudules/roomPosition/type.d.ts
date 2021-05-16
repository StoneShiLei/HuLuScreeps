

interface RoomPosition{
    getFreeSpace(): RoomPosition[]
    /**
     * 获取当前位置目标方向的 pos 对象
     * @param direction
     */
    directionToPos(direction: DirectionConstant): RoomPosition | undefined
}
