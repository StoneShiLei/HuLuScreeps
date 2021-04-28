import { PriorityQueue } from "./priorityQueue";

class TaskCenter<T extends BaseTask> {
    queue:PriorityQueue<T>

    constructor(array:T[]) {
        this.queue = new PriorityQueue(array)
    }

    pushTask(task:T){
        this.queue.push(task);
    }

    GetTask():T{
        return this.queue.pop();
    }

    peekTask():T{
        return this.queue.peek();
    }

    serialize():void{

    }


}
