import BuildTask from "../../task/wokerTask/buildTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 建造
 */
export default class BuildTaskAction extends BaseWorkerTaskAction<BuildTask> {

    getResource():boolean{
        return this.getEnergy()
    }

    workWithTarget():boolean{
        if (this.creep.store[RESOURCE_ENERGY] === 0) return this.creep.backToGetEnergy()

        // 有新墙就先刷新墙
        if (this.creep.memory.fillWallId) this.creep.steadyWall()
        // 没有就建其他工地，如果找不到工地了，就算任务完成
        else {
            // 优先建设任务中指定的工地
            const taskTarget = Game.getObjectById(this.task.targetId)
            if (taskTarget && this.creep.buildStructure(taskTarget) === ERR_NOT_FOUND) {
                this.controller.removeTask(this.task.id)
                return this.creep.backToGetEnergy()
            }
        }
        return false
    }
}
