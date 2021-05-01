
interface RoomMemory {

    //房间下某任务控制器下的tasks
    tasks:{[controllerName: string]: string}
    //房间下某任务控制器下工作的creeps
    creeps:{[controllerName: string]: string}
}
