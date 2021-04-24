import mountCreep from './creep'
// import mountPowerCreep from './powerCreep'
// import mountRoom from './room'
// import mountRoomPostion from './roomPosition'
// import mountGlobal from './global'
// import mountStructure from './structures'

export default function():void {
    // if(!global.hasExtension){
        console.log('[mount] 重新挂载拓展')

        //初始化存储
        initStorage()

        // 挂载全部拓展
        // mountGlobal()
        // mountRoom()
        // mountRoomPostion()
        mountCreep()
        // mountStructure()

        // global.hasExtension = true

        workAfterMount()
    // }
}

/**
 * 初始化存储
 */
 function initStorage() {
    if (!Memory.rooms) Memory.rooms = {}
    else delete Memory.rooms.undefined

}

// 挂载完成后要执行的一些作业
function workAfterMount() {

}
