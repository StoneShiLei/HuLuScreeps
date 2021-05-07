

// interface RoleConfig{
//     // keepAlive?:()

//     getReady?(creep:Creep):boolean
//     getResource?(creep:Creep):boolean
//     workWithTarget(creep:Creep):boolean
//     // body
// }



type AllRoles = BasisRoles

type BasisRoles = Harvester | Transporter | Worker

type Harvester = "harvester"
type Transporter = "transporter"
type Worker = "worker"
