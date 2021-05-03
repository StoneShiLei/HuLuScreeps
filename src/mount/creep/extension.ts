import { Roles } from "role/Roles";


export default class CreepExtension  extends Creep{

    public work():void{
        const role = Roles.Roles.get(this.memory.role)
        if(!role) return

        if(!this.memory.getReady){
            if(role.getReady){
                this.memory.getReady = role.getReady(this)
            }
            else{
                this.memory.getReady = true
            }
        }
        if(!this.memory.getReady) return



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


    public getEnergyFrom(target:AllEnergySource):ScreepsReturnCode{
        let result: ScreepsReturnCode
        // 是建筑就用 withdraw
        if (target instanceof Structure) {
            // 如果建筑里没能量了就不去了，防止出现粘性
            if (target.store[RESOURCE_ENERGY] <= 0) return ERR_NOT_ENOUGH_ENERGY
            result = this.withdraw(target as Structure, RESOURCE_ENERGY)
        }
        else if (target instanceof Resource) result = this.pickup(target as Resource)
        // 不是的话就用 harvest
        else result = this.harvest(target as Source)

        if (result === ERR_NOT_IN_RANGE) this.moveTo(target.pos)

        return result
    }
}
