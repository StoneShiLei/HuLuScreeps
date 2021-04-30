
/**
 * 角色状态阶段
 *
 * 是否持续生成
 * 是否准备完毕
 * 获取资源阶段
 * 工作阶段
 * 角色身体部件
 */
export abstract class BaseWorkCirculate {
    abstract isKeepalive(room:Room,creepName:string,pastLifeMemory:CreepMemory): boolean
    abstract getReady(creep:Creep): boolean
    abstract getResource(creep:Creep):boolean
    abstract workingWithTarget(creep:Creep): boolean
    abstract bodys:(room:Room,spawn:StructureSpawn,data:{[key in Role]:CreepData}[Role]) => BodyPartConstant[]

    // GetBodyParts(room:Room,spawn:StructureSpawn,data:CreepWorkDataDic[RoleEnum]):BodyPartConstant[]{

    // }

}
