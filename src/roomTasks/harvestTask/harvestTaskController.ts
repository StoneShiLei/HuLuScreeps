import { BaseTaskController } from "roomTasks/baseTaskController";
import { BaseTaskLogic } from "roomTasks/baseTaskLogic";
import { HarvestTask } from "./harvestTask";
import { HarvestTaskStartLogic } from "./harvestTaskLogic";


export default class HarvestTaskController extends BaseTaskController{
    constructor(roomName:string) {
        super(roomName,"harvester")
    }

    public getWork(creep:Creep): BaseTaskLogic{
        return new HarvestTaskStartLogic(creep,new HarvestTask(),this)
    }
}
