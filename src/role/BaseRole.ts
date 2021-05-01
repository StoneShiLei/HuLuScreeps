import { Harvester } from "./basisRole/harvester"


export abstract class BaseRole {

    // abstract bodyPart:BodyPartConstant[]
    abstract keepAlive?(room:Room):boolean
    abstract getReady?(creep:Creep):boolean
    abstract getResource?(creep:Creep):boolean
    abstract workWithTarget(creep:Creep):boolean
}
