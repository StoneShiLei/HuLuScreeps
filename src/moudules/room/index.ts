import Utils from "utils/utils";
import RoomCenterController from "./centerController/roomCenterController";
import SourceExtension from "./source/extension";
import SpawnExtension from "./spawnController/extension";
import RoomSpawnController from "./spawnController/roomSpawnController";
import ContructionSiteExtension from "./structures/constructionSite/extension";
import ContainerExtension from "./structures/container/extension";
import ControllerExtension from "./structures/controller/extension";
import LinkExtension  from "./structures/link/extension";
import StorageExtension from "./structures/storage/extension";
import TowerExtension from "./structures/tower/tower";
import TransportTaskController from "./taskController/controller/transportTaskController";
import WorkTaskController from "./taskController/controller/workTaskController";



export const mountRoom = function() {
    Utils.assignPrototype(Source,SourceExtension)
    Utils.assignPrototype(StructureSpawn,SpawnExtension)
    Utils.assignPrototype(StructureContainer,ContainerExtension)
    Utils.assignPrototype(StructureController,ControllerExtension)
    Utils.assignPrototype(ConstructionSite,ContructionSiteExtension)
    Utils.assignPrototype(StructureTower,TowerExtension)
    Utils.assignPrototype(StructureStorage,StorageExtension)
    Utils.assignPrototype(StructureLink,LinkExtension)
}

export default function mountMouduleController(){
    const controllers:[string,Controller][] = [
        ['transportController',TransportTaskController],
        ['workController',WorkTaskController],
        ['spawnController',RoomSpawnController],
        ['centerController',RoomCenterController]
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
         /**
          * 中央任务模块
          */
         centerController:RoomCenterController
    }
}
