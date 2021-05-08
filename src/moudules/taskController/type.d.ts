


interface RoomMemory {
    //存储房间的全部任务控制器的任务队列 用于初始化任务队列
    tasks:{[type:string]:string}
    //存储房间的全部在职creep 用于初始化任务队列
    creeps:{[type:string]:string}
}



interface WorkCreep{
    doing?:string
}


//全部任务类型
type AllTaskType = AllTransporterTaskType

//任务分类类型
type AllTransporterTaskType = TransportTask

//全部任务定义
type TransportTask = "transportTask"
