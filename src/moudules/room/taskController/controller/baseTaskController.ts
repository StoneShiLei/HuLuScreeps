
export default abstract class BaseTaskController<TaskType extends AllTaskType,Task extends ITask<TaskType>> {

    //任务队列的内存key
    TASK_SAVE_KEY:string
    //在职creep的内存key
    CREEP_SAVE_KEY:string
    //控制器所属房间
    roomName:string
    //任务队列
    tasks:Task[] = []
    //在职creep
    creeps:{[creepName:string]:WorkCreep} = {}
    //任务控制器类型
    type:string

    abstract getAction(creep:Creep):ITaskAction

    constructor(roomName:string,type:string){
        this.roomName = roomName;
        this.TASK_SAVE_KEY = `${type}Tasks`;
        this.CREEP_SAVE_KEY = `${type}Creeps`;
        this.type = type
        this.init()
    }


    /**
     * 发布新任务
     *
     * @param task 要发布的新任务
     * @param opt 配置项
     */
    public addTask(task: Task, opt: AddTaskOpt = {}):number {
        const addOpt:UpdateTaskOpt = {dispath:false}
        Object.assign(addOpt,opt)

        let insertIndex = this.tasks.length

        // 因为 this.tasks 是按照优先级降序的，所以这里要找到新任务的插入索引
        this.tasks.find((existTask,index) =>{
            if(existTask.priority >= task.priority) return false

            insertIndex = index
            return true
        })

        // 在目标索引位置插入新任务并重新分配任务
        this.tasks.splice(insertIndex,0,task)
        if(addOpt.dispath) this.distributionTask()
        this.save()

        return task.id
    }

    /**
     * 移除一个任务
     *
     * @param taskIdentifier 要移除的任务索引（key 或者 type）
     */
    public removeTask(taskIdentifier: number): OK | ERR_NOT_FOUND
    public removeTask(taskIdentifier: AllTaskType): OK | ERR_NOT_FOUND
    public removeTask(taskIdentifier: number | AllTaskType): OK | ERR_NOT_FOUND {
        const removeTaskIDs:number[] = []

        // 移除任务并收集被移除的任务索引
        this.tasks = this.tasks.filter(task => {
            const prop = (typeof taskIdentifier === 'number') ? 'id' : 'taskType'
            if(task[prop] !== taskIdentifier.toString()) return true
            removeTaskIDs.push(task.id)
            return false
        })

        //给移除任务所影响的单位重新分配任务
        this.getUnit(({doing}) => {
            if(!doing) return false
            return removeTaskIDs.includes(doing)
        }).map(creep => this.distributionCreep(creep))

        this.save()
        return OK
    }

    /**
     * 更新指定任务
     * 如果任务包含 key 的话将使用 key 进行匹配
     * 否则的话将更新 taskType 符合的任务（如果包含多个同类型的任务的话则都会更新）
     *
     * @param newTask 要更新的任务
     * @param addWhenNotFound 当没有匹配到任务时是否新建任务，默认为 true
     * @returns 被更新任务的索引，如果新建了任务则返回新任务的索引，若更新了多个任务的话则返回最后一个任务的索引
     */
    public updateTask(newTask: Task, opt: UpdateTaskOpt = {}): number {
        const updateTaskOpt:UpdateTaskOpt = {addWhenNotFound:true}
        Object.assign(updateTaskOpt,opt)

        // 是否找到了要更新的任务
        let notFound = true
        // 是否需要重新分派任务
        let needRedispath = false
        // 要更新任务的索引
        let taskID = newTask.id

        // 查找并更新任务
        this.tasks = this.tasks.map(task => {
            if(task.id !== newTask.id && task.taskType !== newTask.taskType) return task

            notFound = false
            taskID = newTask.id || task.id

            // 状态变化就需要重新分派
            if(task.priority !== newTask.priority || task.staffCount !== newTask.staffCount) needRedispath = true
            newTask.id = task.id
            return Object.assign(task,newTask)
        })

        if(notFound && updateTaskOpt.addWhenNotFound) taskID = this.addTask(newTask,updateTaskOpt)
        else if(needRedispath) this.distributionTask()

        return taskID
    }


    /**
     * 是否存在某个（种）任务
     *
     * @returns 存在则返回 true，不存在返回 false
     */
    public hasTask(taskIdentifier:number | TaskType):boolean{
        if(typeof taskIdentifier == 'string') return !!this.tasks.find(task => task.taskType === taskIdentifier)
        else return !!this.tasks.find(task => task.id === taskIdentifier)
    }

    /**
     * 通过任务索引获取指定任务
     *
     * @param taskKey 要查询的任务索引
     * @returns 对应的任务，没有的话则返回 undefined
     */
    public getTask(taskID:number | undefined):Task | undefined{
        if(!taskID) return undefined
        return this.tasks.find(task => task.id === taskID) as Task
    }

    /**
     * 获取可用的单位
     * 如果单位死掉了的话将直接移除
     *
     * @param filter 筛选器，接受 creep 数据与 creep 本身，返回是否选择
     */
    public getUnit(filter?:(info:WorkCreep,creep:Creep) => boolean):Creep[]{
        const units:Creep[] = []

        for(const creepName in this.creeps){
            const creep = Game.creeps[creepName]

            if(!creep){
                this.removeCreep(creepName)
                continue
            }

            if(filter && !filter(this.creeps[creepName],creep)) continue

            units.push(creep)
        }

        return units
    }

