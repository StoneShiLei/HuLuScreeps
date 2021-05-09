import Utils from "utils/utils";
import TransportTaskController from "./taskController/controller/transportTaskController";
import WorkTaskController from "./taskController/controller/workTaskController";

export default function mountTaskController(){

    const controllers:[string,TaskController][] = [
        ['transportController',TransportTaskController],
        ['workController',WorkTaskController],
    ]

    const controllerStorage:ControllerStorage = {}

    controllers.forEach(([controllerName,controller]) =>{
        controllerStorage[controllerName] = {}

        Utils.createGetter(Room,controllerName,function (this:Room) {
            if(!(this.name in controllerStorage[controllerName])){
                controllerStorage[controllerName][this.name] = new controller(this.name)
            }

            return controllerStorage[controllerName][this.name]
        })
    })
}


/**
 * 任务控制器
 */
 type TaskController = { new (roomName: string):any}

 /**
  * 插件存储
  */
 interface ControllerStorage {
    /** 类别 */
    [controllerName: string]: {
        /** 房间名 */
        [roomName: string]: TaskController
    }
 }

 declare global {
    interface Room {
        /**
         * 工作任务模块
         */
        // work: WorkTaskController
        /**
         * 物流任务模块
         */
         transportController: TransportTaskController
         workController: WorkTaskController
    }
}
