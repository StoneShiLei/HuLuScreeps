

//优先级队列  二叉堆实现
export class PriorityQueue<T extends BaseTask> {
    data:T[]
    length:number

    constructor(data:T[]){
        this.data = data;
        this.length = this.data.length;

        if (this.length > 0) {
            for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
        }
    }

    public push(item:T){
        this.data.push(item)
        this.length++
        this._up(this.length - 1)
    }

    public pop():T {
        if (this.length === 0) return null;
        const top = this.data[0];
        const bottom = this.data.pop();
        this.length--;
        if (this.length > 0) {
          this.data[0] = bottom;
          this._down(0);
        }
        return top;
    }

    public peek() {
        return this.data[0];
    }

    private _up(pos:number) {
        const {data, compare} = this;
        const item = data[pos];

        while (pos > 0) {
          const parent = (pos - 1) >> 1;
          const current = data[parent];
          if (compare(item, current) >= 0) break;
          data[pos] = current;
          pos = parent;
        }
        data[pos] = item;
    }

    private _down(pos:number) {
        const {data, compare} = this;
        const halfLength = this.length >> 1;
        const item = data[pos];

        while (pos < halfLength) {
          let left = (pos << 1) + 1;
          let best = data[left];
          const right = left + 1;

          if (right < this.length && compare(data[right], best) < 0) {
            left = right;
            best = data[right];
          }
          if (compare(best, item) >= 0) break;

          data[pos] = best;
          pos = left;
        }

        data[pos] = item;
    }

    private compare(a:T,b:T):number{
        return b.level - a.level
    }

}


