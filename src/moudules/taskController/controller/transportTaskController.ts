import BaseTaskController from "./baseTaskController";
import TransportTaskAction from "../taskAction/transporterTaskAction/transportTaskAction";
import FillExtensionTaskAction from "../taskAction/transporterTaskAction/fillExtensionTaskAction";
import FillTowerTaskAction from "../taskAction/transporterTaskAction/fillTowerTaskAction";
import BaseTransporterTaskAction, { NoTaskAction } from "../taskAction/transporterTaskAction/baseTransporterTaskAction";
import BaseTransporterTask from "../task/transporterTask/baseTransporterTask";

type AllTransportAction = {[taskType in AllTransporterTaskType]: BaseTransporterTaskAction}

export default class TransportTaskController extends BaseTaskController<AllTransporterTaskType,BaseTransporterTask>{
    actions: AllTransportAction = {
        "transportTask":new TransportTaskAction(),
        "fillTower":new FillTowerTaskAction(),
        "fillExtensionTask":new FillExtensionTaskAction(),
        "NoTask":new NoTaskAction()
    }

    constructor(roomName:string){
        super(roomName,"transport")
    }

    getAction(creep: Creep): BaseTransporterTaskAction {

        const task = this.getUnitTask(creep)
        if(!task){
            const noTask =  this.actions["NoTask"]
            noTask.creep = creep
            return noTask
        }

        const action = this.actions[task.taskType]
        action.creep = creep
        action.task = task
        action.controller = this

        return action
    }
}
