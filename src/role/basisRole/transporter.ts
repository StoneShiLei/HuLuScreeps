import { BaseRole } from "role/baseRole";


export class Transporter extends BaseRole {

    keepAlive?(room: Room): boolean
    getReady?(creep: Creep): boolean

    getResource?(creep: Creep): boolean {
        return creep.room.transportController.getWork(creep).resourceLogic()
    }
    workWithTarget(creep: Creep): boolean {
        return creep.room.transportController.getWork(creep).workLogic()
    }

}
