import BaseTaskController from "moudules/taskController/controller/baseTaskController";
import BaseTask from "moudules/taskController/task/baseTask";
import BaseTaskAction from "../baseTaskAction";

/**
 * 从A点将能量搬运至B点
 */
export default class TransportTaskAction extends BaseTaskAction {

    getResource():boolean{
        return true
    }

    workWithTarget():boolean{
        return true
    }

    // constructor(creep:Creep,task:BaseTask,controller:BaseTaskController){
    //     super(creep,task,controller)
    // }
}
