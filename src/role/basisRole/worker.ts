import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"


export default class Worker  implements CreepConfig<"worker">{

    isNeed?(room: Room, preMemory: MyCreepMemory<"worker">): boolean{
        return true
    }

    prepare?(creep: MyCreep<"worker">):boolean{
        return true
    }

    source?(creep: MyCreep<"worker">):boolean{
        const {workRoom} = creep.memory.data
        // return Game.rooms[workRoom]?.work.getWork(creep).sourct()
        return true
    }

    target(creep: MyCreep<"worker">): boolean {
        const { workRoom } = creep.memory.data
        // return Game.rooms[workRoom]?.work.getWork(creep).target()
        return true
    }

    bodys(room: Room, spawn: StructureSpawn, data: WorkerData): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.worker)(room, spawn)
    }

}
