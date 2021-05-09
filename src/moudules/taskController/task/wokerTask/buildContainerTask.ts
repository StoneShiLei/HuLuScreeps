import BaseWorkerTask from "./baseWorkerTask";


export default class BuildContainerTask extends BaseWorkerTask{
    //修建哪个 source 的 container    会自己去找这个 source 周边的 container 工地去修
    sourceID:Id<Source>
    //要修建的 container，执行任务时由 creep 自己储存
    containerId?:Id<ConstructionSite>

    constructor(sourceID:Id<Source>,priority?:number,containerId?:Id<ConstructionSite>){
        super("buildContainer",priority)
        this.sourceID = sourceID
        this.containerId = containerId
    }
}
