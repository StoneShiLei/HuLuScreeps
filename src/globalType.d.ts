declare module NodeJS {
    interface Global {
        Game: Game
        Memory: Memory
        _: _.LoDashStatic
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


