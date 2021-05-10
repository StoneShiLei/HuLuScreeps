interface CreepMemory{
    workerData?:{
        /**
         * 该 creep 的工作房间
         * 例如一个外矿搬运者需要知道自己的老家在哪里
         */
        workRoom: string
    }
}
