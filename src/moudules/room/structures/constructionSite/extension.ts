import BuildTask from "moudules/room/taskController/task/wokerTask/buildTask";
import { BUILD_PRIORITY } from "setting";


export default class ContructionSiteExtension extends ConstructionSite {

    onWork():void{
        if(this.structureType === STRUCTURE_CONTAINER) return
        if(this.room){

            let priority = 0
            const BUILD_PRIORITY_REVERSE = BUILD_PRIORITY.reverse()
            for (const type of BUILD_PRIORITY_REVERSE) {
                if(this.structureType !== type) continue
                priority = BUILD_PRIORITY_REVERSE.indexOf(this.structureType)
                if(priority < 0) priority = 0
            }

            //如果任务队列包含build任务且 优先级和此建筑的优先级一致  则跳过
            if(this.room.workController.hasTask("build") &&  this.room.workController.tasks.find(t => t.taskType === "build" && t.priority == (priority + 5)) ) return

            this.room.workController.updateTask(new BuildTask(undefined,priority + 5,2),{dispath:true})

        }
        else{
            throw new Error("非自己房间")
        }
    }
}
