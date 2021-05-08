import BaseTask from "../task/baseTask"
import BaseTaskAction from "../taskAction/baseTaskAction"


export default abstract class BaseTaskController {

    //任务队列的内存key
    TASK_SAVE_KEY:string
    //在职creep的内存key
    CREEP_SAVE_KEY:string
    //控制器所属房间
    roomName:string
    //任务队列
    tasks:BaseTask[] = []
    //在职creep
    creeps:{[creepName:string]:WorkCreep} = {}

    abstract getAction(creep:Creep):BaseTaskAction

    constructor(roomName:string,type:string){
        this.roomName = roomName;
        this.TASK_SAVE_KEY = `${type}Tasks`;
        this.CREEP_SAVE_KEY = `${type}Creeps`;
        this.init()
    }


    public AddTask(){

    }

    public RemoveTask(){

    }

    public UpdateTask(){

    }

    private distributionTask(){

    }

    private init():void{
        const roomMemory = Memory.rooms[this.roomName]
        const tasksJson = roomMemory.tasks[this.TASK_SAVE_KEY]
        const creepsJson = roomMemory.creeps[this.CREEP_SAVE_KEY]
        this.tasks = JSON.parse(tasksJson || '[]')
        this.creeps = JSON.parse(creepsJson || '{}')
    }

    private save():void{
        if(!Memory.rooms) Memory.rooms = {}
        if(!Memory.rooms[this.roomName]){
            Memory.rooms[this.roomName].tasks = {}
            Memory.rooms[this.roomName].creeps = {}
        }

        const roomMemory = Memory.rooms[this.roomName]
        if(this.tasks.length <= 0) delete roomMemory.tasks[this.TASK_SAVE_KEY]
        else roomMemory.tasks[this.TASK_SAVE_KEY] = JSON.stringify(this.tasks.map(task =>{return Object.assign({},task)}))

        if(Object.keys(this.creeps).length <= 0) delete roomMemory.creeps[this.CREEP_SAVE_KEY]
        else roomMemory.creeps[this.CREEP_SAVE_KEY] = JSON.stringify(this.creeps);
    }
}
