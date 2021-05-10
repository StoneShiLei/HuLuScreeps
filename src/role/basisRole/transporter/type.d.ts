

interface CreepMemory{
    transporterData?:{
        /**
         * 要使用的资源存放建筑 id
         */
        sourceID?:Id<StructureWithStore>

        /**
         * 该 creep 的工作房间
         * 例如一个外矿搬运者需要知道自己的老家在哪里
         */
        workRoom: string
    }
}
