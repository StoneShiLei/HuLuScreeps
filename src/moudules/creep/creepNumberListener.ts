import { creepRoleConfig } from "role"
import Utils from "utils/utils"


export default class CreepNumberListener{

    static run():void{
        // 本 tick creep 数量没变，不用执行检查
        if (Object.keys(Memory.creeps || {}).length === Object.keys(Game.creeps).length) return

        // 遍历所有 creep 内存，检查其是否存在
        for (const name in Memory.creeps) {
            if (name in Game.creeps) continue

            // creep 的内存不可能完全未空，所以这里只有可能是 creep 主动释放（比如去了其他 shard）
            // 所以这里不予重生
            if (Object.keys(Memory.creeps[name]).length <= 0) {
                delete Memory.creeps[name]
                continue
            }

            const creepMemory = Memory.creeps[name]
            // 如果 creep 凉了
            this.handleNotExistCreep(name, creepMemory)
        }
    }

    static handleNotExistCreep(creepName: string, creepMemory: CreepMemory) {
        const { spawnRoom: spawnRoomName, data, role, cantRespawn, taskID } = creepMemory ///?

        // 如果有 taskKey，说明还在做任务，去访问对应的任务管理器把自己注销一下
        if (taskID) this.removeSelfFromTask(creepName, role, data)

        // 禁止孵化的 creep 直接移除
        if (cantRespawn) {
            Utils.log(`死亡 ${creepName} 被禁止孵化, 已删除`, [ 'creepController' ])
            delete Memory.creeps[creepName]
            return
        }

        // 检查指定的 room 中有没有它的生成任务
        const spawnRoom = Game.rooms[spawnRoomName]
        if (!spawnRoom) {
            Utils.log(`死亡 ${creepName} 未找到 ${spawnRoomName}, 已删除`, [ 'creepController' ])
            delete Memory.creeps[creepName]
            return
        }

        const creepWork= creepRoleConfig[role]

        // 通过 keepAlive 阶段判断该 creep 是否要继续孵化
        // 没有提供 keepAlive 阶段的话则默认需要重新孵化
        if (creepWork.keepAlive && !creepWork.keepAlive(spawnRoom, creepMemory)) {
            delete Memory.creeps[creepName]
            return
        }

        // 加入生成，加入成功的话删除过期内存
        const result = spawnRoom.spawnController.addTask({ name: creepName, role, data })

        if (result === ERR_NAME_EXISTS) Utils.log(`死亡 ${creepName} 孵化任务已存在`, [ 'creepController' ])
        delete Memory.creeps[creepName]
    }

    /**
     * 通知对应的房间任务管理器，他的一个工人凉了
     *
     * @param creepName 正在做任务的 creep 名字
     * @param role 该 creep 的角色
     * @param data 该 creep 的 memory.data
     */
    static removeSelfFromTask(creepName: string, role: AllRoles, data: AllData): void {
        if (!('workRoom' in data)) return

        const workRoom = Game.rooms[data.workRoom]
        if (!workRoom) return

        const controller = role === "transporter" ? workRoom.transportController : workRoom.workController
        controller.removeCreep(creepName)
    }
}
