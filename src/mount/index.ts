import { Utils } from "utils/utils"
import CreepExtension from "./creep/extension"
import RoomExtension from "./room/extension"


export default class Mount {
    static InitStorage(){
        if(!Memory.rooms) Memory.rooms = {}
        else delete Memory.rooms.undefined


    }

    static MountWork(){
        Utils.assignPrototype(Creep, CreepExtension)
        Utils.assignPrototype(Room, RoomExtension)
    }
}
