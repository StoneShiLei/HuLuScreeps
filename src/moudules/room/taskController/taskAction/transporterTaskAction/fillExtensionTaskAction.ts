import Utils from "utils/utils";
import FillExtensionTask from "../../task/transporterTask/fillExtensionTask";
import BaseTransporterTaskAction from "./baseTransporterTaskAction";

/**
 * 填充spawn和extension
 */
export default class FillExtensionTaskAction extends BaseTransporterTaskAction<FillExtensionTask> {

    getResource():boolean{
        return this.getEnergy()
    }

    workWithTarget():boolean{
        if(this.creep.store[RESOURCE_ENERGY] === 0) return this.creep.backToGetEnergy()

        const result = this.fillSpawnStructure()
        if(result === ERR_NOT_FOUND){
            this.controller.removeTask(this.task.id)
            return this.creep.backToGetEnergy()
        }
        else if(result == ERR_NOT_ENOUGH_ENERGY){
            return this.creep.backToGetEnergy()
        }

        return false
    }

    private fillSpawnStructure():OK | ERR_NOT_FOUND | ERR_NOT_ENOUGH_ENERGY{
        if(this.creep.store[RESOURCE_ENERGY] === 0) return ERR_NOT_ENOUGH_ENERGY
        let target:StructureExtension | StructureSpawn | null = null

        //使用缓存
        if(this.creep.memory.fillStructureId){
            target = Game.getObjectById(this.creep.memory.fillStructureId as Id<StructureExtension>)

            //如果找不到对应的建筑或者建筑已被填满就移除缓存
            if(!target || target.structureType !== STRUCTURE_EXTENSION || target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0){
                delete this.creep.memory.fillStructureId
                target = null
            }
        }

        //没有缓存则重新获取
        if(!target){
            const extensions = this.creep.room.find<StructureExtension>(FIND_STRUCTURES,
                {filter:s => s && s.structureType === STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0})
            const spawns = this.creep.room.find<StructureSpawn>(FIND_STRUCTURES,
                {filter:s => s && s.structureType === STRUCTURE_SPAWN && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0})
            const needFillStructure = [...extensions,...spawns]
            target = this.creep.pos.findClosestByRange(needFillStructure)

            if(!target) return ERR_NOT_FOUND

            //写入缓存
            this.creep.memory.fillStructureId = target.id
        }

        const result = this.creep.transferTo(target,RESOURCE_ENERGY)
        if(result === ERR_NOT_ENOUGH_RESOURCES) return ERR_NOT_ENOUGH_ENERGY
        if(result === ERR_FULL) delete this.creep.memory.fillStructureId
        if(result !== OK && result != ERR_NOT_IN_RANGE) {
            this.creep.say(`fillEx ${result}`)
            Utils.log(`填扩展任务异常，transferTo 返回值: ${result}`)
        }
        return OK
    }
}
