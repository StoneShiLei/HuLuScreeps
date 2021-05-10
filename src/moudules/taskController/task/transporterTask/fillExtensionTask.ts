import BaseTransporterTask from "./baseTransporterTask";


export default class FillExtensionTask extends BaseTransporterTask{

    constructor(priority:number = 0,staffCount = 1){
        super("fillExtensionTask",priority,staffCount)
    }
}
