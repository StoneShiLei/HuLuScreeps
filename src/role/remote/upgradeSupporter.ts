import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"
import EnergyHelper from "moudules/energyHelper/energyHelper"
import Utils from "utils/utils"


/**
 * 支援升级单位
 */
export default class UpgradeSupporterConfig implements RoleConfig{

    keepAlive?(room:Room,memory:CreepMemory):boolean{
        if(!memory.data.upgradeSupporterData) throw new Error("upgradeSupporterData 不存在")
        const target = Game.rooms[memory.data.upgradeSupporterData.targetRoomName]
        // 目标房间到 6 了就算任务完成
        return Utils.supporterIsNeed(room,target,() =>{
            if(!target.controller) return false
            return target.controller.level >= 6
        })
    }

    getReady?(creep:Creep):boolean{
        if(!creep.memory.data.upgradeSupporterData) throw new Error("upgradeSupporterData 不存在")
        const { targetRoomName } = creep.memory.data.upgradeSupporterData

        // 只要进入房间则准备结束
        if (creep.room.name !== targetRoomName) {
            creep.goTo(new RoomPosition(25, 25, targetRoomName))
            return false
        }
        else {
            return true
        }
    }

    getResource?(creep:Creep):boolean{

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true

        let resource:AllEnergySource | null = null
        // 获取有效的能量来源
        if(!creep.memory.sourceId){
            resource = EnergyHelper.getRoomEnergyTarget(creep.room)
            // 没有有效的能量来源建筑就去找能用的 source
            if(!resource) resource = creep.room.find(FIND_SOURCES).find(s => s.canUse()) ?? null
            if(!resource){
                creep.say('no energy!')
                return false
            }

            creep.memory.sourceId = resource.id
        }
        else resource = Game.getObjectById(creep.memory.sourceId)

        // 之前的来源建筑里能量不够了就更新来源
        if(!resource || (resource instanceof Structure && resource.store[RESOURCE_ENERGY] < 300 )|| (resource instanceof Source && resource.energy === 0)){
            delete creep.memory.sourceId
        }
        if(!resource){
            creep.say('no energy!')
            return false
        }

        creep.getEngryFrom(resource)

        return false
    }

    workWithTarget(creep: Creep): boolean {
        if(!creep.memory.data.upgradeSupporterData) throw new Error("upgradeSupporterData 不存在")
        const { targetRoomName } = creep.memory.data.upgradeSupporterData
        creep.upgradeRoom(targetRoomName)
        if(creep.store.getUsedCapacity() === 0)return true

        return false
    }

    body(room: Room, spawn: StructureSpawn,data:CreepData): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.worker)(room,spawn)
    }


}
