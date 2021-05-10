import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig";
import { TRANSFER_DEATH_LIMIT } from "setting";

/**
 * 搬运工，运营单位
 * 负责填充 extension、spawn、tower、lab 等资源运输任务
 */
export default class TransporterConfig implements RoleConfig{

    getResource?(creep:Creep):boolean{
        if(!creep.memory.transporterData) return false
        const { sourceID,workRoom } = creep.memory.transporterData
        if(creep.ticksToLive && creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return this.deathPrepare(creep,sourceID)
        return Game.rooms[workRoom]?.transportController.getAction(creep).getResource()
    }

    workWithTarget(creep: Creep): boolean {
        if(!creep.memory.transporterData) return true
        const { workRoom } = creep.memory.transporterData
        return Game.rooms[workRoom]?.transportController.getAction(creep).workWithTarget()
    }

    body(room: Room, spawn: StructureSpawn): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.transporter)(room,spawn)
    }


    /**
     * 快死时的后事处理
     * 将资源存放在对应的地方
     * 存完了就自杀
     *
     * @param creep manager
     * @param sourceId 能量存放处
     */
    private deathPrepare(creep: Creep, sourceId?: Id<StructureWithStore>): false{
        if (creep.store.getUsedCapacity() > 0) {
            for (const resourceType in creep.store) {
                let target: StructureWithStore | null | undefined
                // 不是能量就放到 terminal 里
                if (resourceType != RESOURCE_ENERGY && resourceType != RESOURCE_POWER && creep.room.terminal) {
                    target = creep.room.terminal
                }
                // 否则就放到 storage 或者指定的地方
                else target = sourceId ? Game.getObjectById(sourceId): creep.room.storage
                // 刚开新房的时候可能会没有存放的目标
                if (!target) return false

                // 转移资源
                creep.goTo(target.pos)
                creep.transfer(target, <ResourceConstant>resourceType)

                return false
            }
        }
        else creep.suicide()

        return false
    }
}
