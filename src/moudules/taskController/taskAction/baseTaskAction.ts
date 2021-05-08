import BaseTaskController from "../controller/baseTaskController";
import BaseTask from "../task/baseTask";

/**
 * 任务工作逻辑基类
 */
export default abstract class BaseTaskAction{

    creep?:Creep
    controller?:BaseTaskController
    task?:BaseTask

    abstract getResource(creep:Creep):boolean

    abstract workWithTarget(creep:Creep):boolean

    init(creep?:Creep,task?:BaseTask,controller?:BaseTaskController):BaseTaskAction{
        this.controller = controller
        this.task = task
        this.creep = creep
        return this
    }

    // constructor(creep:Creep,task?:BaseTask,controller?:BaseTaskController){
    //     this.controller = controller
    //     this.task = task
    //     this.creep = creep
    // }
}


export class NoTaskAction extends BaseTaskAction{
    getResource(creep: Creep): boolean {
        creep.say('💤')
        return false
    }
    workWithTarget(creep: Creep): boolean {
        return true
    }

    // constructor(creep:Creep){
    //     super(creep)
    // }

}



