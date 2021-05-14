
import FillTowerTask from "../../task/transporterTask/fillTowerTask";
import BaseTransporterTaskAction from "./baseTransporterTaskAction";

/**
 * 填充tower
 */
export default class FillTowerTaskAction extends BaseTransporterTaskAction<FillTowerTask> {

    getResource():boolean{
        return this.getEnergy()
    }

    workWithTarget():boolean{
        if (this.creep.store[RESOURCE_ENERGY] === 0) return this.creep.backToGetEnergy()
        let target: StructureTower | null = null

        // 有缓存的话
        if (this.creep.memory.fillStructureId) {
            target = Game.getObjectById(this.creep.memory.fillStructureId as Id<StructureTower>)

            // 如果找不到对应的建筑或者已经填到 900 了就移除缓存
            if (!target || target.structureType !== STRUCTURE_TOWER || target.store[RESOURCE_ENERGY] > 900) {
                delete this.creep.memory.fillStructureId
                target = null
            }
        }

        //缓存已失效 从任务获取fillid
        if (!target) {
            // 先检查下任务发布 tower 能量是否足够
            target = Game.getObjectById(this.task.fillId)
            if (!target || target.store[RESOURCE_ENERGY] > 900) {
                // 然后再检查下还有没有其他 tower 没填充
                const towers = this.creep.room.find<StructureTower>(FIND_STRUCTURES,{filter:s => s.structureType === STRUCTURE_TOWER && s.store[RESOURCE_ENERGY] <= 900})

                // 如果还没找到的话就算完成任务了
                if (towers.length <= 0) {
                    this.controller.removeTask(this.task.id)
                    return this.creep.backToGetEnergy()
                }
                target = this.creep.pos.findClosestByRange(towers)
            }

            // 写入缓存
            this.creep.memory.fillStructureId = target?.id
        }

        //仍然没有目标
        if(!target){
            this.controller.removeTask(this.task.id)
            return this.creep.backToGetEnergy()
        }

        // 有的话就填充能量
        const result = this.creep.transferTo(target, RESOURCE_ENERGY)
        if (result != OK && result != ERR_NOT_IN_RANGE) this.creep.say(`填充Tower ${result}`)
        return false
    }
}
