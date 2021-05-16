import Utils from "utils/utils"
import RepairTask from "../../task/wokerTask/repairTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 修理
 */
export default class RepairTaskAction extends BaseWorkerTaskAction<RepairTask> {

    getResource():boolean{
        return this.getEnergy()
    }

    workWithTarget():boolean{
        if(this.creep.store[RESOURCE_ENERGY] === 0) return this.creep.backToGetEnergy()

        if(!this.creep.memory.data.workerData) throw new Error(this.creep.name + " 没有workerData")
        const room = Game.rooms[this.creep.memory.data.workerData.workRoom]
        if(!room){
            this.controller.removeTask(this.task.id)
            return true
        }

        let target:AnyStructure | null  =  Game.getObjectById(this.creep.memory.repairStructureId ?? "")
        if(!target){
            const damagedStructures = room.find(FIND_STRUCTURES,{filter: s=>s.hits<s.hitsMax && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL})
            if(damagedStructures.length > 0) {
                target = this.creep.pos.findClosestByRange(damagedStructures)
                if(target) this.creep.memory.repairStructureId = target.id
            }
        }

        if(!target){
            this.controller.removeTask(this.task.id)
            delete this.creep.memory.repairStructureId
            return true
        }

        if(target.hits >= target.hitsMax) delete this.creep.memory.repairStructureId

        const result = this.creep.repair(target)
        if(result === ERR_NOT_IN_RANGE) this.creep.goTo(target.pos,{range:2})
        else if(result === ERR_NOT_ENOUGH_ENERGY) return this.creep.backToGetEnergy()
        else if(result !== OK){
            this.creep.say(`repair ${result}`)
            Utils.log(`维修任务异常，repair 返回值: ${result}`)
        }

        return false
    }
}
