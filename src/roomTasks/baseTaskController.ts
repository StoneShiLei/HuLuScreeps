import { BaseTask } from "./baseTask"
import { BaseTaskLogic } from "./baseTaskLogic"

export abstract class BaseTaskController {


    protected readonly TASK_SAVE_KEY:string
    protected readonly CREEP_SAVE_KEY:string

    public roomName:string
    public tasks:BaseTask[] = []
    public creeps:{[creepName:string]:BaseTask} = {}


    constructor(roomName:string,memoryKey:string){
        this.roomName = roomName
        this.TASK_SAVE_KEY = `${memoryKey}Tasks`
        this.CREEP_SAVE_KEY = `${memoryKey}Creeps`
        this.init()
    }

    abstract getWork(creep:Creep): BaseTaskLogic

    private init(){
        const roomMemory = Memory.rooms?.[this.roomName]
        if(!roomMemory ) return

        let taskJson = roomMemory['tasks'][this.TASK_SAVE_KEY]
        let creepJson = roomMemory['tasks'][this.CREEP_SAVE_KEY]
        this.tasks = JSON.parse(taskJson || '[]')
        this.creeps = JSON.parse(creepJson || '{}')
    }

    private save(){
        if(!Memory.rooms) Memory.rooms = {}
        if(!Memory.rooms[this.roomName]) Memory.rooms[this.roomName] = {tasks:{},creeps:{}}
        const roomMemory = Memory.rooms[this.roomName]
        if(this.tasks.length <= 0) delete roomMemory[this.TASK_SAVE_KEY as keyof RoomMemory]
        else roomMemory['tasks'][this.TASK_SAVE_KEY] = JSON.stringify(this.tasks.map(task => {
            return {...task}
        }))

        if(Object.keys(this.creeps).length <= 0) delete roomMemory[this.CREEP_SAVE_KEY as keyof RoomMemory]
        else roomMemory['tasks'][this.CREEP_SAVE_KEY] = JSON.stringify(this.creeps)
    }
}
