import UpgradeTask from "moudules/room/taskController/task/wokerTask/upgradeTask"

/**
 * source container 拓展
 *
 */
 export default class ContainerExtension extends StructureContainer {
    onBuildComplete() {
        // 找到身边第一个没有设置 container 的 source
        const nearSource = this.pos.findInRange(FIND_SOURCES, 1, {
            filter: source => !source.getContainer()
        })
        if (nearSource[0]) nearSource[0].setContainer(this)

        if (this.room.controller && this.room.controller.level < 1) return false
        /**
         * 如果是在自己房间里就触发新的 creep 和任务发布
         * 更新家里的搬运工数量，几个 container 就发布其数量 * 4
         */
        this.room.spawnController.release.changeBaseUnit('worker', 4)
        this.room.workController.updateTask(new UpgradeTask(5))
        return true
    }
}
