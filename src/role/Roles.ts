import { BaseRole } from "./baseRole";
import { Harvester } from "./basisRole/harvester";

export class Roles {
    static Roles:Map<Role,BaseRole> = new Map([
        ["harvester",new Harvester()],
        // [RoleEnum.Worker,new w()],
        // [RoleEnum.Transporter,new Harvester()],
    ])
}
