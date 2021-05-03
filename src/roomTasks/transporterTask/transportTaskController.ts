import { BaseTaskController } from "roomTasks/baseTaskController";
import { BaseTaskLogic } from "roomTasks/baseTaskLogic";
import { TransportTask } from "./transportTask";
import { FillExtensionLogic } from "./transportTaskLogic";


export default class TransportTaskController extends BaseTaskController{

    constructor(roomName:string) {
        super(roomName,"transport")
    }

    public getWork(creep:Creep): BaseTaskLogic{
        return new FillExtensionLogic(creep,new TransportTask(),this)
    }

}
