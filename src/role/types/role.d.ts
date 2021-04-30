
//#region Role和WorkData的定义

/**
 * 定义角色和workData
 */
 interface RoleDatas {
    /**
     * 房间运营
     */
    harvester: HarvesterData
    worker: WorkerData
    transporter: TransporterData
    processor: ProcessorData
}

/**
 * 用RoleDatas的key作为全部角色名定义
 */
type Role = keyof RoleDatas

 /**
  * 用RoleDatas的值作为全角色data的定义
  */
type CreepData =  RoleDatas[Role]

/**
 * 空data
 */
interface EmpytData {}

/**
 * 采集单位data
 */
interface HarvesterData {
    //能量矿ID
    sourceID:Id<Source>
    //采集房间
    harvestRoom:string
    //返回房间，指为哪个房间采集资源
    baseRoom:string
}

 /**
  * 工作单位data
  */
 interface WorkerData {
     //工作房间
     baseRoom:string
 }

/**
 * 运输单位data
 */
interface TransporterData {

    //使用的资源建筑
    resourceID:Id<StructureWithStore>
    //工作房间
    baseRoom:string
}

/**
 * 中央运输者的 data
 * x y 为其在房间中的固定位置
 */
interface ProcessorData{
    x: number
    y: number
}

//#endregion


