

interface ConstructionSite {
    onWork():void
    /**
     * 标记该工地是否已经发出任务
     */
    isActive?:boolean
}
