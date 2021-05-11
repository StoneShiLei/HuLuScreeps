import TransportTask from "../../task/transporterTask/transporterTask";
import BaseTransporterTaskAction from "./baseTransporterTaskAction";

/**
 * 从A点将能量搬运至B点
 */
export default class TransportTaskAction extends BaseTransporterTaskAction<TransportTask> {

    getResource():boolean{
        if(this.creep.store[this.task.resourceType] > 0) return true

        //是id  从建筑中获取
        if(typeof this.task.from === 'string'){

            //获取from目标建筑
            const targetStructure = Game.getObjectById(this.task.from)
            if(!targetStructure) {
                this.controller.removeTask(this.task.id)
                return false
            }

            //检查from目标剩余的资源，如果from剩余资源小于任务完成条件，结束任务
            const resAmount = targetStructure.store[this.task.resourceType] || 0
            if(resAmount <= (this.task.endCondition || 0)){
                this.controller.removeTask(this.task.id)
                return false
            }

            this.creep.goTo(targetStructure.pos,{range:1})
            const result = this.creep.withdraw(targetStructure,this.task.resourceType)
            return result == OK
        }
        //是pos位置
        else{
            const [x,y,roomName] = this.task.from as [number,number,string]
            const targetPos = new RoomPosition(x,y,roomName)

            //检查下pos位置有没有资源
            const targetRes = targetPos.lookFor(LOOK_RESOURCES).find(res => res.resourceType === this.task.resourceType)
            //没有资源或者达到任务结束条件
            if(!targetRes || targetRes.amount <= (this.task.endCondition || 0)){
                this.controller.removeTask(this.task.id)
                return false
            }

            this.creep.goTo(targetPos,{range:1})
            const result = this.creep.pickup(targetRes)
            return result == OK
        }
    }

    workWithTarget():boolean{
        if(this.creep.store[this.task.resourceType] <= 0) return true

        //是id的话 存到目标建筑
        if(typeof this.task.to === 'string'){
            const targetStructure = Game.getObjectById(this.task.to)
            if(!targetStructure) {
                this.controller.removeTask(this.task.id)
                return false
            }
            this.creep.goTo(targetStructure.pos,{range:1})
            const result = this.creep.transfer(targetStructure,this.task.resourceType)
            return result == OK
        }
        //是位置，走到目标pos然后丢弃
        else{
            const [x,y,roomName] = this.task.to as [number,number,string]
            const targetPos = new RoomPosition(x,y,roomName)

            //移动到目标pos,丢弃资源
            this.creep.goTo(targetPos,{range:1})
            const result = this.creep.drop(this.task.resourceType)
            return result == OK
        }
    }
}
