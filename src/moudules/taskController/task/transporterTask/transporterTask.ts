import BaseTask from "../baseTask";


/**
 * 从A点将能量搬运至B点
 */
export default class TransportTask extends BaseTask{

    resourceID:string
    targetID:string

    constructor(priority:number,staffCount:number,resourceID:string,targetID:string){
        super(priority,staffCount,"transportTask")
        this.priority = priority
        this.staffCount = staffCount
        this.resourceID = resourceID
        this.targetID = targetID
    }
}
