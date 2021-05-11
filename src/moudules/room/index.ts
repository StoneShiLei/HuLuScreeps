import Utils from "utils/utils";
import SourceExtension from "./source/extension";
import SpawnExtension from "./spawnController/extension";
import RoomSpawnController from "./spawnController/roomSpawnController";
import ContainerExtension from "./structures/container/extension";
import ControllerExtension from "./structures/controller/extension";
import TransportTaskController from "./taskController/controller/transportTaskController";
import WorkTaskController from "./taskController/controller/workTaskController";



export const mountRoom = function() {
    Utils.assignPrototype(Source,SourceExtension)
    Utils.assignPrototype(StructureSpawn,SpawnExtension)
    Utils.assignPrototype(StructureContainer,ContainerExtension)
    Utils.assignPrototype(StructureController,ControllerExtension)
}

export default function mountMouduleController(){

    const controllers:[string,Controller][] = [
        ['transportController',TransportTaskController],
        ['workController',WorkTaskController],
        ['spawnController',RoomSpawnController],
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
 type Controller = { new (roomName: string):any}

 /**
  * 插件存储
  */
 interface ControllerStorage {
    /** 类别 */
    [controllerName: string]: {
        /** 房间名 */
        [roomName: string]: Controller
    }
 }

 declare global {
    interface Room {
        /**
         * 物流任务模块
         */
         transportController: TransportTaskController
        /**
         * 工作任务模块
         */
         workController: WorkTaskController
        /**
         * 孵化控制模块
         */
         spawnController: RoomSpawnController
    }
}
