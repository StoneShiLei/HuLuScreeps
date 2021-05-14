declare module NodeJS {
    interface Global {
        Game: Game
        Memory: Memory
        _: _.LoDashStatic
    }
}

interface Memory{
    whiteList?:{
        [userName: string]: number
    }
}

/**
 * 包含任意键值对的对象
 */
 type AnyObject = { [key: string]: any }


 /**
 * 本项目中出现的颜色常量
 */
type Colors = 'green' | 'blue' | 'yellow' | 'red'


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
