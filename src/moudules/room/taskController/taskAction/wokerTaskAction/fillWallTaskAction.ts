
import FillWallTask from "../../task/wokerTask/fillWallTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 刷墙
 */
export default class FillWallTaskAction extends BaseWorkerTaskAction<FillWallTask> {

    getResource():boolean{
        return true
    }

    workWithTarget():boolean{
        return true
    }
}
