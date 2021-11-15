class Queue {
  constructor() {
    this.Node = class {
      constructor(val) {
        this.val = val;
        this.next = null;
      }
    };

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(x) {
    const newNode = new this.Node(x);

    if(this.empty()) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = this.tail.next;
    }

    this.length += 1;
    return newNode;
  }

  pop() {
    if(this.empty()) return;
    const deletedNode = this.head;

    if(this.size() === 1) {
      this.head = this.tail = null;
    } else {
      this.head = this.head.next;
    }

    this.length -= 1;
    return deletedNode;
  }

  front() {
    return this.head ? this.head.val : null;
  }

  back() {
    return this.tail ? this.tail.val : null;
  }

  size() {
    return this.length;
  }

  empty() {
    return this.length === 0;
  }
}

/* this line is only for when testing */
// module.exports = Queue;
