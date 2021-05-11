import UpgradeTask from "moudules/room/taskController/task/wokerTask/upgradeTask"


export default class ControllerExtension extends StructureController {

    public onWork(): void {
        // 解除这两行的注释以显示队列信息
        this.room.workController.draw(1, 3)
        this.room.transportController.draw(1, 13)

        if (Game.time % 20) return

        // 如果等级发生变化了就运行 creep 规划
        if (this.checkLevelChange()) this.onLevelChange(this.level)
    }

    /**
     * 统计自己的等级信息
     *
     * @returns 为 true 时说明自己等级发生了变化
     */
    public checkLevelChange(): boolean {
        if(!this.room.memory.controllerLevel) this.room.memory.controllerLevel = this.level

        let hasLevelChange = false
        hasLevelChange = this.room.memory.controllerLevel !== this.level
        this.room.memory.controllerLevel = this.level

        return hasLevelChange
    }


    /**
     * 当等级发生变化时的回调函数
     *
     * @param level 当前的等级
     */
    public onLevelChange(level: number): void {
        // 刚占领，添加工作单位
        if (level === 1) {
            this.room.spawnController.release.releaseHarvester()
            this.room.spawnController.release.changeBaseUnit("transporter", 1)
            this.room.spawnController.release.changeBaseUnit('worker', 2)
        }
        else if (level === 8) {
            this.decideUpgradeWhenRCL8()
        }
    }

    /**
     * 房间升到 8 级后的升级计划
     */
    private decideUpgradeWhenRCL8(): void {
        // 限制只需要一个单位升级
        this.room.workController.updateTask(new UpgradeTask(5,1))
    }





}
