/**
 * 白名单控制 api
 * 挂载在全局，由玩家手动调用
 * 白名单仅应用于房间 tower 的防御目标，不会自动关闭 rempart，也不会因为进攻对象在白名单中而不攻击
 */
export default class WhiteList {

    /**
     * 判断是否为白名单玩家
     *
     * @param creep 要检查的 creep
     * @returns 是否为白名单玩家
     */
    static whiteListFilter(creep:Creep) {
        if (!Memory.whiteList) return true
        // 加入白名单的玩家单位不会被攻击，但是会被记录
        if (creep.owner.username in Memory.whiteList) {
            Memory.whiteList[creep.owner.username] += 1
            return false
        }

        return true
    }

    /**
     * 添加用户到白名单
     * 重复添加会清空监控记录
     *
     * @param userName 要加入白名单的用户名
     */
    static add(userName: string): string {
        if (!Memory.whiteList) Memory.whiteList = {}

        Memory.whiteList[userName] = 0
        return `[白名单] 玩家 ${userName} 已加入白名单`
    }

    /**
     * 从白名单中移除玩家
     *
     * @param userName 要移除的用户名
     */
    static remove(userName: string): string {
        if(!Memory.whiteList) throw new Error("白名单为空")
        if (!(userName in Memory.whiteList)) return `[白名单] 该玩家未加入白名单`

        const enterTicks = Memory.whiteList[userName]
        delete Memory.whiteList[userName]
        // 如果玩家都删完了就直接移除白名单
        if (Object.keys(Memory.whiteList).length <= 0) delete Memory.whiteList

        return `[白名单] 玩家 ${userName} 已移出白名单，已记录的活跃时长为 ${enterTicks}`
    }

    /**
     * 显示所有白名单玩家及其活跃时长
     */
    static show() {
        const whiteList = Memory.whiteList
        if (!whiteList) return `[白名单] 未发现玩家`
        const logs = [ `[白名单] 玩家名称 > 该玩家的单位在自己房间中的活跃总 tick 时长` ]

        // 绘制所有的白名单玩家信息
        logs.push(...Object.keys(whiteList).map(userName => `[${userName}] > ${whiteList[userName]}`))
        return logs.join('\n')
    }
}
