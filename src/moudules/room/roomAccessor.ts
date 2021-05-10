import Utils from "utils/utils"


/**
 * 房间访问器
 *
 * 提供了一套用于和所在房间进行交互的接口
 * 如获取所在房间，获取模块内存，保存模块内存
 */
export default abstract class RoomAccessor<MemoryType>{
    /**
     * 该模块所在的房间名
     */
    protected roomName: string
    /**
     * 该模块的名称，用于日志输出
     */
    protected moduleName: string
    /**
     * 该模块的数据储存于 room.memory 的哪个键上
     */
    protected memoryKey: MemoryKey
    /**
     * 当 room.memory 没有模块数据时使用的默认内存
     */
    protected defaultMemory: MemoryType
    /**
     * 当前的模块数据
     */
    private _memory?: MemoryType


    /**
     * 初始化房间访问
     *
     * @param moduleName 本模块的名称
     * @param roomName 要管理的房间名
     * @param memoryKey 模块数据要保存到房间哪个键上
     * @param defaultMemory 缺省的模块内存
     */
    constructor(moduleName: string, roomName: string, memoryKey: MemoryKey, defaultMemory: MemoryType) {
        this.roomName = roomName
        this.moduleName = moduleName
        this.memoryKey = memoryKey
        this.defaultMemory = defaultMemory
    }

    /**
     * 模块所在房间
     */
    public get room():Room{
        if(!Game.rooms[this.roomName]){
            Utils.log(`无法访问房间实例，模块已停止运行`, [this.moduleName],  true,'red')
            throw new Error(`${this.roomName} ${this.moduleName} 房间实例不存在`)
        }
        return Game.rooms[this.roomName]
    }

        /**
     * 把当前数据保存至 room.memory
     */
    protected saveMemory(): void {
        try{
            if(_.isEmpty(this._memory)) delete Game.rooms[this.roomName].memory[this.memoryKey]
            else{
                const data = JSON.stringify(this._memory)
                Game.rooms[this.roomName].memory[this.memoryKey] = data
            }
        }
        catch(e){
            Utils.log(`无法访问房间实例，模块已停止运行`, [this.moduleName],  true,'red')
            throw e
        }
    }

    /**
     * 模块内存getter
     */
    protected get memory():MemoryType{
        if(this._memory) return this._memory

        try{
            // 房间内存不存在，使用默认内存
            if(!Game.rooms[this.roomName].memory[this.memoryKey]) this._memory = this.defaultMemory
            // 存在，使用 memory 中的数据
            else {
                this._memory = JSON.parse(Game.rooms[this.roomName].memory[this.memoryKey] ?? "")
            }
            if(!this._memory) throw new Error("无法获取到memory")
            return this._memory
        }
        catch(e){
            Utils.log(`无法访问房间实例，模块已停止运行`, [this.moduleName],true ,'red')
            throw e
        }
    }

    /**
     * 设置模块内存
     */
    protected set memory(newMemory: MemoryType) {
        this._memory = newMemory
    }
}
