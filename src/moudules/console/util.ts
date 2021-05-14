

export default class Util {

    static setBaseCenter(roomName:string,x:number,y:number):OK | ERR_INVALID_ARGS{
        const position = new RoomPosition(x,y,roomName)
        if(!position) return ERR_INVALID_ARGS
        const room = Game.rooms[roomName]
        if(!room) throw new Error("room不存在")

        room.memory.center = [position.x,position.y]
        return OK
    }
}
