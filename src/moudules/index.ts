import Utils from "utils/utils"
import CreepExtension from "./creep/extension"
import RoomPositionExtension from "./roomPosition/extension"

export const  moudules = () => {
    if (!Memory.rooms) Memory.rooms = {}
    else delete Memory.rooms.undefined

    Utils.assignPrototype(Creep,CreepExtension)
    Utils.assignPrototype(RoomPosition,RoomPositionExtension)
}
