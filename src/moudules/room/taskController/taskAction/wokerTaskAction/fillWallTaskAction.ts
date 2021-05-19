
import FillWallTask from "../../task/wokerTask/fillWallTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 刷墙
 */
export default class FillWallTaskAction extends BaseWorkerTaskAction<FillWallTask> {

    getResource():boolean{
        return this.getEnergy()
    }

    workWithTarget():boolean{
        let importantWall: StructureWall | StructureRampart | null = this.creep.room._importantWall
        // 先尝试获取焦点墙，有最新的就更新缓存，没有就用缓存中的墙
        if (importantWall) this.creep.memory.fillWallId = importantWall.id
        else if (this.creep.memory.fillWallId) importantWall = Game.getObjectById(this.creep.memory.fillWallId)

        // 有焦点墙就优先刷
        if (importantWall) {
            const actionResult = this.creep.repair(importantWall)
            // if(this.creep.name === 'E1N29 worker0') console.log(actionResult)
            if (actionResult == ERR_NOT_IN_RANGE) this.creep.goTo(importantWall.pos)
        }
        // 否则就按原计划维修
        else {
            const filling = this.creep.fillDefenseStructure()
            if (!filling) this.controller.removeTask(this.task.id)
        }

        if (this.creep.store.getUsedCapacity() === 0) return this.creep.backToGetEnergy()

        return false
    }
}
