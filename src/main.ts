
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
require('superMove');

//挂载模块控制器
mountMouduleController()
//挂载room
mountRoom()
//挂载position
mountRoomPosition()
//挂载creep
mountCreep()
//挂载全局命令
mountGlobal()
//挂载分析器
StackAnalysis.mount()
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

    // const x = ['W5N1 worker4','W5N1 worker5','W5N1 worker6','W5N1 worker8','W5N1 worker9','W5N1 worker10','W5N1 worker11'
    // ,'W5N1 worker12','W5N1 worker13','W5N1 worker14','W5N1 worker15','W5N1 worker16','W5N1 worker17','W5N1 worker18','W5N1 worker19','W5N1 worker20','W5N1 worker7']
    // for(const name of x){
    //     if(Memory.creeps[name]){
    //         delete Memory.creeps[name]
    //         Game.creeps[name].suicide()
    //         console.log("移除" + name)
    //     }
    // }
    // Memory.rooms['W5N1'].workerNum = 4
    Game.creeps['E1N29 worker0'].memory.constructionSiteId
    //远程控制台监控
    watcher()
});
// }));
