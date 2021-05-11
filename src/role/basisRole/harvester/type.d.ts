

type AllHarvestMode = HarvestStartMode | HarvestContainerMode | HarvestStructureMode
type HarvestStartMode = "harvestStartMode"
type HarvestContainerMode = "harvestContainerMode"
type HarvestStructureMode = "harvestStructureMode"

type ActionStrategy = {
    [key in AllHarvestMode]: {
        prepare: (creep:Creep, source: Source) => boolean,
        source: (creep: Creep, source: Source) => boolean,
        target: (creep: Creep) => boolean,
    }
}
