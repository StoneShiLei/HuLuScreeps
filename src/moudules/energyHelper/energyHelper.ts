import { ENERGY_USE_LIMIT } from "setting"

export default class EnergyHelper {

    /**
     * 获取目标中的能量数量，用于抹平差异
     */
    static getEnergyAmount(target: EnergyTarget):number {
        if ('store' in target) return target.store[RESOURCE_ENERGY]
        else if ('amount' in target) return target.amount
        else return 0
    }

    /**
     * 获取目标的类型，用于抹平差异
     */
    static getTargetType(target: EnergyTarget) {
        if ('structureType' in target) return target.structureType
        else if ('resourceType' in target) return target.resourceType
        else throw new Error("未识别的类型")
    }
}
