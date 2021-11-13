class Queue {
  constructor() {
    this.Node = (val) => {
      this.val = val;
      this.next = null;
    }

    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  push(x) {
    const node = new this.Node(x);

    if(this.isEmpty()) {
      this.front = this.rear = node;
    } else {
      this.rear.next = node;
      this.rear = this.rear.next;
    }

    this.size += 1;
  }

  pop() {
    if(this.isEmpty()) return;
    this.front = this.front.next;
    this.size -= 1;
  }

  front() {
    return this.front.val;
  }

  back() {
    return this.rear.val;
  }

  size() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0;
  }
}

module.exports = queue;
