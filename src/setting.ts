  // class CreepWorkData {}
  // class HarvesterWorkData extends CreepWorkData{
  //     resourceId: string
  //     targetId: string
  //     constructor(resourceId:string,targetId:string){
  //       super()
  //       this.resourceId = resourceId;
  //       this.targetId = targetId;
  //     }
  // }
  // class WorkerData extends CreepWorkData{
  //   resourceId: string
  //   constructor(resourceId:string){
  //     super()
  //     this.resourceId = resourceId;
  //   }
  // }

  // enum Role{
  //   Harvester = "harvester",
  //   Upgrader = "upgrader",
  //   Builder = "builder"
  // }

  // abstract class BaseWorkingLogic {
  //   abstract isKeepalive(room:Room,creepName:string,pastLifeMemory:CreepMemory): boolean
  //   abstract getReady(creep:Creep): boolean
  //   abstract getResource(creep:Creep):boolean
  //   abstract workingWithTarget(creep:Creep): boolean
  // }

  // class HarvesterLogic extends BaseWorkingLogic{
  //   isKeepalive(room: Room, creepName: string, pastLifeMemory: CreepMemory): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   getReady(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   getResource(creep: Creep):boolean{
  //     let data:HarvesterWorkData = creep.memory.data
  //     data.resourceId
  //     data.targetId
  //     return true
  //   };
  //   workingWithTarget(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }

  // }
  // class UpgraderLogic extends BaseWorkingLogic{
  //   isKeepalive(room: Room, creepName: string, pastLifeMemory: CreepMemory): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   getReady(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   getResource(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   workingWithTarget(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }

  // }
  // class BuilderLogic extends BaseWorkingLogic{
  //   isKeepalive(room: Room, creepName: string, pastLifeMemory: CreepMemory): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   getReady(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   getResource(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  //   workingWithTarget(creep: Creep): boolean {
  //     throw new Error("Method not implemented.");
  //   }
  // }

  // let roles:{[key in Role]:BaseWorkingLogic} = {
  //   harvester: new HarvesterLogic(),
  //   upgrader: new UpgraderLogic(),
  //   builder: new BuilderLogic(),
  // }

  // let harvesterLogic = roles["harvester"]
  // harvesterLogic.getResource(Game.creeps[0])
