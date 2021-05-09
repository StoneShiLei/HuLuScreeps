import UpgradeTask from "moudules/taskController/task/wokerTask/upgradeTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 升级控制器
 */
export default class UpgradeTaskAction extends BaseWorkerTaskAction<UpgradeTask> {

    getResource():boolean{
        return this.getEnergy()
    }

    workWithTarget():boolean{
        const workRoom = this.creep.memory.workerData.workRoom

        if(this.creep.upgradeRoom(workRoom) === ERR_NOT_ENOUGH_RESOURCES){
            return this.creep.backToGetEnergy()
        }

        return false
    }
}
