import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"


/**
 * 工人，运营单位
 * 负责采集能量、升级、维修、建造等消耗能量的工作
 */
export default class WorkerConfig implements RoleConfig{

    getResource?(creep:Creep):boolean{
        const { workRoom } = creep.memory.transporterData
        return Game.rooms[workRoom]?.workController.getAction(creep).getResource()
    }

    workWithTarget(creep: Creep): boolean {
        const { workRoom } = creep.memory.transporterData
        return Game.rooms[workRoom]?.workController.getAction(creep).workWithTarget()
    }

    body(room: Room, spawn: StructureSpawn): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.worker)(room,spawn)
    }

}
