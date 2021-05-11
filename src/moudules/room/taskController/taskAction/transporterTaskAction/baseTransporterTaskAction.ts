import EnergyHelper from "moudules/energyHelper/energyHelper";
import BaseTaskController from "../../controller/baseTaskController";
import BaseTransporterTask from "../../task/transporterTask/baseTransporterTask";
/**
 * 任务工作逻辑基类
 */
export default abstract class BaseTransporterTaskAction<Task extends BaseTransporterTask> implements ITaskAction{

    abstract getResource(): boolean
    abstract workWithTarget(): boolean

    creep!: Creep;
    controller!: BaseTaskController<AllTransporterTaskType,Task>;
    task!: Task;

    /**
     * 搬运工去房间内获取能量
     *
     * @param creep 要获取能量的 creep
     * @returns 身上是否已经有足够的能量了
     */
    protected getEnergy():boolean{
        if(this.creep.store[RESOURCE_ENERGY] > 40) return true

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

        if(!resource || (resource instanceof Structure && resource.store[RESOURCE_ENERGY] <= 0)
        || (resource instanceof Resource && resource.amount <= 0)){
            let target = resource? resource : this.creep.room.find(FIND_SOURCES)[0]
            //先移动到目标附近
            if(target) this.creep.goTo(target.pos,{range:3})
            else this.creep.say('😯没能量呀')

            delete this.creep.memory.sourceId
            return false
        }

        //获取能量
        const result = this.creep.getEngryFrom(resource)
        return result == OK
    }
}

export class NoTaskAction extends BaseTransporterTaskAction<BaseTransporterTask>{
    getResource(): boolean {
        this.creep.say('💤')
        return false
    }
    workWithTarget(): boolean {
        return true
    }
}
