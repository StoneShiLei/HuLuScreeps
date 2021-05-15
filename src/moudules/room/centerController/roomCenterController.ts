import RoomAccessor from "../roomAccessor";
import CenterTask from "./centerTask";



export default class RoomCenterController extends RoomAccessor<CenterTask[]>{

    constructor(roomName:string){
        super('CenterController',roomName,'centerList',[])
    }

    /**
     * 获取该模块的任务列表
     */
    public get tasks(): CenterTask[] {
        return this.memory
    }

    /**
     * 将队列信息绘制到房间上
     * @param startX 绘制窗口左上角 X 坐标
     * @param startY 绘制窗口左上角 Y 坐标
     */
    public draw(startX: number, startY: number): void {
        const data = this.memory
        if(!data) return
        let logs:string[] = []
        for(const task of data){
            logs.push(`${task.submit}: [${task.source}--${task.resourceType}:${task.amount}--> ${task.target}]`)
        }
        const info = [`Center队列 ${logs.join(', ')}`]

        const room = Game.rooms[this.roomName]
        const style: TextStyle = { align: 'left', opacity: 0.5 }
        info.map((log, index) => room.visual.text(log, startX, startY + index, style))
    }


    //获取房间中央建筑群的指定建筑
    public static GetCenterStructure(room:Room,type:CenterStructures){
        //获取target
        let target:StructureTerminal | StructureStorage | StructureFactory | StructureLink | null = null
        if(type === "centerLink" && room.memory.centerLinkID){
            target = Game.getObjectById(room.memory.centerLinkID)
        }
        else{
            const structures = room.find<StructureTerminal | StructureStorage | StructureFactory>(FIND_STRUCTURES,{filter:s => s.structureType === type})
            target = structures.find(s => s.structureType === type) ?? null
        }
        return target
    }


    /**
     * 添加任务
     *
     * @param task 要提交的任务
     * @param priority 任务优先级位置，默认追加到队列末尾。例：该值为 0 时将无视队列长度直接将任务插入到第一个位置
     * @returns 任务的排队位置, 0 是最前面，负数为添加失败，-1 为已有同种任务,-2 为目标建筑无法容纳任务数量
     */
    public addTask(task:CenterTask,priority:number | null = null):number{
        if (this.hasTask(task.submit)) return -1
        // 由于这里的目标建筑限制型和非限制型存储都有，这里一律作为非限制性检查来减少代码量

        //获取target
        const target = RoomCenterController.GetCenterStructure(this.room,task.target)

        if (target && (target.store as StoreDefinitionUnlimited).getFreeCapacity(task.resourceType) < task.amount) return -2

        if (!priority) this.memory.push(task)
        else this.memory.splice(priority, 0, task)

        return this.memory.length - 1
    }

    /**
     * 获取中央队列中第一个任务信息
     *
     * @returns 有任务返回任务, 没有返回 null
     */
    public getTask(): CenterTask | undefined {
        return this.memory[0]
    }

    /**
     * 每个建筑同时只能提交一个任务
     *
     * @param submit 提交者的身份
     * @returns 是否有该任务
     */
    public hasTask(submit: CenterStructures | number): boolean {
        const task = this.memory.find(task => task.submit === submit)
        return !!task
    }

    /**
     * 暂时挂起当前任务
     * 会将任务放置在队列末尾
     *
     * @returns 任务的排队位置, 0 是最前面
     */
    public hangTask(): number {
        const task = this.memory.shift()
        if(!task) return -1
        this.memory.push(task)
        this.saveMemory()
        return this.memory.length - 1
    }

    /**
     * 处理任务
     *
     * @param submitId 提交者的 id
     * @param transferAmount 本次转移的数量
     */
    public handleTask(transferAmount: number): void {
        this.memory[0].amount -= transferAmount
        if (this.memory[0].amount <= 0) {
            this.deleteCurrentTask()
        }
        else this.saveMemory()
    }

    /**
     * 移除当前中央运输任务
     */
    public deleteCurrentTask(): void {
        this.memory.shift()
        this.saveMemory()
    }
}
