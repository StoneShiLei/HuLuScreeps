import { CreepNameGetter } from "./CreepNameGetter";
import RoomSpawnController from "./roomSpawnController";
import SpawnTask from "./spawnTask";


export default class RoomCreepReleaseUtil{

    readonly spawner:RoomSpawnController

    constructor(spawner:RoomSpawnController){
        this.spawner = spawner
    }


    public ReleaseHarvester():OK | ERR_NOT_FOUND{
        if(!this.spawner.room.sources){
            this.spawner.room.sources = this.spawner.room.find(FIND_SOURCES)
        }

        const roomName = this.spawner.room.name;
        const sources = this.spawner.room.sources;

        (sources || []).map((source,index) =>{
            this.spawner.addTask(new SpawnTask(
                CreepNameGetter.harvester(roomName,index),
                "harvester",
                {}
            ))
        })

        return OK
    }
}
