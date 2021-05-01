import { Utils } from "utils/utils"
import CreepExtension from "./creep/extension"


export default class Mount {
    static InitStorage(){
        if(!Memory.rooms) Memory.rooms = {}
        else delete Memory.rooms.undefined


    }

    static MountWork(){
        Utils.assignPrototype(Creep, CreepExtension)
    }
}
