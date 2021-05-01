import { BaseTask } from "./baseTask";
import { BaseTaskController } from "./baseTaskController";

export abstract class BaseTaskLogic{
    creep:Creep
    task:BaseTask
    controller:BaseTaskController

    constructor(creep:Creep,task:BaseTask,controller:BaseTaskController){
        this.creep = creep
        this.task = task
        this.controller = controller
    }

    abstract resourceLogic():boolean
    abstract workLogic():boolean
}

export class NoTask extends BaseTaskLogic {
    constructor(creep:Creep,task:BaseTask,controller:BaseTaskController){
        super(creep,task,controller)
    }

    resourceLogic():boolean{
        this.creep.say('💤')
        return false
    }
    workLogic():boolean{
        return true
    }
}
