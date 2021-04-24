import { ErrorMapper } from "modules/ErrorMapper";
import mountWork from './mount'
// import creepNumberListener from './modules/creepController'
import { doing } from './utils'


export const loop = ErrorMapper.wrapLoop(() => {

  // 挂载拓展
  mountWork()

  // creep 数量控制
  // creepNumberListener()

  // 所有建筑、creep、powerCreep 执行工作
  doing(Game.structures, Game.creeps)

});
