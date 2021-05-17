import { BASE_ROLE_LIMIT } from "setting";
import Utils from "utils/utils";
import { CreepNameGetter } from "./CreepNameGetter";
import RoomSpawnController from "./roomSpawnController";
import SpawnTask from "./spawnTask";


export default class RoomCreepReleaseUtil{

    readonly spawnController:RoomSpawnController

    constructor(spawnController:RoomSpawnController){
        this.spawnController = spawnController
    }


    /**
     * 发布采集单位
     * 固定一个 source 发布一个单位
     */
    public releaseHarvester():OK | ERR_NOT_FOUND{
        if(!this.spawnController.room.sources){
            this.spawnController.room.sources = this.spawnController.room.find(FIND_SOURCES)
        }

        const roomName = this.spawnController.room.name;
        const sources = this.spawnController.room.sources;

        (sources || []).map((source,index) =>{
            this.spawnController.addTask(new SpawnTask(
                CreepNameGetter.harvester(roomName,index),
                "harvester",{
                    harvesterData:{workRoom:roomName,
                        harvestRoom:roomName,
                        sourceID:source.id
                    }
                }

            ))
        })

        return OK
    }

    /**
     * 发布中央运输单位
     */
    public releaseCenter(): OK | ERR_NOT_FOUND {
        const { room } = this.spawnController
        if (!room.memory.center) return ERR_NOT_FOUND

        const [ x, y ] = room.memory.center
        this.spawnController.addTask(new SpawnTask(
            CreepNameGetter.center(room.name),
            'center',
            {centerData:{x:x,y:y}}))

        return OK
    }

    /**
     * 发布支援角色组
     *
     * @param remoteRoomName 要支援的房间名
     */
    public releaseSupporter(supportRoomName:string):OK |ERR_NOT_FOUND{
        const room = Game.rooms[supportRoomName]
        if(!room){
            Utils.log(`目标房间没有视野，无法发布支援单位`, [ this.spawnController.room.name, 'CreepRelease' ],false, 'yellow')
            return ERR_NOT_FOUND
        }

        const sources = room.find(FIND_SOURCES)

        this.spawnController.addTask(new SpawnTask(
            CreepNameGetter.upgradeSupporter(supportRoomName),
            'upgradeSupporter',{
                upgradeSupporterData:{targetRoomName:supportRoomName,sourceId:sources[0].id}
            }
        ))

        this.spawnController.addTask(new SpawnTask(
            CreepNameGetter.buildeSupporter(supportRoomName),
            'buildSupporter',{
                buildSupporterData:{targetRoomName:supportRoomName,sourceId:sources.length >= 2 ? sources[1].id : sources[0].id}
            }
        ))

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
        const { room } = this.spawnController

        const memoryKey = type === 'worker' ? 'workerNum' : 'transporterNum'

        const {MIN,MAX} = JSON.parse(this.spawnController.room.memory.baseUnitLimit || '{}')[type] || BASE_ROLE_LIMIT[type]

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
                this.spawnController.addTask({
                    name:creepName,
                    role:type,
                    data:type === 'worker'? {workerData:{workRoom:room.name}} :{transporterData:{workRoom:room.name}}
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
        const existLimit: RoomBaseUnitLimit = JSON.parse(this.spawnController.room.memory.baseUnitLimit || '{}') || BASE_ROLE_LIMIT
        // 更新配置
        const realLimit = _.defaults(limit, existLimit[type], BASE_ROLE_LIMIT[type])
        // 把新配置覆写保存进内存
        this.spawnController.room.memory.baseUnitLimit = JSON.stringify(_.defaults({ [type]: realLimit }, existLimit))
    }
}
