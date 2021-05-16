import BaseTaskController from "./baseTaskController";
import BaseWorkerTaskAction, { NoTaskAction } from "../taskAction/wokerTaskAction/baseWorkerTaskAction";
import BaseWorkerTask from "../task/wokerTask/baseWorkerTask";
import BuildTaskAction from "../taskAction/wokerTaskAction/buildTaskAction";
import BuildContainerTaskAction from "../taskAction/wokerTaskAction/buildContainerTaskAction";
import UpgradeTaskAction from "../taskAction/wokerTaskAction/upgradeTaskAction";
import RepairTaskAction from "../taskAction/wokerTaskAction/repairTaskAction";
import FillWallTaskAction from "../taskAction/wokerTaskAction/fillWallTaskAction";
import MineTaskAction from "../taskAction/wokerTaskAction/mineTaskAction";

type AllWorkAction = {[taskType in AllWorkerTaskType]: BaseWorkerTaskAction<BaseWorkerTask>}

export default class WorkTaskController extends BaseTaskController<AllWorkerTaskType,BaseWorkerTask>{
    actions: AllWorkAction = {
        "NoTask":new NoTaskAction(),
        "build":new BuildTaskAction(),
        "buildContainer":new BuildContainerTaskAction(),
        "upgrade":new UpgradeTaskAction(),
        "repair":new RepairTaskAction(),
        "fillWall":new FillWallTaskAction(),
        "mine":new MineTaskAction()
    }

    constructor(roomName:string){
        super(roomName,"work")
    }

    getAction(creep: Creep): BaseWorkerTaskAction<BaseWorkerTask> {

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
