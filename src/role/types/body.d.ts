import { type } from "os"


/**
 * creep 的自动规划身体类型，以下类型的详细规划定义在 setting.ts 中
 */
 type BodyAutoConfigRole =
    'harvester' |
    'worker' |
    'transporter' |
    'processor'


/**
 * 单个角色类型的身体部件配置
 * 其键代表房间的 energyAvailable 属性
 * 300 就代表房间能量为 0 ~ 300 时应该使用的身体部件，该区间前开后闭
 * 例如：房间的 energyAvailable 为 600，则就会去使用 800 的身体部件，
 */
 type BodyConfigLevel = {
    [energyLevel in 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000 ]: BodyPartConstant[]
}

/**
 * 身体配置项类别
 * 包含了所有角色类型的身体配置
 */
 type BodyAutoConfigs = {[role in BodyAutoConfigRole] : BodyPartConstant[]}
