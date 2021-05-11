import RepairTask from "../../task/wokerTask/repairTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 修理
 */
export default class RepairTaskAction extends BaseWorkerTaskAction<RepairTask> {

    getResource():boolean{
        return true
    }

    workWithTarget():boolean{
        return true
    }
}
