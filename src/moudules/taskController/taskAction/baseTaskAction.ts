
/**
 * 任务工作逻辑基类
 */
export default abstract class BaseTaskAction{

    // abstract keepAlive?():boolean

    abstract getReady?(creep:Creep):boolean

    abstract getResource?(creep:Creep):boolean

    abstract workWithTarget(creep:Creep):boolean
}



