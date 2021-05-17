

interface RoleConfig{
    keepAlive?(room:Room,memory:CreepMemory):boolean
    getReady?(creep:Creep):boolean
    getResource?(creep:Creep):boolean
    workWithTarget(creep:Creep):boolean
    body(room:Room,spawn:StructureSpawn,data:CreepData):BodyPartConstant[]
}

interface CreepMemory{

    //creep的角色
    role:AllRoles
    //是否经过了准备阶段
    ready:boolean
    //是否工作状态
    working:boolean
}

type AllData = EmptyData | HarvesterData | TransporterData | WorkerData | CenterData
type AllRoles = BasisRoles | RemoteRoles


type BasisRoles = Harvester | Transporter | Worker | Center
type Harvester = "harvester"
type Transporter = "transporter"
type Worker = "worker"
type Center = "center"


type RemoteRoles = Claimer | UpgradeSupporter | BuildSupporter
type Claimer = "claimer"
type UpgradeSupporter = "upgradeSupporter"
type BuildSupporter = "buildSupporter"



interface CreepMemory{
    data:CreepData
    /**
     * 可以执行建筑的单位特有，当该值为 true 时将不会尝试建造
     */
    dontBuild?: boolean
}

interface CreepData{
    harvesterData?:HarvesterData
    transporterData?:TransporterData
    workerData?:WorkerData
    centerData?:CenterData
    claimerData?:RemoteDeclarerData
    upgradeSupporterData?:SupporterData
    buildSupporterData?:SupporterData

}

interface EmptyData{}

interface HarvesterData{
    //资源id
    sourceID:Id<Source>
    //工作目标id
    targetID?:Id<Structure>
    //为该房间工作
    workRoom:string
    //要采集的房间
    harvestRoom:string
    //工作模式
    harvestMode?:AllHarvestMode
    //能量丢弃位置 roomName,x,y
    droppedPos?:string
}

interface TransporterData{
    //要使用的资源存放建筑 id
    sourceID?:Id<StructureWithStore>
    //该 creep 的工作房间
    //例如一个外矿搬运者需要知道自己的老家在哪里
    workRoom: string
}

interface WorkerData{
    //该 creep 的工作房间
    workRoom: string
}

interface CenterData {
    x: number
    y: number
}

/**
 * 远程声明单位的 data
 * 这些单位都会和目标房间的 controller 打交道
 */
interface RemoteDeclarerData {
    /**
     * 要声明控制的房间名
     */
    targetRoomName: string
    /**
     * 给控制器的签名
     */
    signText?: string
}

/**
 * 远程协助单位的 data
 */
interface SupporterData {
    /**
     * 要支援的房间名
     */
    targetRoomName: string
    /**
     * 该房间中的能量来源
     */
    sourceId: Id<Source | StructureContainer | StructureStorage | StructureTerminal>
}
