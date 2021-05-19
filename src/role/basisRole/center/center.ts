import { util } from "chai"
import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"
import RoomCenterController from "moudules/room/centerController/roomCenterController"
import Utils from "utils/utils"

/**
 * 中央运输
 */
 export default class CenterConfig implements RoleConfig{

    getReady?(creep:Creep):boolean{
        if(!creep.memory.data.centerData) throw new Error("未找到centerData")
        // 移动到指定位置
        const { x, y} = creep.memory.data.centerData
        if(creep.pos.isEqualTo(x,y)){
            //设置拒绝对穿
            creep.memory.dontPullMe = true
            return true
        }
        else{
            creep.goTo(new RoomPosition(x,y,creep.room.name),{range:0})
            return false
        }
    }

    getResource?(creep:Creep):boolean{
        // 快死了就拒绝执行任务
        if(creep.ticksToLive && creep.ticksToLive <= 5) return false

        const task = creep.room.centerController.getTask()
        if(!task) return false

        //获取目标建筑
        const structure:AnyStructure |null = RoomCenterController.GetCenterStructure(creep.room,task.source)
        if(!structure){
            creep.room.centerController.deleteCurrentTask()
            return false
        }

        // 获取取出数量
        let withdrawAmount = creep.store.getFreeCapacity()
        if(withdrawAmount > task.amount) withdrawAmount = task.amount
        // 尝试取出资源
        const result = creep.withdraw(structure, task.resourceType, withdrawAmount)
        if (result === OK) return true
        // 资源不足就移除任务
        else if (result === ERR_NOT_ENOUGH_RESOURCES) creep.room.centerController.deleteCurrentTask()
        // 够不到就移动过去
        else if (result === ERR_NOT_IN_RANGE) creep.goTo(structure.pos, { range: 1 })
        else if (result === ERR_FULL) return true
        else {
            Utils.log(`source 阶段取出异常，错误码 ${result}`,['center'],true, 'red')
            creep.room.centerController.hangTask()
        }

        return false
    }

    workWithTarget(creep: Creep): boolean {
        // 没有任务就返回 source 阶段待命
        const task = creep.room.centerController.getTask()
        if (!task) return true

        // 提前获取携带量
        const amount: number = creep.store.getUsedCapacity(task.resourceType)

        // 通过房间基础服务获取对应的建筑
        const structure:AnyStructure |null = RoomCenterController.GetCenterStructure(creep.room,task.target)
        if (!structure) {
            creep.room.centerController.deleteCurrentTask()
            return false
        }

        const result = creep.transferTo(structure, task.resourceType, { range: 1 })
        // 如果转移完成则增加任务进度
        if (result === OK) {
            creep.room.centerController.handleTask(amount)
            return true
        }
        else if (result === ERR_FULL) {
            Utils.log(`${task.target} 满了`,['center'])
            if (task.target === STRUCTURE_TERMINAL) Game.notify(`[${creep.room.name}] ${task.target} 满了，请尽快处理`)
            creep.room.centerController.hangTask()
        }
        // 资源不足就返回 source 阶段
        else if (result === ERR_NOT_ENOUGH_RESOURCES) {
            creep.say(`取出资源 ${result}`)
            return true
        }
        else {
            creep.say(`transferTo ${result}`)
            Utils.log(`center异常，transferTo 返回值: ${result}`)
            creep.room.centerController.hangTask()
        }

        return false
    }

    body(room: Room, spawn: StructureSpawn,data:CreepData): BodyPartConstant[] {
        return BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.center)(room,spawn)
    }

}
