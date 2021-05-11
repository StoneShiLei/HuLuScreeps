import { BASE_ROLE_LIMIT } from "setting";
import Utils from "utils/utils";
import { CreepNameGetter } from "./CreepNameGetter";
import RoomSpawnController from "./roomSpawnController";
import SpawnTask from "./spawnTask";


export default class RoomCreepReleaseUtil{

    readonly spawner:RoomSpawnController

    constructor(spawner:RoomSpawnController){
        this.spawner = spawner
    }


    /**
     * 发布采集单位
     * 固定一个 source 发布一个单位
     */
    public releaseHarvester():OK | ERR_NOT_FOUND{
        if(!this.spawner.room.sources){
            this.spawner.room.sources = this.spawner.room.find(FIND_SOURCES)
        }

        const roomName = this.spawner.room.name;
        const sources = this.spawner.room.sources;

        (sources || []).map((source,index) =>{
            this.spawner.addTask(new SpawnTask(
                CreepNameGetter.harvester(roomName,index),
                "harvester",{
                    workRoom:roomName,
                    harvestRoom:roomName,
                    sourceID:source.id
                }

            ))
        })

        return OK
    }

    /**
     * 变更基地运维单位数量
     * 包含数量保护，保证无论怎么减少都有一定的单位执行任务
     *
     * @param type 要更新的单位类别，工人 / 搬运工
     * @param adjust 要增减的数量，为负代表减少
     * @param bodyType 在新增时要设置的特殊体型，减少数量时无效
     */
    public changeBaseUnit(type:BaseUnits,adjust:number):OK | ERR_NOT_FOUND | ERR_INVALID_TARGET{
        const { room } = this.spawner

        const memoryKey = type === 'worker' ? 'workerNum' : 'transporterNum'

        const {MIN,MAX} = JSON.parse(this.spawner.room.memory.baseUnitLimit || '{}')[type] || BASE_ROLE_LIMIT[type]

        const oldNumber = room.memory[memoryKey] || 0

        let realAdjust = 0
        // 调整完的人数超过限制了，就增加到最大值
        if(oldNumber + adjust > MAX) realAdjust = MAX - oldNumber
        // 调整完了人数在正常区间，直接用
        else if(oldNumber + adjust >= MIN) realAdjust = adjust
        // 调整值导致人数不够了，根据最小值调整
        else realAdjust = oldNumber > MIN ? MIN - oldNumber : oldNumber - MIN

        if(realAdjust >= 0){
            for(let i = oldNumber;i< oldNumber + realAdjust;i++){
                const creepName = CreepNameGetter[type](room.name,i)
                if(creepName in Game.creeps) continue
                this.spawner.addTask({
                    name:creepName,
                    role:type,
                    data:{
                        workRoom:room.name
                    }
                })
            }
        }
        else{
            for(let i = oldNumber -1;i >= oldNumber + realAdjust;i--){
                Utils.removeCreep(CreepNameGetter[type](room.name,i))
            }
        }

        room.memory[memoryKey] = oldNumber + realAdjust
        Utils.log(`调整 ${type} 单位数量 [修正] ${adjust} [上/下限] ${MAX}/${MIN} [修正后数量] ${room.memory[memoryKey]}`)
        return OK
    }

    /**
     * 设置基地运维角色数量
     *
     * @param type 要设置的单位角色
     * @param limit 设置的限制
     */
    public setBaseUnitLimit(type: BaseUnits, limit: Partial<BaseUnitLimit>): void {
        // 获取当前房间的设置
        const existLimit: RoomBaseUnitLimit = JSON.parse(this.spawner.room.memory.baseUnitLimit || '{}') || BASE_ROLE_LIMIT
        // 更新配置
        const realLimit = _.defaults(limit, existLimit[type], BASE_ROLE_LIMIT[type])
        // 把新配置覆写保存进内存
        this.spawner.room.memory.baseUnitLimit = JSON.stringify(_.defaults({ [type]: realLimit }, existLimit))
    }
}
