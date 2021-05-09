

export default abstract class BaseWorkerTask implements ITask<AllWorkerTaskType>{
    //任务的全局唯一id
    id:number
    //任务的优先级
    priority:number
    //任务的工作人数
    staffCount:number
    //正在处理该任务的人数
    workUnit:number
    //任务的类型 用以关联工作逻辑
    taskType:AllWorkerTaskType

    constructor(taskType:AllWorkerTaskType,priority:number = 0,staffCount:number = 1){
        this.id = new Date().getTime() + (Game.time * 0.1)
        this.priority = priority
        this.staffCount = staffCount
        this.taskType = taskType
        this.workUnit = 0
    }
}
