import BaseTransporterTaskAction from "./baseTransporterTaskAction";

/**
 * 从A点将能量搬运至B点
 */
export default class TransportTaskAction extends BaseTransporterTaskAction {

    getResource():boolean{
        // if(this.creep.store[this.task])
        return true
    }

    workWithTarget():boolean{
        return true
    }
}
