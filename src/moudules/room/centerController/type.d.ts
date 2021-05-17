
/**
 * 核心建筑群包含的建筑
 */
type CenterStructures = STRUCTURE_STORAGE | STRUCTURE_TERMINAL | STRUCTURE_FACTORY | 'centerLink'

interface RoomMemory{
    /**
     * 该房间centerTask
     */
    centerList?: string
}
