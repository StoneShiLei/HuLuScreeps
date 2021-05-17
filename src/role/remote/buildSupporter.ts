import { filter } from "lodash"
import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"
import EnergyHelper from "moudules/energyHelper/energyHelper"
import Utils from "utils/utils"


/**
 * 支援升级单位
 */
export default class BuildSupporterConfig implements RoleConfig{

    keepAlive?(room:Room,memory:CreepMemory):boolean{
        if(!memory.data.buildSupporterData) throw new Error("buildSupporterData 不存在")
        const target = Game.rooms[memory.data.buildSupporterData.targetRoomName]
        // 如果房间造好了 terminal，自己的使命就完成了
        return Utils.supporterIsNeed(room,target,() =>{
            return !!target.terminal && !!target.terminal.my
        })
    }

    getReady?(creep:Creep):boolean{
        if(!creep.memory.data.buildSupporterData) throw new Error("buildSupporterData 不存在")
        const { targetRoomName } = creep.memory.data.buildSupporterData

        // 只要进入房间则准备结束
        if (creep.room.name !== targetRoomName) {
            creep.goFar(new RoomPosition(25, 25, targetRoomName))
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
            if(!resource) resource = creep.room.find(FIND_SOURCES,{filter:s => s.canUse()})[0]
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
        if(!creep.memory.data.buildSupporterData) throw new Error("buildSupporterData 不存在")
        const { targetRoomName } = creep.memory.data.buildSupporterData
        // 有新墙就先刷新墙
        if (creep.memory.fillWallId) creep.steadyWall()
        // 执行建造之后检查下是不是都造好了，如果是的话这辈子就不会再建造了，等下辈子出生后再检查（因为一千多 tick 基本上不会出现新的工地）
        else if (creep.memory.dontBuild) creep.upgradeRoom(targetRoomName)
        // 没有就建其他工地
        else if (creep.buildStructure() === ERR_NOT_FOUND) creep.memory.dontBuild = true

        if (creep.store.getUsedCapacity() === 0) return true

        return false
    }

    body(room: Room, spawn: StructureSpawn,data:CreepData): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.worker)(room,spawn)
    }


}
