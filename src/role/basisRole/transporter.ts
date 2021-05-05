import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"


export default class Transporter  implements CreepConfig<"transporter">{

    isNeed?(room: Room, preMemory: MyCreepMemory<"transporter">): boolean{
        return true
    }

    prepare?(creep: MyCreep<"transporter">):boolean{
        return true
    }

    source?(creep: MyCreep<"transporter">):boolean{
        const {workRoom} = creep.memory.data
        // return Game.rooms[workRoom]?.work.getWork(creep).sourct()
        return true
    }

    target(creep: MyCreep<"transporter">): boolean {
        const { workRoom } = creep.memory.data
        // return Game.rooms[workRoom]?.work.getWork(creep).target()
        return true
    }

    bodys(room: Room, spawn: StructureSpawn, data: TransporterData): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.transporter)(room, spawn)
    }

}
