import BodyAutoConfigUtil from "moudules/bodyConfig/bodyConfig"
import Utils from "utils/utils"



export default class ClaimerConfig implements RoleConfig{
    // 该 creep 死了不会再次孵化
    keepAlive?(room:Room,memory:CreepMemory):boolean{ return false }
    // 向指定房间移动
    getReady?(creep:Creep):boolean{
        if(!creep.memory.data.claimerData) throw new Error("没有claimerData")
        const targetRoomName = creep.memory.data.claimerData.targetRoomName
        // 只要进入房间则准备结束
        if(creep.room.name !== targetRoomName){
            creep.goFar(new RoomPosition(25,25,targetRoomName))
            return false
        }

        return true
    }

    workWithTarget(creep: Creep): boolean {
        if(!creep.memory.data.claimerData) return true

        const controller = creep.room.controller
        if(!controller){
            creep.say('控制器呢?')
            return false
        }

        // 如果控制器不是自己或者被人预定的话就进行攻击
        if((controller.owner && controller.owner.username !== creep.owner.username) || controller.reservation !== undefined){
            if(creep.attackController(controller) == ERR_NOT_IN_RANGE) creep.moveTo(controller)
            return false
        }

        const claimResult = creep.claimController(controller)
        if(claimResult === ERR_NOT_IN_RANGE) creep.goTo(controller.pos)
        else if(claimResult === OK){
            const {spawnRoom:spawnRoomName,data:{claimerData}} = creep.memory

            Utils.log(`新房间 ${claimerData.targetRoomName} 占领成功！已向源房间 ${spawnRoomName} 请求支援单位`, ['Claimer'],false ,'green')

            // 占领成功，发布支援组
            const spawnRoom = Game.rooms[spawnRoomName]
            if(spawnRoom) spawnRoom.spawnController.release.releaseSupporter(claimerData.targetRoomName) // todo

            // 添加签名
            if (claimerData.signText) creep.signController(controller, claimerData.signText)

            // 任务完成，一路顺风
            creep.suicide()
        }
        else if(claimResult === ERR_GCL_NOT_ENOUGH) Utils.log(`GCL 不足，无法占领`, ['Claimer'],false ,'green')
        else creep.say(`占领 ${claimResult}`)

        return false
    }

    body(room: Room, spawn: StructureSpawn,data:CreepData): BodyPartConstant[] {
        return [MOVE,CLAIM]
    }

}