    /**
     * 获取单位的待执行任务
     * @param creep 要获取待执行任务的 creep
     */
    public getUnitTask(creep:Creep):Task | undefined{
        const doingTaskID = this.creeps[creep.name]?.doing
        let doingTask = this.getTask(doingTaskID)
        if(!doingTask){
            doingTask = this.distributionCreep(creep)
            this.creeps[creep.name] = doingTask?{doing:doingTask.id}:{}
        }

        return doingTask
    }

    /**
     * 移除一个工作单位
     * 不调用的话也不影响模块运行（任务调度时会自行清理）
     * 在对应工作单位去世时主动调用可以获得更准确的任务分派
     * @param creepName
     */
    public removeCreep(creepName:string):void{
        const taskID = this.creeps[creepName].doing
        this.removeTaskUnit(this.getTask(taskID))
        delete this.creeps[creepName]
    }

    /**
     * 为全部可用creep分配任务
     */
    private distributionTask(){
        this.tasks = _.sortBy(this.tasks,task=> -task.priority)

        // 获取所有可工作的 creep，并解除与对应工作任务的绑定
        const units = this.getUnit(({doing},creep) =>{
            this.removeTaskUnit(this.getTask(doing),creep)
            return true
        })

        // 为每个creep重新分配任务
        units.map(creep => this.distributionCreep(creep))
    }

    /**
     * 为指定creep分配任务
     * @param creep
     * @returns
     */
    private distributionCreep(creep:Creep):Task | undefined{
        if(this.creeps[creep.name]) this.creeps[creep.name].doing = undefined
        delete creep.memory.taskID

        let overflow = false

        for(let i=0;i<this.tasks.length;i++){
            const checkTask = this.tasks[i]

            const result = this.isCreepMatchTask(creep,checkTask,overflow)

            if(result){
                this.setTaskUnit(checkTask,creep)
                return checkTask
            }

            if(i>= this.tasks.length - 1 && !overflow){
                overflow = true
                i = -1
            }
        }

        //没有任务
        return undefined
    }

    /**
     * 为该任务添加指定工人
     * @param task
     * @param unit
     * @returns
     */
    private setTaskUnit(task:Task,unit:Creep):void{
        if(!task || !unit) return

        task.workUnit = (task.workUnit > 0) ? task.workUnit + 1 : 1
        if(!this.creeps[unit.name]) this.creeps[unit.name] = {}

        this.creeps[unit.name].doing = task.id
        unit.memory.taskID = task.id
    }

    /**
     * 移除该任务下的指定工人
     * @param task
     * @param unit
     * @returns
     */
    private removeTaskUnit(task?:Task,unit?:Creep):void{
        if(unit){
            if(this.creeps[unit.name]) this.creeps[unit.name].doing = undefined
            delete unit.memory.taskID
        }

        if(!task) return
        task.workUnit = (task.workUnit < 1) ? 0 : task.workUnit -1
    }

    /**
     * 检查creep是否匹配该任务
     * @param creep
     * @param task
     * @param ignoreStaffCount
     * @returns
     */
    private isCreepMatchTask(creep:Creep,task:Task,ignoreStaffCount:boolean):boolean{
        const { staffCount,workUnit } = task

        //检查人数是否足够（人数溢出后无视此限制）
        if(!ignoreStaffCount && workUnit >= staffCount) return false

        return true
    }

    /**
     * 初始化控制器data
     */
    private init():void{
        const roomMemory = Memory.rooms[this.roomName]
        if(!roomMemory.tasks) roomMemory.tasks = {[this.TASK_SAVE_KEY]:'[]'}
        if(!roomMemory.creeps) roomMemory.creeps = {[this.CREEP_SAVE_KEY]:'{}'}
        const tasksJson = roomMemory.tasks[this.TASK_SAVE_KEY]
        const creepsJson = roomMemory.creeps[this.CREEP_SAVE_KEY]
        this.tasks = JSON.parse(tasksJson || '[]')
        this.creeps = JSON.parse(creepsJson || '{}')
    }

    /**
     * 序列化控制器data
     */
    private save():void{
        if(!Memory.rooms) Memory.rooms = {}
        if(!Memory.rooms[this.roomName]){
            Memory.rooms[this.roomName].tasks = {}
            Memory.rooms[this.roomName].creeps = {}
        }

        const roomMemory = Memory.rooms[this.roomName]
        if(this.tasks.length <= 0) delete roomMemory.tasks[this.TASK_SAVE_KEY]
        else roomMemory.tasks[this.TASK_SAVE_KEY] = JSON.stringify(this.tasks.map(task =>{return {...task,workUnit:0}}))
        if(Object.keys(this.creeps).length <= 0) delete roomMemory.creeps[this.CREEP_SAVE_KEY]
        else roomMemory.creeps[this.CREEP_SAVE_KEY] = JSON.stringify(this.creeps);
    }


    /**
     * 打印当前任务队列到控制台
     */
    public show(): string {
        const logs = this.tasks.map(task => JSON.stringify(task))
        return logs.join('\n')
    }

    /**
     * 将队列信息绘制到房间上
     * @param startX 绘制窗口左上角 X 坐标
     * @param startY 绘制窗口左上角 Y 坐标
     */
    public draw(startX: number, startY: number): void {
        const logs = [ `已注册单位 ${Object.keys(this.creeps).join(', ')}` ]
        logs.push(...this.tasks.map(task => `[类型] ${task.taskType} [索引] ${task.id} [需求数量] ${task.staffCount} [执行数量] ${task.workUnit} [优先级] ${task.priority}`))

        const room = Game.rooms[this.roomName]
        const style: TextStyle = { align: 'left', opacity: 0.5 }
        logs.map((log, index) => room.visual.text(log, startX, startY + index, style))
    }
}
