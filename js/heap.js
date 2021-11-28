class Heap {
  constructor() {
    // parent index => x
    // child index => 2 * x + 1, 2 * x + 2

    this.arr = [];
    this.pos = -1;
  }

  push(data) {
    if(data && data typeof 'object') {
      // object type, which must have "compare function"
    } else {
      // primitive type
    }
  }

  pop() {
    // remove the first element in the array, and return the removed element
    if(this.empty()) return null;
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
}
