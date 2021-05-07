import BaseTaskAction from "../baseTaskAction";

/**
 * 采集任务——container版
 */
export default class HarvesterContainerTaskAction extends BaseTaskAction {
    getReady?(creep:Creep):boolean

    getResource?(creep:Creep):boolean

    workWithTarget(creep:Creep):boolean{
        return true
    }
}
