import Utils from "utils/utils";
import SourceExtension from "./source/extension";


export default function mountRoom() {
    Utils.assignPrototype(Source,SourceExtension)
}
