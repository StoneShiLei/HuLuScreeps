import whitelist from 'moudules/console/whiteList'
import Utils from 'utils/utils'
import creepNum from 'moudules/console/creepNum'
import util from 'moudules/console/util'
import byPass from 'moudules/console/byPass'
// 全局拓展操作
const extensions =  {
    // Game.getObjectById 别名
    get: Game.getObjectById,
    // 白名单
    whitelist,
    creepNum,
    util,
    byPass
}

// 挂载全局拓展
export default function(){
    _.assign(global,extensions)
}


