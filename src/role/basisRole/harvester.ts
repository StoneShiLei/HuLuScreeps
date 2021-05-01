import { BaseRole } from "role/baseRole";
import { harvesterController } from "roomTasks";



export class Harvester extends BaseRole {
    // bodyPart: BodyPartConstant[];

    // constructor(bodyPart:BodyPartConstant[]) {
    //     super()
    //     this.bodyPart = bodyPart
    // }

    keepAlive?(room: Room): boolean
    getReady?(creep: Creep): boolean

    getResource?(creep: Creep): boolean {
        return harvesterController.getWork(creep).resourceLogic()
    }
    workWithTarget(creep: Creep): boolean {
        return harvesterController.getWork(creep).workLogic()
    }

}
