import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"


export default class Harvester  implements CreepConfig<"harvester">{

    isNeed?(room: Room, preMemory: MyCreepMemory<"harvester">): boolean{
        return true
    }

    prepare?(creep: MyCreep<"harvester">):boolean{
        return true
    }

    source?(creep: MyCreep<"harvester">):boolean{
        const {workRoom} = creep.memory.data
        // return Game.rooms[workRoom]?.work.getWork(creep).sourct()
        return true
    }

    target(creep: MyCreep<"harvester">): boolean {
        const { workRoom } = creep.memory.data
        // return Game.rooms[workRoom]?.work.getWork(creep).target()
        return true
    }

    bodys(room: Room, spawn: StructureSpawn, data: HarvesterData): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.harvester)(room, spawn)
    }

}
