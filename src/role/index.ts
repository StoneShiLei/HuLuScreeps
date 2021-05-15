import CenterConfig from "./basisRole/center/center";
import HarvesterConfig from "./basisRole/harvester/harvester";
import TransporterConfig from "./basisRole/transporter/transporter";
import WorkerConfig from "./basisRole/worker/worker";



export const creepRoleConfig:{[role in AllRoles]:RoleConfig} = {
    harvester:new HarvesterConfig(),
    transporter:new TransporterConfig(),
    worker:new WorkerConfig(),
    center:new CenterConfig(),
}
