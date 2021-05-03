import { BaseTaskController } from "./baseTaskController";
import HarvestTaskController from "./harvestTask/harvestTaskController";
import TransportTaskController from "./transporterTask/transportTaskController";


export default class TaskControllerCollection{
    //控制器名  房间名   控制器
    static controllerMap:Map<string,Map<string,BaseTaskController>> = new Map()
}


declare global{
    interface Room{
        harvestController:HarvestTaskController
        transportController:TransportTaskController
    }
}
