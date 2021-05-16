import BuildTask from "../../task/wokerTask/buildTask"
import MineTask from "../../task/wokerTask/mineTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 挖矿
 */
export default class MineTaskAction extends BaseWorkerTaskAction<MineTask> {

    getResource():boolean{
        if(!this.creep.memory.data.workerData) throw new Error(this.creep.name + " 没有workerData")
        if (this.creep.store.getFreeCapacity() === 0) return true

        const workRoom = Game.rooms[this.creep.memory.data.workerData.workRoom]
        if(!workRoom) return false

        if(!workRoom.mineral) workRoom.mineral = workRoom.find(FIND_MINERALS)[0]
        // 采矿
        const mineral = workRoom.mineral
        // 找不到矿或者矿采集完了，添加延迟孵化并结束任务
        if (!mineral || mineral.mineralAmount <= 0) {
            // addSpawnMinerTask(mineral.room.name, mineral.ticksToRegeneration)
            this.controller.removeTask(this.task.id)
        }

        const harvestResult = this.creep.harvest(mineral)
        if (harvestResult === ERR_NOT_IN_RANGE) this.creep.goTo(mineral.pos)

        return false
    }

    workWithTarget():boolean{
        if(!this.creep.memory.data.workerData) throw new Error(this.creep.name + " 没有workerData")
        const workRoom = Game.rooms[this.creep.memory.data.workerData.workRoom]
        if(!workRoom) return false

        const target: StructureTerminal | undefined = workRoom.terminal
        if (!target) {
            this.creep.say('放哪？')
            this.controller.removeTask(this.task.id)
            return false
        }

        this.creep.transferTo(target, Object.keys(this.creep.store)[0] as ResourceConstant)

        if (this.creep.store.getUsedCapacity() === 0) return true

        return false
    }
}
