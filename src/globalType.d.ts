declare module NodeJS {
    interface Global {
        Game: Game
        Memory: Memory
        _: _.LoDashStatic
    }
}

/**
 * 包含 store 属性的建筑
 */
 type StructureWithStore =
 StructureTower |
 StructureStorage |
 StructureContainer |
 StructureExtension |
 StructureFactory |
 StructureSpawn |
 StructurePowerSpawn |
 StructureLink |
 StructureTerminal |
 StructureNuker
