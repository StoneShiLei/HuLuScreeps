import { BaseTask } from "roomTasks/baseTask";
import { BaseTaskController } from "roomTasks/baseTaskController";
import { BaseTaskLogic } from "roomTasks/baseTaskLogic";
import { HarvestTask } from "./harvestTask";
import HarvestTaskController from "./harvestTaskController";

export class HarvestTaskStartLogic extends BaseTaskLogic {

    constructor(creep:Creep,task:HarvestTask,controller:HarvestTaskController){
        super(creep,task,controller)
    }

    workLogic(): boolean {
        // var sources = this.creep.room.find(FIND_SOURCES);
        // sources.sort(function(a,b){
        //     return a.id.localeCompare(b.id);
        // });
        // if(this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE || this.creep.store.getFreeCapacity() != 0  ) {
        //     this.creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        //     return false;
        // }

        return true
    }
    resourceLogic(): boolean {


        const sourceID = this.creep.memory.sourceID

        const source = Game.getObjectById<Source>(sourceID?? "")

        if(!source) throw new Error("没找到source")
        this.creep.getEnergyFrom(source)

        return false

        // var targets = this.creep.room.find<Structure>(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return  (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
        //             structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        //     }
        // });

        // if(targets && targets.length > 0) {
        //     this.creep.say('🔄 move to structure');
        //     targets.sort(function(a,b){
        //         return a.id.localeCompare(b.id);
        //     });
        //     let target = this.creep.pos.findClosestByRange(targets)
        //     if(!target) return false

        //     if(this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || this.creep.store.getUsedCapacity() != 0 ) {
        //         this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        //         return false
        //     }
        //     return true
        // }
        // return false
    }
}
