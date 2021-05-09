import BaseTransporterTaskAction from "./baseTransporterTaskAction";

/**
 * 填充spawn和extension
 */
export default class FillExtensionTaskAction extends BaseTransporterTaskAction {

    getResource():boolean{
        return true
    }

    workWithTarget():boolean{
        return true
    }
}
