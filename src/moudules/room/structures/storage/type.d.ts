

interface RoomMemory{
    /**
     * storage 要在其他建筑里维持的能量
     * 目前只支持 terminal
     */
    energyKeepInfo?: {
        terminal?: {
            amount: number
            limit: number
        }
    }
}
