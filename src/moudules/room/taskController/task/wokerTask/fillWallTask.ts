import BaseWorkerTask from "./baseWorkerTask";


export default class FillWallTask extends BaseWorkerTask{

    constructor(priority?:number,staffCount?:number){
        super("fillWall",priority,staffCount)
    }
}
