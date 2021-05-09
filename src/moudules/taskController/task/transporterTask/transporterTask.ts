import BaseTransporterTask from "./baseTransporterTask";


/**
 * 从A点将能量搬运至B点
 */
export default class TransportTask extends BaseTransporterTask{

    //取出目标
    from:[number, number, string] | Id<StructureWithStore>
    //放入目标
    to:[number, number, string] | Id<StructureWithStore>
    //能量类型
    resourceType:ResourceConstant
    //结束条件（取出目标能量小于该值）
    endCondition:number

    constructor(from:[number, number, string] | Id<StructureWithStore>,to:[number, number, string] | Id<StructureWithStore>
        ,resourceType:ResourceConstant,endCondition:number,priority:number = 0,staffCount:number = 1){
        super("transportTask",priority,staffCount)
        this.priority = priority
        this.staffCount = staffCount

        this.from = from
        this.to = to
        this.resourceType = resourceType
        this.endCondition = endCondition
    }
}
