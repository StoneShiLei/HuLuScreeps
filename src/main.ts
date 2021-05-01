import Mount from "mount";
import { Harvester } from "role/basisRole/harvester";
import { BodyConfig } from "role/bodyConfig/bodyConfig";
import { Roles } from "role/Roles";
import { ErrorMapper } from "utils/errorMapper";


Mount.InitStorage()
Mount.MountWork()

// x.creeps = {[_.values<Creep>(Game.creeps)[0].name]:new BaseTask()}
// x.tasks = [new BaseTask()]
// x.save()

// x.init()
// console.log(x.creeps["harvester618970"].test)
// console.log(x.tasks[0].test)

// console.log(Memory.rooms)
// console.log(Game.spawns['Spawn1'].room.name)
// console.log(Memory.rooms[Game.spawns['Spawn1'].room.name])


// roomMemory['tasks'][this.TASK_SAVE_KEY]
// let x = new Harvester()
// x.x = "1"
// console.log(JSON.stringify(x))

export const loop = ErrorMapper.wrapLoop(() => {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    const creeps = _.values<Creep>(Game.creeps)
    const spawn = Game.spawns['Spawn1'];
    const room = spawn.room;

    var harvesters = _.filter(Game.creeps, (creep) => creep.name.includes('harvester'));
    var upgraders = _.filter(Game.creeps, (creep) => creep.name.includes('worker'));




	if (harvesters.length < 3) {
		spawn.spawnCreep(BodyConfig.GetAutoBodyPart("harvester",room,spawn), "harvester" + Game.time,{memory:{role:"harvester",upgrading:false,working:false}});
	} else if (upgraders.length < 2) {
		spawn.spawnCreep(BodyConfig.GetAutoBodyPart("worker",room,spawn), "worker" + Game.time);
	}



    for(let creep of creeps){
        if(creep.name.includes('harvester')){
            creep.work();
            // if(creep.store.getFreeCapacity() > 0) {
            //     var sources = creep.room.find(FIND_SOURCES);
            //         sources.sort(function(a,b){
            //         return a.id.localeCompare(b.id);
            //     });
            //     if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            //     }
            // }
            // else {
            //     var targets = creep.room.find<Structure>(FIND_MY_STRUCTURES, {
            //             filter: (structure) => {
            //                 return  (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            //                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //             }
            //     });

            //     if(targets && targets.length > 0) {
            //         if(creep.memory.upgrading){
            //             creep.memory.upgrading = false;
            //             creep.say('🔄 move to structure');
            //         }
            //         targets.sort(function(a,b){
            //             return a.id.localeCompare(b.id);
            //         });

            //         let target = creep.pos.findClosestByRange(targets)
            //         if(!target) return

            //         if( creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            //         }
            //     }
            //     else {

            //         if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            //             creep.memory.upgrading = false;
            //             creep.say('🔄 harvest');
            //         }
            //         if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            //             creep.memory.upgrading = true;
            //             creep.say('⚡ upgrade');
            //         }

            //         if(creep.memory.upgrading) {
            //             let controller = creep.room.controller
            //             if(!controller) return
            //             if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            //                 creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
            //             }
            //         }
            //     }


            // }
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
});
