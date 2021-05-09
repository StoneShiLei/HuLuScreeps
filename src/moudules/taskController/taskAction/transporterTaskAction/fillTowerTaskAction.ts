import FillTowerTask from "moudules/taskController/task/transporterTask/fillTowerTask";
import BaseTransporterTaskAction from "./baseTransporterTaskAction";

/**
 * 填充tower
 */
export default class FillTowerTaskAction extends BaseTransporterTaskAction<FillTowerTask> {

    getResource():boolean{
        return true
    }

    workWithTarget():boolean{
        return true
    }
}
