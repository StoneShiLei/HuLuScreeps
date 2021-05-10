import FillExtensionTask from "moudules/taskController/task/transporterTask/fillExtensionTask";
import { creepRoleConfig } from "role";
import { creepDefaultMemory, importantRoles } from "setting";
import Utils from "utils/utils";
import RoomAccessor from "../roomAccessor";
import RoomCreepReleaseUtil from "./roomCreepReleaseUtil";
import SpawnTask from "./spawnTask";


export default class RoomSpawnController extends RoomAccessor<SpawnTask[]>{

    /**
     * creep 发布接口
     */
    release:RoomCreepReleaseUtil

    /**
     * 实例化房间孵化管理
     * @param roomName 要管理的房间名
     */
    constructor(roomName:string){
        super("roomSpawn",roomName,"spawnList",[])
        this.release = new RoomCreepReleaseUtil(this)
    }

    /**
     * 向生产队列里推送一个生产任务
     *
     * @param task 新的孵化任务
     * @returns 当前任务在队列中的排名
     */
    public addTask(task:SpawnTask):number | ERR_NAME_EXISTS{
        // 先检查下任务是不是已经在队列里了
        if(this.hasTask(task.name)) return ERR_NAME_EXISTS

        this.memory.push(task)
        this.saveMemory()

        return this.memory.length - 1
    }

    /**
     * 检查生产队列中是否包含指定任务
     *
     * @param creepName 要检查的任务名
     * @returns 有则返回 true
     */
    public hasTask(creepName: string): boolean {
        return !!this.memory.find(({ name }) => name === creepName)
    }

    /**
     * 清空任务队列
     * @danger 非测试情况下不要调用！
     */
    public clearTask(): void {
        delete Game.rooms[this.roomName].memory[this.memoryKey]
    }

    /**
     * 将当前任务挂起
     * 任务会被移动至队列末尾
     */
    public hangTask(): void {
        const task = this.memory.shift()
        if(!task) return
        this.memory.push(task)
        this.saveMemory()
    }

    /**
     * 移除第一个孵化任务
     */
    public removeCurrentTask(): void {
        this.memory.shift()
        this.saveMemory()
    }


    public runSpawn(spawn:StructureSpawn):void{
        if (spawn.spawning) {
            /**
             * 开始孵化后向物流队列推送能量填充任务
             *
             * 不在 mySpawnCreep 返回 OK 时判断是因为：
             * 由于孵化是在 tick 末的行动执行阶段进行的，所以能量在 tick 末期才会从 extension 中扣除
             * 如果返回 OK 就推送任务的话，就会出现任务已经存在了，而 extension 还是满的
             * 而 creep 恰好就是在这段时间里执行的物流任务，就会出现如下错误逻辑：
             * mySpawnCreep 返回 OK > 推送填充任务 > creep 执行任务 > 发现能量都是满的 > **移除任务** > tick 末期开始孵化 > extension 扣除能量
             */

            if(spawn.spawning.needTime - spawn.spawning.remainingTime == 1){
                this.room.transportController.updateTask(new FillExtensionTask(10),{dispath:true})
            }

            return
        }

        // 生成中 / 生产队列为空 就啥都不干
        if(spawn.spawning || this.memory.length == 0) return

        const task = this.memory[0]

        const spawnResult:SpawnReturnCode = this.spawnCreep(spawn,task)

        // 孵化成功后移除任务
        if(spawnResult === OK) this.removeCurrentTask()

        // 能量不足就挂起任务，但是如果是重要角色的话就会卡住然后优先孵化
        if(spawnResult === ERR_NOT_ENOUGH_ENERGY && !importantRoles.includes(task.role)) this.hangTask()
    }

    /**
     * 从 spawn 生产 creep
     *
     * @param spawn 要执行孵化的 spawn
     * @param task 要孵化的任务
     * @returns Spawn.spawnCreep 的返回值
     */
    private spawnCreep(spawn:StructureSpawn,task:SpawnTask):SpawnReturnCode{
        // 找不到他的工作逻辑的话直接移除任务
        const creepWork:RoleConfig = creepRoleConfig[task.role]
        if(!creepWork) return OK

        // 设置 creep 内存
        let memory:CreepMemory = {...creepDefaultMemory,spawnRoom:this.room.name,role:task.role}  //todo

        const bodys = creepWork.body(this.room,spawn)
        if(bodys.length <= 0) return ERR_NOT_ENOUGH_ENERGY

        const spawnResult:ScreepsReturnCode = spawn.spawnCreep(bodys,task.name,{memory:memory})

        if(spawnResult == OK) return OK

        if(spawnResult == ERR_NAME_EXISTS) {
            Utils.log(`${task.name} 已经存在 ${this.roomName} 将不再生成`,["roomSpawnController"],false,"yellow")
            return OK  // 这里返回 ok，然后让外层方法移除对应的孵化任务
        }

        return spawnResult

    }

}
