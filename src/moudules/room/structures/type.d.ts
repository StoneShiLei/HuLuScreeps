/**
 * 建筑拓展
 */
 interface Structure {
    // 是否为自己的建筑，某些建筑不包含此属性，也可以等同于 my = false
    my?: boolean
    /**
     * 建筑的主要工作入口
     */
    onWork?(): void
    /**
     * 建筑在完成建造时触发的回调
     */
    onBuildComplete?(): void
}
