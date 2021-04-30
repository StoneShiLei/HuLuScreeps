import { BodyAutoConfigs, BodyConfigLevel } from "./types/body"

export class BodyConfigUtil {
    static bodyAutoConfigs:BodyAutoConfigs =
        {
            /**
             * 采矿单位
             */
            harvester: BodyConfigUtil.calcBodyPart(
                new Map([
                    [WORK,2],[CARRY,1],[MOVE,1],
                    [WORK,4],[CARRY,1],[MOVE,2],
                    [WORK,6],[CARRY,1],[MOVE,3],
                    [WORK,8],[CARRY,1],[MOVE,4],
                    [WORK,10],[CARRY,1],[MOVE,5],
                    [WORK,12],[CARRY,1],[MOVE,6],
                    [WORK,12],[CARRY,1],[MOVE,6],
                    [WORK,12],[CARRY,1],[MOVE,6],
                ])
            ),

            /**
             * 工作单位
             * 诸如 harvester、builder 之类的
             */
            worker: BodyConfigUtil.calcBodyPart(
                new Map([
                    [WORK,1],[CARRY,1],[MOVE,1],
                    [WORK,2],[CARRY,2],[MOVE,2],
                    [WORK,3],[CARRY,3],[MOVE,3],
                    [WORK,4],[CARRY,4],[MOVE,4],
                    [WORK,6],[CARRY,6],[MOVE,6],
                    [WORK,9],[CARRY,9],[MOVE,9],
                    [WORK,12],[CARRY,6],[MOVE,9],
                    [WORK,20],[CARRY,8],[MOVE,14],
                ])
            ),

            /**
             * 房间物流管理单位
             * 负责转移基地资源的 creep
             */
             transporter: BodyConfigUtil.calcBodyPart(
                new Map([
                    [CARRY,2],[MOVE,1],
                    [CARRY,3],[MOVE,2],
                    [CARRY,4],[MOVE,2],
                    [CARRY,5],[MOVE,3],
                    [CARRY,8],[MOVE,4],
                    [CARRY,14],[MOVE,7],
                    [CARRY,20],[MOVE,10],
                    [CARRY,32],[MOVE,16],
                ])
            ),

            /**
             * 中央物流管理单位
             * 负责转移中央物流的 creep（下面其实前 4 级都用不到，因为中央物流管理员只会在 5 级有了 centerLink 之后才会孵化）
             */
            processor: BodyConfigUtil.calcBodyPart(
                new Map([
                    [CARRY,2],[MOVE,1],
                    [CARRY,3],[MOVE,1],
                    [CARRY,5],[MOVE,1],
                    [CARRY,7],[MOVE,1],
                    [CARRY,11],[MOVE,1],
                    [CARRY,14],[MOVE,1],
                    [CARRY,26],[MOVE,1],
                    [CARRY,39],[MOVE,1],
                ])
            )
        }

    static calcBodyPart(bodySet: Map<BodyPartConstant,number>): BodyPartConstant[] {
        // 把身体配置项拓展成如下形式的二维数组
        // [ [ TOUGH ], [ WORK, WORK ], [ MOVE, MOVE, MOVE ] ]
        const resultArr:string[][] = []
        bodySet.forEach((v,k)=>{
            let partArr = Array<BodyPartConstant>(v).fill(k)
            resultArr.push(partArr)
        })
        // 把二维数组展平
        return [].concat(...resultArr)
    }

    static createBody(bodyCfgLevel:BodyConfigLevel,room:Room,spawn:StructureSpawn):BodyPartConstant[]{
        for(let level in bodyCfgLevel){
            // 先通过等级粗略判断，再加上 dryRun 精确验证
            const availableEnergyCheck = (Number(level) <= room.energyAvailable)
            let x = level as keyof BodyConfigLevel
            const dryCheck = (spawn.spawnCreep(bodyCfgLevel[level], 'bodyTester', { dryRun: true }) == OK)

        }


        const targetLevel = Object.keys(bodyCfgLevel).reverse().find(level => {
            // 先通过等级粗略判断，再加上 dryRun 精确验证
            const availableEnergyCheck = (Number(level) <= room.energyAvailable)
            const dryCheck = (spawn.spawnCreep(bodyCfgLevel[level as], 'bodyTester', { dryRun: true }) == OK)

            return availableEnergyCheck && dryCheck
        })
        if (!targetLevel) return [ ]

        // 获取身体部件
        const bodys: BodyPartConstant[] = bodyConfig[targetLevel]

        return bodys
    }
}

BodyConfigUtil.bodyAutoConfigs.harvester

