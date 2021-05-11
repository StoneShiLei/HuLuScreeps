import BaseWorkerTask from "./baseWorkerTask";


export default class UpgradeTask extends BaseWorkerTask{

    constructor(priority?:number,staffCount?:number){
        super("upgrade",priority,staffCount)
    }
}
