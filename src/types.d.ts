// 本项目中出现的颜色常量
type Colors = 'green' | 'blue' | 'yellow' | 'red'

declare namespace NodeJS{
    interface Global{
        hasExtension:boolean
    }
}

interface CreepMemory {
    //角色data 是全部角色特有字段的集合
    data:CreepData
    role:string
}

  interface CreepData{
    resourceId:string
    targetId:string
    x:string
    y:string
    someField:string
  }
