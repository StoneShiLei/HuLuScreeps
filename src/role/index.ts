import HarvesterConfig from "./basisRole/harvester/harvester";



export const creepRoleConfig:{[role in AllRoles]:RoleConfig} = {
    harvester:new HarvesterConfig(),
}
