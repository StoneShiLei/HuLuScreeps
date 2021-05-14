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

            priority += 5
            const buildTask = this.room.workController.tasks.find(t => t.taskType === "build")
            //如果队列中没有buildTask 或 task的id是自己 或 buildTask的优先级高于自己的优先级
            if(!buildTask || buildTask.id == priority ||buildTask.priority >= priority) return

            this.room.workController.updateTask(new BuildTask(this.id,priority + 5,2),{dispath:true})

        }
        else{
            throw new Error("非自己房间")
        }
    }
}
