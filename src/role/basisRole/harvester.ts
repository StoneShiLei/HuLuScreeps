import { BaseRole } from "role/baseRole";


export class Harvester extends BaseRole {

    keepAlive?(room: Room): boolean
    getReady?(creep: Creep): boolean{
        const containerID = creep.memory.containerID
        const container = Game.getObjectById<StructureContainer>(containerID ?? "")
        if(!container) throw new Error("没找到container")

        if(creep.moveTo(container.pos) != OK){
            return false
        }

        if(container.hits < container.hitsMax){
            const sourceID = creep.memory.sourceID
            const source = Game.getObjectById<Source>(sourceID?? "")
            if(!source) throw new Error("没找到source")
            if(creep.store[RESOURCE_ENERGY] < 50){
                creep.getEnergyFrom(source)
            }
            creep.repair(container)
            return false
        }

        return true
    }

    getResource?(creep: Creep): boolean {
        return creep.room.harvestController.getWork(creep).resourceLogic()
    }
    workWithTarget(creep: Creep): boolean {
        return creep.room.harvestController.getWork(creep).workLogic()
    }

}
