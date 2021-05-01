export abstract class BaseTask {
    id:string
    needCreepsNum:number
    workingCreepsNum:number
    priority?:number
    constructor(){
        this.id = Game.time.toString()
        this.needCreepsNum = 1
        this.workingCreepsNum = 0
    }
}
