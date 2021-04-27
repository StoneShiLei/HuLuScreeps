import { forOwn } from "lodash";
import { ErrorMapper } from "modules/ErrorMapper";
import { type } from "os";
import mountWork from './mount'
import { doing } from './utils'


export const loop = ErrorMapper.wrapLoop(() => {

  // 挂载拓展
  mountWork()

  // creep 数量控制
  // creepNumberListener()

  // 所有建筑、creep、powerCreep 执行工作
  doing(Game.structures, Game.creeps)

  enum Role{
    Role1 = "role1",
    Role2 = "role2"
  }
  class WorkFunc{
    work1:Function
    work2:Function
  }
  let x:{[key in Role]:WorkFunc} = {
    role1:{
      work1:console.log,
      work2:console.log,
    },
    role2:{
      work1:console.log,
      work2:console.log
    }
  }

  x[Role.Role1].work1(1);
});
