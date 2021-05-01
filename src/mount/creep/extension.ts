import { Roles } from "role/Roles";


export default class CreepExtension  extends Creep{

    public work():void{
        const role = Roles.Roles.get(this.memory.role)

        if(!role) return
        const working = role.getResource ? this.memory.working:true
        let stateChange = false

        if(working) {
            if(role.workWithTarget && role.workWithTarget(this)) stateChange = true
        }
        else if(role.getResource && role.getResource(this)){
            stateChange = true
        }

        if(stateChange) this.memory.working = !this.memory.working

    }
}
