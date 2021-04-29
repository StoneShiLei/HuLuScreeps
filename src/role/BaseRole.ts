import { CreepWorkData, HarvesterWorkData, ProcessorData, TransporterData, WorkerData } from "./CreepWorkData"

export abstract class BaseWorkCirculate {
    abstract isKeepalive(room:Room,creepName:string,pastLifeMemory:CreepMemory): boolean
    abstract getReady(creep:Creep): boolean
    abstract getResource(creep:Creep):boolean
    abstract workingWithTarget(creep:Creep): boolean
    abstract bodys:(room:Room,spawn:StructureSpawn,data:{[key in RoleEnum]:CreepWorkData}[RoleEnum]) => BodyPartConstant[]

    // GetBodyParts(room:Room,spawn:StructureSpawn,data:CreepWorkDataDic[RoleEnum]):BodyPartConstant[]{

    // }

}

export enum RoleEnum{
    Harvester = "harvester",
    Worker = "worker",
    Transporter = "transporter",
    Processor = "processor"
}


export class RoleDatas{
    creepWorkData:Map<RoleEnum,CreepWorkData>
    //构造角色和workData的映射关系
    constructor(creepWorkData:Map<RoleEnum,CreepWorkData>){
        if(!this.creepWorkData){
            this.creepWorkData = creepWorkData
        }
    }
}

