import { copyFileSync } from "fs";
import { filter } from "lodash";
import { BaseTaskLogic } from "roomTasks/baseTaskLogic";
import { TransportTask } from "./transportTask";
import TransportTaskController from "./transportTaskController";

export abstract class TransportTaskLogic extends BaseTaskLogic {
    protected getEnergy(creep:Creep,controller:TransportTaskController):boolean{
        const source = this.getRoomEnergyResource(creep)
        const result = creep.getEnergyFrom(source)
        return result == OK
    }

    protected getRoomEnergyResource(creep:Creep):EnergySourceStructure{
        const structureTargets:EnergySourceStructure[] = creep.room.find<EnergySourceStructure>(FIND_STRUCTURES,{filter:(s => s && (s.structureType === STRUCTURE_CONTAINER ||
            s.structureType === STRUCTURE_LINK ) && s.store[RESOURCE_ENERGY] > 1000)})
        const result = creep.pos.findClosestByRange(structureTargets)
        if(!result) throw new Error("未找到容器")
        return result
    }
}


export class FillExtensionLogic extends TransportTaskLogic {
    constructor(creep:Creep,task:TransportTask,controller:TransportTaskController){
        super(creep,task,controller)
    }

    workLogic(): boolean {
        if(this.creep.store[RESOURCE_ENERGY] === 0) return true

        const result = this.fillSpawnStructure(this.creep)
        if(result === ERR_NOT_FOUND){
            return true
        }
        else if (result === ERR_NOT_ENOUGH_ENERGY){
            return true
        }

        return false
    }
    resourceLogic(): boolean {
        return this.getEnergy(this.creep,this.controller)
    }



    private fillSpawnStructure(creep:Creep) : OK | ERR_NOT_FOUND | ERR_NOT_ENOUGH_ENERGY {
        if (creep.store[RESOURCE_ENERGY] === 0) return ERR_NOT_ENOUGH_ENERGY
        // let target: StructureExtension | StructureSpawn

        var targets = this.creep.room.find<Structure>(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return  (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        // 获取有需求的建筑
        let target = creep.pos.findClosestByRange(targets)
        if(!target){
            target = this.creep.room.find<StructureStorage>(FIND_STRUCTURES,{
                filter:(structure) => {
                    return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < 800000
                }
            })[0]
            if(!target) return ERR_NOT_FOUND
        }

        // 有的话就填充能量
        const result = creep.transfer(target, RESOURCE_ENERGY)

        if (result === ERR_NOT_ENOUGH_RESOURCES) return ERR_NOT_ENOUGH_ENERGY
        // else if (result === ERR_FULL) delete creep.memory.fillStructureId
        else if (result != OK && result != ERR_NOT_IN_RANGE) creep.say(`拓展填充 ${result}`)
        else if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(target)
        }
        return OK
    }
}
