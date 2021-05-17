


export default class Util {

    /**
     * 用户操作 - 设置中心点
     * @param flagName 中心点旗帜名
     */
    static setCenter(roomName:string,x:number,y:number): string {
        const room = Game.rooms[roomName]
        if (!room) return `未找到名为 ${roomName} 的房间`

        room.setBaseCenter(new RoomPosition(x,y,roomName))
        return `已为 ${roomName} 设置中心点`
    }

    /**
     * 占领新房间
     * @param roomName
     * @param targetRoomName
     * @param signText
     * @returns
     */
    static claimRoom(roomName:string,targetRoomName: string, signText: string = ''):string{
        const room = Game.rooms[roomName]
        if (!room) return `未找到名为 ${roomName} 的房间`
        room.claimRoom(targetRoomName,signText)
        return `已发布 claimer，请保持关注，支援单位会在占领成功后自动发布。`
    }
}
