import { BaseRole } from "./baseRole";
import { Harvester } from "./basisRole/harvester";
import { Transporter } from "./basisRole/transporter";

export class Roles {
    static Roles:Map<Role,BaseRole> = new Map([
        ["harvester",new Harvester()],
        ["transporter",new Transporter()],
        // [RoleEnum.Transporter,new Harvester()],
    ])
}
