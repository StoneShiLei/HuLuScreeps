
/**
 * getAvailableSource 中，建筑存储中能量大于多少才会被当作目标
 */
 export const ENERGY_USE_LIMIT = {
    [STRUCTURE_TERMINAL]: 10000,
    [STRUCTURE_STORAGE]: 50000,
    [STRUCTURE_CONTAINER]: 400,
    [STRUCTURE_LINK]: 0,
    // 一个 carry 50 容积，至少要保证能有一个 carry 的能量给填充单位用
    [RESOURCE_ENERGY]: 100

}
