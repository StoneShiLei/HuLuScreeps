

//全部任务类型
type AllTaskType = AllTransporterTaskType | AllWorkerTaskType

//任务分类类型
type AllTransporterTaskType =
    TransportTaskType |
    FillExtensionTaskType |
    FillTowerTaskType |
    NoTaskType

type AllWorkerTaskType =
    UpgradeTaskType |
    BuildContainerTaskType |
    BuildTaskType |
    RepairTaskType |
    FillWallTaskType |
    NoTaskType

//全部任务定义
type NoTaskType = "NoTask"
//transporter任务
type TransportTaskType = "transportTask"
type FillExtensionTaskType = "fillExtensionTask"
type FillTowerTaskType = "fillTower"

//worker任务
type UpgradeTaskType = "upgrade"
type BuildContainerTaskType = "buildContainer"
type BuildTaskType = "build"
type RepairTaskType = "repair"
type FillWallTaskType = "fillWall"

/**
 * 任务接口
 */
interface ITask<T extends AllTaskType>{
    //任务的全局唯一id
    id:number
    //任务的优先级
    priority:number
    //任务的工作人数
    staffCount:number
    //正在处理该任务的人数
    workUnit:number
    //任务的类型 用以关联工作逻辑
    taskType:T
}

/**
 * 任务工作逻辑接口
 */
interface ITaskAction{

    getResource(creep:Creep):boolean

    workWithTarget(creep:Creep):boolean
}


interface CreepMemory{
    taskID?:number
}



interface RoomMemory {
    //存储房间的全部任务控制器的任务队列 用于初始化任务队列
    tasks:{[type:string]:string}
    //存储房间的全部在职creep 用于初始化任务队列
    creeps:{[type:string]:string}
}



/**
 * 正在处理任务的 creep
 */
interface WorkCreep{
    /**
     * 该 creep 正在执行的工作
     * 没有任务时为空
     */
    doing?:number
}


/**
 * 新增房间任务时的配置项
 */
interface AddTaskOpt {
    /**
     * 发布任务后是否立刻重新调度
     */
    dispath?: boolean
}

/**
 * 更新任务时的配置项
 */
interface UpdateTaskOpt extends AddTaskOpt {
    /**
     * 如果未发现已存在的任务的话，将新建此任务
     */
    addWhenNotFound?: boolean
}
