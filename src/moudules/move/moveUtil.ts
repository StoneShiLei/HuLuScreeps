

export default class MoveUtil{

    static costCache:{[roomName:string]:CostMatrix} = {}

    static findPath(creep:Creep | PowerCreep,target:RoomPosition,gotoOpt:GoToOpt = {range:0}):RoomPosition[] | undefined{
        const range = gotoOpt.range === undefined ? 1 : gotoOpt.range
        const result = PathFinder.search(creep.pos,{pos:target,range},{maxOps:4000,roomCallback:roomName =>{

            // 强调了不许走就不走
            if (Memory.bypassRooms && Memory.bypassRooms.includes(roomName)) return false

            const room = Game.rooms[roomName]
            // 房间没有视野
            if(!room) return false

            // 尝试从缓存中读取，没有缓存就进行查找
            let costs =  (roomName in this.costCache) ? this.costCache[roomName].clone() : undefined
            if(!costs){
                costs = new PathFinder.CostMatrix
                const terrain = new Room.Terrain(roomName)

                // 设置基础地形 cost
                for (let x = 0; x < 50; x ++) for (let y = 0; y < 50; y ++) {
                    const tile = terrain.get(x, y);
                    const weight =
                        tile === TERRAIN_MASK_WALL ? 255 :
                        tile === TERRAIN_MASK_SWAMP ? 10 : 4

                    costs.set(x, y, weight)
                }

                const addCost = (item: Structure | ConstructionSite) => {
                    if(!costs) return
                    // 更倾向走道路
                    if (item.structureType === STRUCTURE_ROAD) {
                        // 造好的路可以走
                        if (item instanceof Structure) costs.set(item.pos.x, item.pos.y, 1)
                        // 路的工地保持原有 cost
                        else return
                    }
                    // 不能穿过无法行走的建筑
                    else if (item.structureType !== STRUCTURE_CONTAINER && (item.structureType !== STRUCTURE_RAMPART || !item.my)) {
                        costs.set(item.pos.x, item.pos.y, 255)
                    }
                }

                // 给建筑和工地添加 cost
                room.find(FIND_STRUCTURES).forEach(addCost)
                room.find(FIND_CONSTRUCTION_SITES).forEach(addCost)

                this.costCache[roomName] = costs.clone()
            }

            // 躲避房间中的 creep
            room.find(FIND_CREEPS).forEach(otherCreep => {
                if(!costs) return
                costs.set(otherCreep.pos.x, otherCreep.pos.y, 255)
            })

            // 躲避房间中的非己方 powercreep
            room.find(FIND_POWER_CREEPS).forEach(pc => {
                if(!costs) return
                if (!pc.my) costs.set(pc.pos.x, pc.pos.y, 255)
            })

            return costs
        }})


        // 没找到就返回空
        if (result.path.length <= 0) return undefined

        // 根据玩家指定的重用距离返回缓存
        return result.path
    }


    static findSafePath(creep:Creep | PowerCreep,target:RoomPosition,gotoOpt:GoToOpt = {range:0}):RoomPosition[] {
        const range = gotoOpt.range === undefined ? 1 : gotoOpt.range

        const result = PathFinder.search(creep.pos,{pos:target,range},{maxOps:4000,roomCallback:roomName =>{
            // 强调了不许走就不走
            if (Memory.bypassRooms && Memory.bypassRooms.includes(roomName)) return false
            return true
        }})
        return result.path
    }
}
