/*
 * @Description:
 * @Version: 2.0
 * @Autor: Stone
 * @Date: 2021-04-23 22:13:05
 * @LastEditors: Stone
 * @LastEditTime: 2021-04-28 01:55:56
 */
import { config } from "chai";
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

  class CreepWorkData {}
  class HarvesterWorkData extends CreepWorkData{
      resourceId: string
      targetId: string
      constructor(resourceId:string,targetId:string){
        super()
        this.resourceId = resourceId;
        this.targetId = targetId;
      }
  }
  class WorkerData extends CreepWorkData{
    resourceId: string
    constructor(resourceId:string){
      super()
      this.resourceId = resourceId;
    }
  }

  enum Role{
    Harvester = "harvester",
    Upgrader = "upgrader",
    Builder = "builder"
  }

  abstract class BaseWorkingLogic {
    abstract creepWorkData:CreepWorkData
    abstract isKeepalive:(room:Room,creepName:string,pastLifeMemory:CreepMemory) => boolean
    abstract getReady:(creep:Creep) => boolean
    abstract getResource:(creep:Creep) => boolean
    abstract workingWithTarget:(creep:Creep) => boolean
  }

  class HarvesterLogic implements BaseWorkingLogic{
    creepWorkData: HarvesterWorkData;
    isKeepalive: (room: Room, creepName: string, pastLifeMemory: CreepMemory) => boolean;
    getReady: (creep: Creep) => boolean;
    getResource(creep: Creep){
      let data:HarvesterWorkData = creep.memory.data
      data.resourceId
      data.targetId
      return true
    };
    workingWithTarget: (creep: Creep) => boolean;
  }

  class UpgraderLogic implements BaseWorkingLogic{
    creepWorkData: WorkerData;

    isKeepalive: (room: Room, creepName: string, pastLifeMemory: CreepMemory) => boolean;
    getReady: (creep: Creep) => boolean;
    getResource: (creep: Creep) => boolean;
    workingWithTarget: (creep: Creep) => boolean;
  }
  class BuilderLogic implements BaseWorkingLogic{
    creepWorkData: WorkerData;

    isKeepalive: (room: Room, creepName: string, pastLifeMemory: CreepMemory) => boolean;
    getReady: (creep: Creep) => boolean;
    getResource: (creep: Creep) => boolean;
    workingWithTarget: (creep: Creep) => boolean;
  }
  // class RoleLogicFactory {
  //   private workingLogic:BaseWorkingLogic
  //   constructor(workingLogic:BaseWorkingLogic){
  //     this.workingLogic = workingLogic
  //   }
  //   getWorkLogic(creepWorkData:CreepWorkData){
  //     this.workingLogic.creepWorkData = creepWorkData
  //     return this.workingLogic;
  //   }
  // }


  let roleFactory:{[key in Role]:BaseWorkingLogic} = {
    harvester: new HarvesterLogic(),
    upgrader: new UpgraderLogic(),
    builder: new BuilderLogic(),
  }

  let harvesterLogic = roleFactory[Role.Harvester]
  harvesterLogic.getResource(Game.creeps[0])

});
