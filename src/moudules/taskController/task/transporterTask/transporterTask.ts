import BaseTransporterTask from "./baseTransporterTask";


/**
 * 从A点将能量搬运至B点
 */
export default class TransportTask extends BaseTransporterTask{

    //取出目标
    fromID:[number, number, string] | Id<StructureWithStore>
    //放入目标
    ToID:[number, number, string] | Id<StructureWithStore>
    //能量类型
    resourceType:ResourceConstant
    //结束条件（取出目标能量小于该值）
    endCondition:number

    constructor(fromID:[number, number, string] | Id<StructureWithStore>,ToID:[number, number, string] | Id<StructureWithStore>
        ,resourceType:ResourceConstant,endCondition:number,priority:number = 0,staffCount:number = 1){
        super("transportTask",priority,staffCount)
        this.priority = priority
        this.staffCount = staffCount

        this.fromID = fromID
        this.ToID = ToID
        this.resourceType = resourceType
        this.endCondition = endCondition
    }
}
