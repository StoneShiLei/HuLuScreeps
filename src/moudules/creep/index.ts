import Utils from "utils/utils";
import CreepExtension from "./extension";


export default function mountCreep() {
    Utils.assignPrototype(Creep,CreepExtension)
}
