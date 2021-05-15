


export default class CreepNum {
    static addCreep(roomName:string,role:BaseUnits,num:number):OK | ERR_NOT_FOUND | ERR_INVALID_TARGET{
        const room = Game.rooms[roomName]
        if(!room) throw new Error("房间不存在")
        const spawnController = room.spawnController
        if(!spawnController) throw new Error("spawnController不存在")
        return spawnController.release.changeBaseUnit(role,num)
    }
}
