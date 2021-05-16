import { CreepNameGetter } from "./spawnController/CreepNameGetter"
import SpawnTask from "./spawnController/spawnTask"


export default class RoomExtension extends Room{

    /**
     * 设置基地中心
     * @param pos 中心点位
     */
    public setBaseCenter(pos: RoomPosition): OK | ERR_INVALID_ARGS {
        if(!pos) return ERR_INVALID_ARGS

        this.memory.center = [pos.x,pos.y]
        return OK
    }

    /**
     * 占领新房间
     * 本方法只会发布占领单位，等到占领成功后 claimer 会自己发布支援单位
     *
     * @param targetRoomName 要占领的目标房间
     * @param signText 新房间的签名
     */
    public claimRoom(targetRoomName: string, signText: string = ''): OK {
        this.spawnController.addTask(new SpawnTask(
            CreepNameGetter.claimer(targetRoomName),
            'claimer',{
                claimerData:{targetRoomName:targetRoomName,signText}
            }
        ))

        return OK
    }
}
