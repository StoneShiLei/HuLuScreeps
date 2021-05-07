import Utils from "utils/utils"


/**
 * 任务的基类
 */
export default abstract class BaseTask{
    //任务的全局唯一id
    id:string
    //任务的优先级
    priority:number
    //任务的工作人数
    staffCount:number
    //任务的类型 用以关联工作逻辑
    taskType:AllTaskType

    constructor(priority:number,staffCount:number,taskType:AllTaskType){
        this.id = Utils.generateUUID()
        this.priority = priority
        this.staffCount = staffCount
        this.taskType = taskType
    }
}
