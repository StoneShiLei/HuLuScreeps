import TaskControllerCollection from "roomTasks";
import HarvestTaskController from "roomTasks/harvestTask/harvestTaskController";
import TransportTaskController from "roomTasks/transporterTask/transportTaskController";



export default class RoomExtension extends Room{


    get harvestController():HarvestTaskController{
        if(!TaskControllerCollection.controllerMap.has("harvest")){
            TaskControllerCollection.controllerMap.set("harvest",new Map())
        }
        if(!TaskControllerCollection.controllerMap.get("harvest")?.has(this.name)){
            TaskControllerCollection.controllerMap.get("harvest")?.set(this.name,new HarvestTaskController(this.name))
        }

        const result = TaskControllerCollection.controllerMap.get("harvest")?.get(this.name)
        if(!result) throw new Error("未找到harvest任务控制器")
        return result as HarvestTaskController
    }

    get transportController():TransportTaskController{
        if(!TaskControllerCollection.controllerMap.has("transport")){
            TaskControllerCollection.controllerMap.set("transport",new Map())
        }
        if(!TaskControllerCollection.controllerMap.get("transport")?.has(this.name)){
            TaskControllerCollection.controllerMap.get("transport")?.set(this.name,new TransportTaskController(this.name))
        }

        const result = TaskControllerCollection.controllerMap.get("transport")?.get(this.name)
        if(!result) throw new Error("未找到transport任务控制器")
        return result as TransportTaskController
    }
}
