/**
 * 建筑拓展
 */
 interface Structure {
    /**
     * 建筑的主要工作入口
     */
    onWork?(): void
    /**
     * 建筑在完成建造时触发的回调
     */
    onBuildComplete?(): void
}
