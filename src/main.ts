import BaseTask from "moudules/taskController/task/baseTask";
import { ErrorMapper } from "utils/errorMapper";

export const loop = ErrorMapper.wrapLoop(() => {

    // for(var name in Memory.creeps) {
    //     if(!Game.creeps[name]) {
    //         delete Memory.creeps[name];
    //     }
    // }

    const creeps = _.values<Creep>(Game.creeps)
    const spawn = Game.spawns['Spawn1'];
    const room = spawn.room;


    // var harvesters = _.filter(Game.creeps, (creep) => creep.name.includes('harvester'));


	// if (harvesters.length < 10) {
		// spawn.spawnCreep(BodyAutoConfigUtil.createBodyGetter(BodyAutoConfigUtil.bodyAutoConfigs.harvester)(room,spawn), "test" + Game.time,{memory:{role:"harvester",working:false,sourceID:"ef990774d80108c",containerID:"3d34bb95aa3bf7f",getReady:false}});
    // }


        // for(let creep of creeps){
        //     try{
        //         if(creep.name.includes('harvester')){

        //         }
        //         else if(creep.name.includes('transporter')){

        //         }
        //         else if(creep.name.includes('worker')){

        //         }
        //     }
        //     catch(error)
        //     {
        //         console.log(error)
        //     }
        // }

});
