import BaseTaskController from "./baseTaskController";
import BaseTask from "../task/baseTask";
import TransportTask from "../task/transporterTask/transporterTask";
import BaseTaskAction, { NoTaskAction } from "../taskAction/baseTaskAction";
import TransportTaskAction from "../taskAction/transporterTaskAction/transportTaskAction";


export default class TransportTaskController extends BaseTaskController{
    transportActions:{[taskType in AllTransporterTaskType]: BaseTaskAction} = {
        "transportTask":new TransportTaskAction()
    }

    getAction(creep: Creep): BaseTaskAction {
        const task:BaseTask = new TransportTask(1,1,"","") //todo
        if(!task) return new NoTaskAction().init(creep)

        return this.transportActions[task.taskType].init(creep,task,this)
    }

    constructor(roomName:string){
        super(roomName,"transport")
    }
}
