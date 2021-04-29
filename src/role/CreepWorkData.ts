
/**
 * 空data
 */
export class CreepWorkData {}

/**
 * 采集单位data
 */
export class HarvesterWorkData extends CreepWorkData{
    //能量矿ID
    sourceID:Id<Source>
    //采集房间
    harvestRoom:string
    //返回房间，指为哪个房间采集资源
    baseRoom:string

    constructor(sourceID:Id<Source>,harvestRoom:string,baseRoom:string ){
        super()
        this.sourceID = sourceID;
        this.harvestRoom = harvestRoom;
        this.baseRoom = baseRoom;
    }
}

/**
 * 工作单位data
 */
export class WorkerData extends CreepWorkData{
    //工作房间
    baseRoom:string
    constructor(baseRoom:string){
        super()
        this.baseRoom = baseRoom;
    }
}

/**
 * 运输单位data
 */
export class TransporterData extends CreepWorkData{

    //使用的资源建筑
    resourceID:Id<StructureWithStore>

    //工作房间
    baseRoom:string
    constructor(resourceID:Id<StructureWithStore>,baseRoom:string) {
        super()
        this.resourceID = resourceID
        this.baseRoom = baseRoom
    }
}

/**
 * 中央运输者的 data
 * x y 为其在房间中的固定位置
 */
 export class ProcessorData extends CreepWorkData{
    x: number
    y: number
    constructor(x:number,y:number){
        super()
    }
}
