
import { ErrorMapper } from "utils/errorMapper";



// p.enqueue(new Task(7))
// p.enqueue(new Task(16))
// console.log("dequeue:" + p.dequeue().level)
// p.enqueue(new Task(2))
// p.enqueue(new Task(20))





export const loop = ErrorMapper.wrapLoop(() => {


    //  var KthLargest = function(this: any, k:number, nums:BaseTask[]) {
    //   this.k = k

    //   this.q = new PriorityQueue([])

    //   for(let i = 0; i < nums.length; i++) {
    //     this.add(nums[i])
    //   }
    // };

    // KthLargest.prototype.add = function(val:BaseTask) {
    //   if (this.q.length < this.k) {
    //     this.q.push(val)
    //   } else if (this.q.peek() < val) {
    //     this.q.pop()
    //     this.q.push(val)
    //   }
    //   return this.q.peek()
    // };



});
