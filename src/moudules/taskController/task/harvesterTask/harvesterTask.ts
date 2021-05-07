import BaseTask from "../baseTask";


export default class HarvesterTask extends BaseTask{


    constructor(priority:number,staffCount:number){
        super(priority,staffCount,"harvesterContainerTask")
        this.priority = priority
        this.staffCount = staffCount
    }
}
