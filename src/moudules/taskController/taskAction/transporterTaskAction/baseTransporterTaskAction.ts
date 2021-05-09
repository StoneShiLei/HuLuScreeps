import BaseTaskController from "moudules/taskController/controller/baseTaskController";
import BaseTransporterTask from "moudules/taskController/task/transporterTask/baseTransporterTask";
/**
 * 任务工作逻辑基类
 */
export default abstract class BaseTransporterTaskAction implements ITaskAction{

    abstract getResource(creep: Creep): boolean
    abstract workWithTarget(creep: Creep): boolean

    creep!: Creep;
    controller!: BaseTaskController<AllTransporterTaskType,BaseTransporterTask>;
    task!: BaseTransporterTask;
}

export class NoTaskAction extends BaseTransporterTaskAction{
    getResource(creep: Creep): boolean {
        creep.say('💤')
        return false
    }
    workWithTarget(creep: Creep): boolean {
        return true
    }
}
