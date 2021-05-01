

export class BodyConfig {
    static levelArr = [300,550,800,1300,1800,2300,5600,1000]
    static bodyAutoConfigs = new Map<Role,Map<number,BodyPartConstant[]>>([
        ["harvester",BodyConfig.getLevelBodyMap([
            new Map([[WORK,2],[CARRY,1],[MOVE,1]]),
            new Map([[WORK,4],[CARRY,1],[MOVE,2]]),
            new Map([[WORK,6],[CARRY,1],[MOVE,3]]),
            new Map([[WORK,8],[CARRY,1],[MOVE,4]]),
            new Map([[WORK,10],[CARRY,1],[MOVE,5]]),
            new Map([[WORK,12],[CARRY,1],[MOVE,6]]),
            new Map([[WORK,12],[CARRY,1],[MOVE,6]]),
            new Map([[WORK,12],[CARRY,1],[MOVE,6]]),
        ])],
        ["worker",BodyConfig.getLevelBodyMap([
            new Map([[WORK,1],[CARRY,1],[MOVE,1]]),
            new Map([[WORK,2],[CARRY,2],[MOVE,2]]),
            new Map([[WORK,3],[CARRY,3],[MOVE,3]]),
            new Map([[WORK,4],[CARRY,4],[MOVE,4]]),
            new Map([[WORK,6],[CARRY,6],[MOVE,6]]),
            new Map([[WORK,9],[CARRY,9],[MOVE,9]]),
            new Map([[WORK,12],[CARRY,6],[MOVE,9]]),
            new Map([[WORK,20],[CARRY,8],[MOVE,14]]),
        ])],
        ["transporter",BodyConfig.getLevelBodyMap([
            new Map([[CARRY,2],[MOVE,1]]),
            new Map([[CARRY,3],[MOVE,2]]),
            new Map([[CARRY,4],[MOVE,2]]),
            new Map([[CARRY,5],[MOVE,3]]),
            new Map([[CARRY,8],[MOVE,4]]),
            new Map([[CARRY,14],[MOVE,7]]),
            new Map([[CARRY,14],[MOVE,7]]),
            new Map([[CARRY,32],[MOVE,16]]),
        ])],
    ])

    /**
     * 获取有能量等级关联的bodypart
     * @param bodyPartsMap [[WORK,1],[MOVE,1]] * 8
     * @returns 300: [WORK,MOVE]
     */
    static getLevelBodyMap(bodyPartsMap:Array<Map<BodyPartConstant,number>>):Map<number,BodyPartConstant[]>{
        let levelBodyConfig = new Map<number,BodyPartConstant[]>()
        this.levelArr.forEach((level,index) =>{
            levelBodyConfig.set(level,this.calcBodyPart(bodyPartsMap[index]))
        })

        return levelBodyConfig
    }

    /**
     *
     * @param bodyPartsMap [[WORK,1],[MOVE,1]]
     * @returns [WORK,MOVE]
     */
    static calcBodyPart(bodyPartsMap:Map<BodyPartConstant,number>):BodyPartConstant[]{
        const tempArr:BodyPartConstant[][] = []
        bodyPartsMap.forEach((v,k) =>{
            const bodyPartArr = Array(v).fill(k)
            tempArr.push(bodyPartArr)
        })
        const resultArr:BodyPartConstant[] = []
        return resultArr.concat.apply([],tempArr)
    }

    /**
     *
     * @param role 角色
     * @param room 房间
     * @param spawn
     * @returns 角色部件
     */
    static GetAutoBodyPart(role:Role,room:Room,spawn:StructureSpawn):BodyPartConstant[]{

        const bodyParts = this.bodyAutoConfigs.get(role);
        if(!bodyParts) throw new Error("bodyAutoPart未初始化")
        const targetLevel = this.levelArr.reverse().find(level =>{
            const levelBodyPart = bodyParts.get(level);
            if(levelBodyPart == null) throw new Error("bodyAutoPart未初始化")
            const availableEnergyCount = level <= room.energyAvailable
            const dryCheck = spawn.spawnCreep(levelBodyPart,"bodyTester",{dryRun:true}) == OK

            return availableEnergyCount && dryCheck
        })

        if(!targetLevel) return []

        const bodyPart = bodyParts.get(targetLevel)
        return bodyPart?bodyPart:[]
    }
}






