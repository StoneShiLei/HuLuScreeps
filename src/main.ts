
import { BodyConfig } from "role/BodyConfigs";
import { ErrorMapper } from "utils/errorMapper";


export const loop = ErrorMapper.wrapLoop(() => {

    let x = new BodyConfig();
    let y = x.calcBodyPart(new Map([[CARRY,1],[MOVE,1],[WORK,1]]))
    console.log(y)

    Game.spawns['Spawn1'].spawnCreep(y, 'test' + Game.time,
        {memory: {role: 'upgrader'}});
});
