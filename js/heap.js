class Heap {
  // private fields
  #arr;
  #pos;

  constructor() {
    // parent index => x
    // child index => 2 * x + 1, 2 * x + 2

    this.#arr = [];
    this.#pos = -1;
  }

  push(data) {
    // insert new data at the end of the array
    this.#arr.push(data);
    this.#pos++;

    let currentIdx = this.#pos;
    while(currentIdx) {
      let parentIdx = currentIdx & 1 ? ((currentIdx - 1) >> 1) : ((currentIdx - 2) >> 1);

      if(this.#check_if_left_smaller(this.#arr[currentIdx], this.#arr[parentIdx])) {
        // arr[currentPos] < arr[parentIdx], swap and update the currentIdx
        [this.#arr[currentIdx], this.#arr[parentIdx]] = [this.#arr[parentIdx], this.#arr[currentIdx]];
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
    const bottom = this.#arr.pop();

    // set bottom to peak, if the arr is not empty
    if(!this.empty()) this.#arr[0] = bottom;
    this.#pos--;

    let currentIdx = 0;
    while(1) {
      const leftChildIdx = currentIdx * 2 + 1;
      const rightChildIdx = currentIdx * 2 + 2;

      if(!this.#is_valid_child_idx(leftChildIdx) && !this.#is_valid_child_idx(rightChildIdx)) {
        // if no more child, break loop
        break;
      }

      // set invalid Idx's value  undefined to make it incomparable
      const leftChildValue = this.#is_valid_child_idx(leftChildIdx) ? this.#arr[leftChildIdx] : this.#arr[rightChildIdx];
      const rightChildValue = this.#is_valid_child_idx(rightChildIdx) ? this.#arr[rightChildIdx] : this.#arr[leftChildIdx];

      const smallestValue = this.#check_if_left_smaller(leftChildValue, rightChildValue) ? leftChildValue : rightChildValue;
      const smallestIdx = smallestValue === leftChildValue ? leftChildIdx : rightChildIdx;

      // check if the currentIdx value is larger than the selected smallest one
      if(this.#check_if_left_smaller(smallestValue, this.#arr[currentIdx])) {
        // child < this.#arr[currentIdx], swap and update currentIdx
        [this.#arr[currentIdx], this.#arr[smallestIdx]] = [this.#arr[smallestIdx], this.#arr[currentIdx]];
        currentIdx = smallestIdx;
      } else {
        // child >= this.#arr[currentPos], break the loop
        break;
      }
    }

    return peak;
  }

  top() {
    if(this.empty()) return null;
    return this.#arr[0];
  }

  size() {
    return this.#arr.length;
  }

  empty() {
    return this.#arr.length === 0;
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

  #is_valid_child_idx(idx) {
    return idx < this.size();
  }
}

/* this line is only needed when testing */
module.exports = Heap;
