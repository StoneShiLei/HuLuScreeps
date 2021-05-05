/**
 * 所有的 creep 角色
 */
 type CreepRoleConstant = keyof RoleDatas

 /**
  * 所有 creep 角色的 data
  */
 type CreepData = RoleDatas[CreepRoleConstant]

 interface RoleDatas {
     /**
      * 房间运营
      */
     harvester: HarvesterData
     worker: WorkerData
     transporter: TransporterData
     processor: ProcessorData
 }

/**
 * 有些角色不需要 data
 */
 interface EmptyData { }

 /**
  * 能量采集单位 data
  */
 interface HarvesterData {
     /**
      * 要采集的 Source 索引
      */
     sourceId: Id<Source>
     /**
      * 该 creep 的工作房间
      * 能量采集单位会先抵达该房间然后开始采集
      */
     harvestRoom: string
     /**
      * 能量要存储/应用到的房间
      */
     workRoom: string
     /**
      * 要站立到的采集能量的位置
      * 在采集单位第一次到达 source 旁确定
      */
     standPos?: string
 }

 /**
  * 工作单位的 data
  */
 interface WorkerData {
     /**
      * 该 creep 的工作房间
      * 例如一个外矿搬运者需要知道自己的老家在哪里
      */
     workRoom: string
 }

 /**
  * 运输单位的 data
  */
 interface TransporterData {
     /**
      * 要使用的资源存放建筑 id
      */
     sourceId?: Id<StructureWithStore>
     /**
      * 该 creep 的工作房间
      * 例如一个外矿搬运者需要知道自己的老家在哪里
      */
     workRoom: string
 }

 /**
  * 中央运输者的 data
  * x y 为其在房间中的固定位置
  */
 interface ProcessorData {
     x: number
     y: number
 }

/**
 * creep 工作逻辑集合
 * 包含了每个角色应该做的工作
 */
 type CreepWork = {
    [role in CreepRoleConstant]: CreepConfig<role>
}

 /**
 * Creep 角色功能逻辑
 */
interface CreepConfig<Role extends CreepRoleConstant> {
    /**
     * 该 creep 是否需要
     *
     * 每次死后都会进行判断，只有返回 true 时才会重新发布孵化任务
     * 该方法为空则默认持续孵化
     */
    isNeed?(room: Room, preMemory: MyCreepMemory<Role>): boolean
    /**
     * 准备阶段
     *
     * creep 出生后会执行该方法来完成一些需要准备的工作，返回 true 时代表准备完成
     * 该方法为空则直接进入 source 阶段
     */
    prepare?(creep: MyCreep<Role>):boolean
    /**
     * 获取工作资源阶段
     *
     * 返回 true 则执行 target 阶段，返回其他将继续执行该方法
     * 该方法为空则一直重复执行 target 阶段
     */
    source?(creep: MyCreep<Role>):boolean
    /**
     * 工作阶段
     *
     * 返回 true 则执行 source 阶段，返回其他将继续执行该方法
     * 该方法不可未空
     */
    target(creep: MyCreep<Role>):boolean
    /**
     * 每个角色默认的身体组成部分
     */
    bodys(room: Room, spawn: StructureSpawn, data: RoleDatas[Role]):BodyPartConstant[]
}

/**
 * 自定义的 creep
 * 用于指定不同角色中包含的不同 creep 内存
 */
declare class MyCreep<Role extends CreepRoleConstant = CreepRoleConstant> extends Creep {
    memory: MyCreepMemory<Role>
}

/**
 * 自定义 creep 内存
 * 用于指定不同角色中包含的不同 creep data 对象
 */
interface MyCreepMemory<Role extends CreepRoleConstant = CreepRoleConstant> extends CreepMemory {
    data: RoleDatas[Role]
}
