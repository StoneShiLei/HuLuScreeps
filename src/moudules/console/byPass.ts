export default class ByPass {
    /**
    * 添加绕过房间
    *
    * @param roomNames 要添加的绕过房间名列表
    */
   static add(...roomNames: string[]): string {
       if (!Memory.bypassRooms) Memory.bypassRooms = []

       // 确保新增的房间名不会重复
       Memory.bypassRooms = _.uniq([ ...Memory.bypassRooms, ...roomNames])
       return `[bypass] 已添加绕过房间，${this.show()}`
   }

       /**
     * 移除绕过房间
     *
     * @param roomNames 要移除的房间名列表
     */
    static remove(...roomNames: string[]): string {
        if (!Memory.bypassRooms) Memory.bypassRooms = []

        // 移除重复的房间
        if (roomNames.length <= 0) delete Memory.bypassRooms
        else Memory.bypassRooms = _.difference(Memory.bypassRooms, roomNames)

        return `[bypass] 已移除绕过房间，${this.show()}`
    }

    /**
     * 显示所有绕过房间
     */
    static show(): string {
        if (!Memory.bypassRooms || Memory.bypassRooms.length <= 0) return `当前暂无绕过房间`
        return `当前绕过房间列表：${Memory.bypassRooms.join(' ')}`
    }
}
