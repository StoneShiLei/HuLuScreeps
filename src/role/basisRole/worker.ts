import { BaseRole } from "role/baseRole";


export class Worker extends BaseRole{
    bodyPart: BodyPartConstant[];

    constructor(bodyPart:BodyPartConstant[]){
        super()
        this.bodyPart = bodyPart;
    }


    keepAlive(room: Room): boolean {
        return true;
    }
    getReady(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    getResource(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }
    workWithTarget(creep: Creep): boolean {
        throw new Error("Method not implemented.");
    }

}
