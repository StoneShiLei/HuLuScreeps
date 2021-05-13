

interface ConstructionSite {
    onWork():void
}

interface RoomMemory{
    constructionSiteList:{
        [id:string]:{
        /**
         * 标记该工地是否已经发出任务
         */
         isActive:boolean
        }
    }
}