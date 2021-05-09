

interface RoleConfig{
    // keepAlive?:()
    getReady?(creep:Creep):boolean
    getResource?(creep:Creep):boolean
    workWithTarget(creep:Creep):boolean
    body(room:Room,spawn:StructureSpawn):BodyPartConstant[]
}

interface CreepMemory{
    //资源id
    sourceID?:Id<Source>
    //工作目标id
    targetID?:Id<Structure>
    //creep的角色
    role:AllRoles
    //是否经过了准备阶段
    ready:boolean
    //是否工作状态
    working:boolean
}



type AllRoles = BasisRoles

type BasisRoles = Harvester | Transporter | Worker

type Harvester = "harvester"
type Transporter = "transporter"
type Worker = "worker"



