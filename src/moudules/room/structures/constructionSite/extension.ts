import ConstructionController from "moudules/constructionController/constructionController";
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
            const buildTask = this.room.workController.tasks.find(t => t.taskType === "build") as BuildTask
            //如果队列中有buildTask 且 task的id是自己   或   buildTask的priority 大于自己的prioryity  则不发布任务
            if((buildTask && buildTask.targetId == this.id) || (buildTask && buildTask.priority > priority)) return

            this.room.workController.updateTask(new BuildTask(this.id,priority),{dispath:true})

        }
        else{
            throw new Error("非自己房间")
        }

        // ConstructionController.addConstructionSite([{ pos: this.pos, type: this.structureType }])
    }
}
