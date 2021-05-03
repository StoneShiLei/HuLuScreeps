

interface CreepMemory{
	sourceID?:string
	containerID?:string
	upgrading?:boolean
	getReady:boolean
	role:Role
	working:boolean
}


interface Creep{
	work():void
	getEnergyFrom(target:AllEnergySource):ScreepsReturnCode
}
