import BaseWorkerTask from "./baseWorkerTask";


export default class MineTask extends BaseWorkerTask{

    constructor(priority?:number,staffCount?:number){
        super("mine",priority,staffCount)
    }
}
