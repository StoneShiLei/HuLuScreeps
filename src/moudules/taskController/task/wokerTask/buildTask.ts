import BaseWorkerTask from "./baseWorkerTask";


export default class BuildTask extends BaseWorkerTask{
    targetId: Id<ConstructionSite>

    constructor(targetId:Id<ConstructionSite>,priority:number = 0,staffCount:number = 1){
        super("build",priority,staffCount)
        this.targetId = targetId
    }
}
