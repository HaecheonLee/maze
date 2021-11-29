class Heap {
  constructor() {
    // parent index => x
    // child index => 2 * x + 1, 2 * x + 2

    this.arr = [];
    this.pos = -1;
  }

  push(data) {
    // insert new data at the end of the array
    this.arr.push(data);
    this.pos++;

    let currentIdx = this.pos;
    while(currentIdx) {
      let parentIdx = currentIdx & 1 ? ((currentIdx - 1) >> 1) : ((currentIdx - 2) >> 1);

      if(this.#check_if_left_smaller(this.arr[currentIdx], this.arr[parentIdx])) {
        // arr[currentPos] < arr[parentIdx], swap and update the currentIdx
        [this.arr[currentIdx]. this.arr[parentIdx]] = [this.arr[parentIdx], this.arr[currentIdx]];
        currentIdx = parentIdx;
      } else {
        // arr[currentPos] >= arr[parentIdx], break
        break;
      }
    }
  }

  pop() {
    // remove the first element in the array, and return the removed element
    if(this.empty()) return null;

    // remove the element at the index of 0 in the array
    const peak = this.top();
    this.arr[0] = arr[this.pos];
    this.arr.pop();
    this.pos--;

    let currentIdx = 0;
    while(1) {
      let leftChildIdx = currentIdx * 2 + 1;
      let rightChildIdx = currentIdx * 2 + 2;

      // set invalid Idx's value  undefined to make it incomparable
      let leftChildValue = this.arr.length < leftChildIdx ? arr[leftChildIdx] : undefined;
      let rightChildValue = this.arr.length < rightChildIdx ? arr[rightChildIdx] : undefined;

      let smallestValue = this.#check_if_left_smaller(leftChildValue, rightChildIdx) ? leftChildValue : rightChildValue;
      let smallestIdx = smallestValue === leftChildValue ? leftChildIdx : rightChildIdx;

      // check if the currentIdx value is larger than the selected smallest one
      if(this.#check_if_left_smaller(smallestValue, this.arr[currentIdx]) {
        // if larger, swap them
        [this.arr[currentIdx], this.arr[smallestIdx]] = [this.arr[smallestIdx], this.arr[currentIdx]];
        currentIdx = smallestIdx;
      } else {
        // if currentIdx value is smaller than child, break
        break;
      }
    }

    return peak;
  }

  top() {
    if(this.empty()) return null;
    return arr[0];
  }

  size() {
    return arr.length;
  }

  empty() {
    return arr.length === 0;
  }

  #check_if_left_smaller(data1, data2) {
    // data1 < data2: true, else false
    const isObject = typeof data1 === 'object';

    // check if both data type is same
    if(typeof data1 === typeof data2) {
      if(isObject) {
        // if object type, use a pre-defined function called "compare()"
        return data1.compare(data2);
      } else {
        // primitive type
        return data1 < data2;
      }

    } else {
      throw new Error('Heap.#compare(data1, data2): The two comparing data have different data type');
    }
  }

  #check_if_object(data) {
    return data && (typeof data === 'object');
  }
}
