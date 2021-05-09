import EnergyHelper from "moudules/energyHelper/energyHelper";
import BaseTaskController from "moudules/taskController/controller/baseTaskController";
import BaseWorkerTask from "moudules/taskController/task/wokerTask/baseWorkerTask";
/**
 * 任务工作逻辑基类
 */
export default abstract class BaseWorkerTaskAction<Task extends BaseWorkerTask> implements ITaskAction{

    abstract getResource(): boolean
    abstract workWithTarget(): boolean

    creep!: Creep;
    controller!: BaseTaskController<AllWorkerTaskType,Task>;
    task!: Task;

    protected getEnergy():boolean{
        // 因为只会从建筑里拿，所以只要拿到了就去升级
        // 切换至 target 阶段时会移除缓存，保证下一次获取能量时重新搜索，避免出现一堆人都去挤一个的情况发生
        if(this.creep.store[RESOURCE_ENERGY] > 10){
            delete this.creep.memory.sourceId
            return true
        }

        let resource:AllEnergySource | null = null
        //查找缓存是否存在
        if(this.creep.memory.sourceId){
            resource = Game.getObjectById<AllEnergySource>(this.creep.memory.sourceId)
            //缓存失效则清除
            if(!resource) delete this.creep.memory.sourceId
        }

        //如果source不存在  则重新查找并缓存
        if(!resource){
            resource = EnergyHelper.getRoomEnergyTarget(this.creep.room,EnergyHelper.getClosestTo(this.creep.pos))
            this.creep.memory.sourceId = resource.id
        }

        //还是获取不到resource
        if(!resource){
            this.creep.say('没能量了，歇会')
            return false
        }

        const result = this.creep.getEngryFrom(resource)

        // 之前用的能量来源没能量了就更新来源
        if(result == OK){
            delete this.creep.memory.sourceId
            return true
        }
        if(result === ERR_NOT_ENOUGH_RESOURCES){
            delete this.creep.memory.sourceId
            return false
        }
        return false
    }
}

export class NoTaskAction extends BaseWorkerTaskAction<BaseWorkerTask>{
    getResource(): boolean {
        this.creep.say('💤')
        return false
    }
    workWithTarget(): boolean {
        return true
    }
}
