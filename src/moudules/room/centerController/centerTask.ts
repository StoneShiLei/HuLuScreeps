

export default class CenterTask{
    /**
     * 任务提交者类型
     * number 类型是为了运行玩家自己推送中央任务
     */
     submit: CenterStructures | number
     /**
      * 资源的提供建筑类型
      */
     source: CenterStructures
     /**
      * 资源的接受建筑类型
      */
     target: CenterStructures
     /**
      * 资源类型
      */
     resourceType:  ResourceConstant
     /**
      * 资源数量
      */
     amount: number

     constructor(submit: CenterStructures | number,source: CenterStructures,target: CenterStructures,resourceType:  ResourceConstant,amount: number){
         this.submit = submit
         this.source = source
         this.target = target
         this.resourceType = resourceType
         this.amount = amount
     }
}
