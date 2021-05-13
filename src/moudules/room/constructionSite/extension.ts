import { BUILD_PRIORITY } from "setting";
import BuildTask from "../taskController/task/wokerTask/buildTask";


export default class ContructionSiteExtension extends ConstructionSite {

    onWork():void{
        if(!this.isActive){
            let priority = 0
            const BUILD_PRIORITY_REVERSE = BUILD_PRIORITY.reverse()
            for (const type of BUILD_PRIORITY_REVERSE) {
                if(this.structureType !== type) continue
                priority = BUILD_PRIORITY_REVERSE.indexOf(this.structureType)
                if(priority < 0) priority = 0
            }
            this.room?.workController.addTask(new BuildTask(this.id,priority))
        }
    }
}
