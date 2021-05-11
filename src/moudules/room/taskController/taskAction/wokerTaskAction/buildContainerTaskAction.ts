
import Utils from "utils/utils"
import BuildContainerTask from "../../task/wokerTask/buildContainerTask"
import BaseWorkerTaskAction from "./baseWorkerTaskAction"


/**
 * 建造容器
 */
export default class BuildContainerTaskAction extends BaseWorkerTaskAction<BuildContainerTask> {

    getResource():boolean{
        if (this.creep.store[RESOURCE_ENERGY] >= 20) return true

            const source = Game.getObjectById(this.task.sourceID)
            if (!source || source.getContainer()) {
                if (!source) Utils.log(`找不到 source，container 建造任务移除`,['BuildContainerTaskAction'],false, 'yellow')
                this.controller.removeTask(this.task.id)
                return false
            }

            // 建造初始 container 时一无所有，所以只会捡地上的能量来用
            const droppedEnergy = source.getDroppedInfo().energy
            if (!droppedEnergy || droppedEnergy.amount < 100) {
                this.creep.say('等待能量回复')
                // 等待时先移动到附近
                this.creep.goTo(source.pos, { range: 3 })
                return false
            }

            this.creep.goTo(droppedEnergy.pos, { range: 1 })
            this.creep.pickup(droppedEnergy)
            return true
    }

    workWithTarget():boolean{
        if (this.creep.store[RESOURCE_ENERGY] === 0) return true

        let containerSite:ConstructionSite | null = null

        //使用缓存
        if(this.task.containerId){
            containerSite = Game.getObjectById(this.task.containerId)
            //缓存失效则删除缓存
            if(!containerSite) delete this.task.containerId
        }

        //没有缓存则重新获取
        const source = Game.getObjectById(this.task.sourceID)
        if(!source){
            Utils.log(`找不到 source，container 建造任务移除`,['BuildContainerTaskAction'],false, 'yellow')
            this.controller.removeTask(this.task.id)
        }

        // 这里找的范围只要在 creep 的建造范围之内就行
        const containerSites = source?.pos.findInRange(FIND_CONSTRUCTION_SITES,2,
            {filter:site => site && site.structureType === STRUCTURE_CONTAINER})

            //找不到说明任务已经完成
        if(!containerSites || containerSites.length <= 0){
            this.controller.removeTask(this.task.id)
            return true
        }
        else{
            //如果存在工地  将id缓存到任务中
            containerSite = containerSites[0]
            this.task.containerId = containerSite.id
            const result = this.creep.build(containerSite)
            if(result === ERR_NOT_IN_RANGE) this.creep.goTo(containerSite.pos,{range:3})
            return false
        }


    }
}
