import CenterTask from "moudules/room/centerController/centerTask"
import { DEFAULT_ENERGY_KEEP_AMOUNT, DEFAULT_ENERGY_KEEP_LIMIT } from "setting"

/**
 * Storage 拓展
 *
 * storage 会对自己中的能量进行监控，如果大于指定量（ENERGY_SHARE_LIMIT）的话
 * 就将自己注册到资源来源表中为其他房间提供能量
 */
 export default class StorageExtension extends StructureStorage {
    public onWork(): void {
        if (Game.time % 20) return

        this.energyKeeper()
    }

    /**
     * 将其他建筑物的能量维持在指定值
     */
    private energyKeeper() {
        const info = this.room.memory.energyKeepInfo
        if (!info || !info.terminal || !this.room.terminal) return

        if (
            // terminal 能量不够了
            this.room.terminal.store[RESOURCE_ENERGY] < info.terminal.amount &&
            // 自己的能量够
            this.store[RESOURCE_ENERGY] >= info.terminal.limit
        ) {
            // 发布到 terminal 的能量转移任务
            this.room.centerController.addTask(new CenterTask(
                STRUCTURE_FACTORY,
                STRUCTURE_STORAGE,
                STRUCTURE_TERMINAL,
                RESOURCE_ENERGY,
                info.terminal.amount - this.room.terminal.store[RESOURCE_ENERGY]
            ))
        }
    }

    /**
     * 添加能量填充规则
     *
     * @param amount 要填充的能量数量
     * @param limit 在 storage 中能量大于多少时才会填充
     */
    public addEnergyKeep(amount: number = DEFAULT_ENERGY_KEEP_AMOUNT, limit: number = DEFAULT_ENERGY_KEEP_LIMIT): OK {
        if (!this.room.memory.energyKeepInfo) this.room.memory.energyKeepInfo = {}

        this.room.memory.energyKeepInfo.terminal = { amount, limit }
        return OK
    }

    /**
     * 移除所有能量填充规则
     */
    public removeEnergyKeep(): OK {
        delete this.room.memory.energyKeepInfo
        return OK
    }
}
