import Utils from "utils/utils";
import RoomPositionExtension from "./extension";


export default function mountRoomPosition() {
    Utils.assignPrototype(RoomPosition,RoomPositionExtension)
}
