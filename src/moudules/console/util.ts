


export default class Util {

    /**
     * 用户操作 - 设置中心点
     * @param flagName 中心点旗帜名
     */
    static setCenter(roomName:string,x:number,y:number): string {
        const room = Game.rooms[roomName]
        if (!room) return `未找到名为 ${roomName} 的房间`

        room.memory.center = [x,y]
        return `已为 ${roomName} 设置中心点`
    }
}
