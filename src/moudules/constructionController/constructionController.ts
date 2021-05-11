import { BUILD_PRIORITY } from "setting"
import Utils from "utils/utils"


/**
 * 一个简单的建筑工地管理模块
 * 提供了工地自动排队（超出上限的工地暂时挂起），确认建筑是否建造完成，获取最近待建造工地、工地优先级的功能
 */
export default class ConstructionController{
    /**
     * 待放置的工地点位
     * 因为最多只能放置 100 个工地，所以超出的部分会先存放到这里
     */
    private static waitingConstruction: ConstructionPos[] = []

    /**
     * 上个 tick 的 Game.constructionSites
     * 用于和本 tick 进行比对，找到是否有工地建造完成
     */
    private static lastGameConstruction: { [constructionSiteId: string]: ConstructionSite } = {}

    /**
     * 建造完成的建筑，键为工地 id，值为对应建造完成的建筑
     * 会存放在这里供其他模块搜索，全局重置时将被清空
     */
    public static buildCompleteSite: { [constructionSiteId: string]: Structure } = {}

    public static manageConstruction(){
        this.planSite()
        this.handleCompleteSite()
    }

    static save(){
        if (!Game._needSaveConstructionData) return
        if (this.waitingConstruction.length <= 0) delete Memory.waitingConstruction
        else Memory.waitingConstruction = JSON.stringify(this.waitingConstruction)
    }

    static init(){
        this.waitingConstruction = (JSON.parse(Memory.waitingConstruction || '[]') as ConstructionPos[]).map(({pos, type} ) => {
            // 这里把位置重建出来
            const { x, y, roomName } = pos
            return { pos: new RoomPosition(x, y, roomName), type }
        })
    }

    static planSite(){
        // 没有需要放置的、或者工地已经放满了，直接退出
        if (this.waitingConstruction.length <= 0) return
        const buildingSiteLength = Object.keys(Game.constructionSites).length
        if (buildingSiteLength >= MAX_CONSTRUCTION_SITES) return

        // 取出本 tick 的最大允许放置数量
        const preparePlaceSites = this.waitingConstruction.splice(0, MAX_CONSTRUCTION_SITES - buildingSiteLength)

        const cantPlaceSites = preparePlaceSites.filter(site => {
            const { pos, type } = site
            const result = pos.createConstructionSite(type)

            if (result === ERR_INVALID_TARGET) {
                // log(`工地 ${type} 重复放置，已放弃，位置 [${pos}]`, ['建造控制器'], 'yellow')
                return false
            }
            // 放置失败，下次重试
            else if (result !== OK && result !== ERR_FULL && result !== ERR_RCL_NOT_ENOUGH) {
                Utils.log(`工地 ${type} 无法放置，位置 [${pos}]，createConstructionSite 结果 ${result}`, ['建造控制器'], false,'yellow')
                return true
            }

            return false
        })

        // 把放置失败的工地放到队首下次再次尝试放置
        if (cantPlaceSites.length > 0) this.waitingConstruction.unshift(...cantPlaceSites)
        Game._needSaveConstructionData = true
    }

    /**
     * 找到建造完成的工地并触发对应的回调
     */
    static handleCompleteSite(){
        try {
            const lastSiteIds = Object.keys(this.lastGameConstruction)
            const nowSiteIds = Object.keys(Game.constructionSites)
            // 工地数量不一致了，说明有工地被踩掉或者造好了
            if (lastSiteIds.length !== nowSiteIds.length) {
                const disappearedSiteIds = lastSiteIds.filter(id => !(id in Game.constructionSites))

                disappearedSiteIds.map(siteId => {
                    const lastSite = this.lastGameConstruction[siteId]
                    const structure = this.getSiteStructure(lastSite)

                    // 建造完成
                    if (structure) {
                        // 如果有的话就执行回调
                        if (structure.onBuildComplete) structure.onBuildComplete()
                        this.buildCompleteSite[siteId] = structure
                    }
                    // 建造失败，回存到等待队列
                    else {
                        this.waitingConstruction.push({ pos: lastSite.pos, type: lastSite.structureType })
                        Game._needSaveConstructionData = true
                    }
                })
            }
        }
        catch (e) {
            throw e
        }
        finally {
            // 更新缓存
            this.lastGameConstruction = Game.constructionSites
        }
    }

    /**
     * 获取最近的待建造工地
     * 使用前请确保该位置有视野
     *
     * @param pos 获取本房间内距离该位置最近且优先级最高的工地
     */
    static getNearSite(pos: RoomPosition): ConstructionSite | undefined  {
        const room = Game.rooms[pos.roomName]
        if (!room) return undefined

        const sites: ConstructionSite[] = room.find(FIND_MY_CONSTRUCTION_SITES)
        if (sites.length <= 0) return undefined

        const groupedSite = _.groupBy(sites, site => site.structureType)

        // 先查找优先建造的工地
        for (const type of BUILD_PRIORITY) {
            const matchedSite = groupedSite[type]
            if (!matchedSite) continue

            if (matchedSite.length === 1) return matchedSite[0]
            const result = pos.findClosestByPath(matchedSite)
            if(!result) return undefined
            return result
        }

        // 没有优先建造的工地，直接找最近的
        const result = pos.findClosestByPath(sites)
        if(!result) return undefined
        return result
    }

    /**
     * 向队列里新增建造任务
     */
    static addConstructionSite(sites: ConstructionPos[]) {
        this.waitingConstruction.push(...sites)
        Game._needSaveConstructionData = true
    }

    /**
     * 检查一个建筑工地是否建造完成
     *
     * @param site 建筑工地
     * @returns 若建造完成则返回对应的建筑
     */
    static getSiteStructure(site: ConstructionSite): Structure | undefined{
        // 检查上面是否有已经造好的同类型建筑
        const result = site.pos.lookFor(LOOK_STRUCTURES).find(({ structureType }) => {
            return structureType === site.structureType
        })
        return result
    }
}
