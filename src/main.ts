import Mount from "mount";
import { Harvester } from "role/basisRole/harvester";
import { BodyConfig } from "role/bodyConfig/bodyConfig";
import { Roles } from "role/Roles";
import { ErrorMapper } from "utils/errorMapper";


Mount.InitStorage()
Mount.MountWork()

export const loop = ErrorMapper.wrapLoop(() => {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    const creeps = _.values<Creep>(Game.creeps)
    const spawn = Game.spawns['Spawn1'];
    const room = spawn.room;

    var harvesters1 = _.filter(Game.creeps, (creep) => creep.name.includes('harvester1'));
    var harvesters2 = _.filter(Game.creeps, (creep) => creep.name.includes('harvester2'));
    var upgraders = _.filter(Game.creeps, (creep) => creep.name.includes('worker'));
    var transporters = _.filter(Game.creeps, (creep) => creep.name.includes('transporter'));




	if (harvesters1.length < 1) {
		spawn.spawnCreep(BodyConfig.GetAutoBodyPart("harvester",room,spawn), "harvester1" + Game.time,{memory:{role:"harvester",working:false,sourceID:"ef990774d80108c",containerID:"3d34bb95aa3bf7f",getReady:false}});
    }else if(transporters.length < 6){
		spawn.spawnCreep(BodyConfig.GetAutoBodyPart("transporter",room,spawn), "transporter" + Game.time,{memory:{role:"transporter",working:false,getReady:false}});
    }
     else if(harvesters2.length < 1){
		spawn.spawnCreep(BodyConfig.GetAutoBodyPart("harvester",room,spawn), "harvester2" + Game.time,{memory:{role:"harvester",working:false,sourceID:"ba3c0774d80c3a8",containerID:"7059bc605a55142",getReady:false}});
    }else if (upgraders.length < 4) {
		spawn.spawnCreep(BodyConfig.GetAutoBodyPart("worker",room,spawn), "worker" + Game.time);
	}


        for(let creep of creeps){
            try{
                if(creep.name.includes('harvester')){
                    creep.work();
                }
                else if(creep.name.includes('transporter')){
                    creep.work();
                }
                else if(creep.name.includes('worker')){
                    if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
                        creep.memory.upgrading = false;
                        creep.say('🔄 harvest');
                    }
                    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
                        creep.memory.upgrading = true;
                        creep.say('⚡ upgrade');
                    }

                    let controller =creep.room.controller
                    if(!controller) return
                    if(creep.memory.upgrading) {
                        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else {
                        var sources = creep.room.find(FIND_SOURCES);
                                    sources.sort(function(a,b){
                            return a.id.localeCompare(b.id);
                        });
                        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }
            catch(error)
            {
                console.log(error)
            }
        }

});
