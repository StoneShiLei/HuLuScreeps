
import ConstructionController from "moudules/constructionController/constructionController";
import mountCreep from "moudules/creep";
import mountGlobal from "moudules/global/globalMont";
import CreepNumberListener from "moudules/creep/creepNumberListener";
import mountMouduleController, { mountRoom } from "moudules/room";
import mountRoomPosition from "moudules/roomPosition";
import { ErrorMapper } from "utils/errorMapper";
import Utils from "utils/utils";
import {StackAnalysis} from "utils/StackAnalysis"
var watcher = require('watch-client');

//挂载模块控制器
mountMouduleController()
//挂载room和position
mountRoom()
mountRoomPosition()
//挂载creep
mountCreep()
//挂载全局命令
mountGlobal()

//初始化建筑控制器
ConstructionController.init()




// export const loop = ErrorMapper.wrapLoop(StackAnalysis.wrap(() => {
export const loop = ErrorMapper.wrapLoop(() => {
    //creep生命维持
    CreepNumberListener.run()
    //放置建筑队列里的工地
    ConstructionController.manageConstruction()

    //执行onWork
    Utils.doing(Game.constructionSites,Game.structures,Game.creeps)

    //保存建筑队列
    ConstructionController.save()


    //远程控制台监控
    watcher()
});
// }));
