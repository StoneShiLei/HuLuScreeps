
interface CreepMemory{
    harvesterData:{
        //资源id
        sourceID?:Id<Source>
        //工作目标id
        targetID?:Id<Structure>
        //为该房间工作
        workRoom:string
        //要采集的房间
        harvestRoom:string
        //工作模式
        harvestMode:AllHarvestMode
        //能量丢弃位置 roomName,x,y
        droppedPos:string
    }
}


type AllHarvestMode = HarvestStartMode | HarvestContainerMode | HarvestStructureMode
type HarvestStartMode = "harvestStartMode"
type HarvestContainerMode = "harvestContainerMode"
type HarvestStructureMode = "harvestStructureMode"

type ActionStrategy = {
    [key in AllHarvestMode]: {
        prepare: (creep:Creep, source: Source) => boolean,
        source: (creep: Creep, source: Source) => boolean,
        target: (creep: Creep) => boolean,
    }
}
