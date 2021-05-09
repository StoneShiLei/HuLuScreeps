import BaseWorkerTask from "./baseWorkerTask";


export default class RepairTask extends BaseWorkerTask{

    constructor(priority:number = 0,staffCount:number = 1){
        super("repair",priority,staffCount)
    }
}
