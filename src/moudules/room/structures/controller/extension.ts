import WhiteList from "moudules/console/whiteList"
import BuildTask from "moudules/room/taskController/task/wokerTask/buildTask"
import UpgradeTask from "moudules/room/taskController/task/wokerTask/upgradeTask"
import Utils from "utils/utils"


export default class ControllerExtension extends StructureController {

    public onWork(): void {

        // 解除这两行的注释以显示队列信息
        this.room.workController.draw(1, 3)
        this.room.transportController.draw(1, 13)
        this.room.spawnController.draw(1,23)

        // if(this.room.memory.transporterNum < 3)
        // this.room.spawnController.release.changeBaseUnit("transporter",3 - this.room.memory.transporterNum )
        // console.log("任务id   " + this.room.workController.tasks[0].id)
        // for(const name in Game.creeps){
        //     const creep = Game.creeps[name]
        //     if(creep.memory.role == "worker") console.log(creep.name + "   " + this.room.workController.getUnitTask(creep)?.id)
        // }

        // const x = new UpgradeTask()
        // x.id = this.room.workController.tasks[0].id
        // x.priority = 5
        // this.room.workController.updateTask(x)

        // const x = ['W5N1 worker4','W5N1 worker14','W5N1 worker11','W5N1 worker13']
        // for(const i of x){
        //     if(Memory.creeps[i]){
        //         delete Memory.creeps[i]
        //         Game.creeps[i].suicide()
        //         console.log("移除" + i)
        //     }

        // }
        // if(this.my && !this.room.memory.isInit) {
        //     this.room.spawnController.release.releaseHarvester()
        //     this.room.spawnController.release.changeBaseUnit("transporter", 1)
        //     this.room.spawnController.release.changeBaseUnit('worker', 2)
        //     this.room.memory.isInit = true
        // }

        // this.room.spawnController.release.releaseHarvester()
        // this.room.spawnController.release.changeBaseUnit("transporter", 1)
        // this.room.spawnController.release.changeBaseUnit('worker', 2)

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
        if(!this.room.memory.controllerLevel) this.room.memory.controllerLevel = 0

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

    /**
     * 检查敌人威胁
     * 检查房间内所有敌人的身体部件情况确认是否可以造成威胁
     *
     * @returns 是否可以造成威胁（是否启用主动防御模式）
     */
    public checkEnemyThreat(): boolean {
        // 这里并没有搜索 PC，因为 PC 不是敌人主力
        const enemy = this.room._enemys || this.room.find(FIND_HOSTILE_CREEPS, { filter: WhiteList.whiteListFilter })
        if (enemy.length <= 0) return false

        // 如果来的都是入侵者的话，就算撑破天了也不管
        if (!enemy.find(creep => creep.owner.username !== 'Invader')) return false

        const bodyNum = enemy.map(creep => {
            // 如果是 creep 则返回身体部件，如果不是则不参与验证
            return creep instanceof Creep ? creep.body.length : 0
        }).reduce((pre, cur) => pre + cur)
        // 满配 creep 数量大于 1，就启动主动防御
        return bodyNum > MAX_CREEP_SIZE
    }





}
