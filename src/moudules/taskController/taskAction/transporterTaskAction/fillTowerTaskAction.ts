import BaseTransporterTaskAction from "./baseTransporterTaskAction";

/**
 * 填充tower
 */
export default class FillTowerTaskAction extends BaseTransporterTaskAction {

    getResource():boolean{
        return true
    }

    workWithTarget():boolean{
        return true
    }
}
