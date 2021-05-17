import Utils from "utils/utils"
import UpgradeTask from "../../task/wokerTask/upgradeTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 升级控制器
 */
export default class UpgradeTaskAction extends BaseWorkerTaskAction<UpgradeTask> {

    getResource():boolean{
        return this.getEnergy()
    }

    workWithTarget():boolean{

        if(!this.creep.memory.data.workerData) return true
        const workRoom = this.creep.memory.data.workerData.workRoom
        const result = this.creep.upgradeRoom(workRoom)
        if(result === ERR_NOT_ENOUGH_RESOURCES){
            return this.creep.backToGetEnergy()
        }
        if(result !== ERR_NOT_IN_RANGE && result !== OK){
            this.creep.say("upgrade" + result)
            Utils.log(`升级任务异常，upgradeRoom 返回值: ${result}`)
        }
        return false
    }
}
