const AStarNode = require('../aStarNode');
const Heap = require('../heap');


describe("Heap Testing...", () => {
  it("empty() & size(): return true when size is 0 & return the total elements in the heap", () => {
    const heap = new Heap();

    expect(heap.empty()).toBeTruthy(); // true

    const LEN = 100;
    for(let i = 0; i < LEN; i++) {
      heap.push(i);
    }

    expect(heap.size()).toBe(LEN);    // LEN
    expect(heap.empty()).toBeFalsy(); // false

    for(let i = 0; i < LEN; i++) {
      heap.pop();
    }

    expect(heap.size()).toBe(0);        // 0
    expect(heap.empty()).toBeTruthy();  // true;
  });

  it("push(data) & pop(): min-heap implmentation & return peak when popped", () => {
    const heap = new Heap();

    const LEN = 100;
    const MIN = 0, MAX = 10000000;
    const arr = [];

    for(let i = 0; i < LEN; i++) {
      // range: [MIN, MAX]
      const randNum = Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
      heap.push(randNum);
      arr.push(randNum);
    }

    arr.sort((a, b) => a - b);

    for(let i = 0; i < LEN; i++) {
      const least = heap.pop();
      expect(least).toEqual(arr[i]);
    }
  });

  it("aStarNode Testing", () => {
    const heap = new Heap();

    const arr = [];
    const LEN = 10;
    for(let i = 0; i < LEN; i++) {
      for(let j = 0; j < LEN; j++) {
        // starting to current node:  taxicab distdance
        // current node to ending:    euclidean distasnce

        const G = i + j;
        const H = Math.floor(Math.sqrt((LEN - 1 - i)**2 + (LEN - 1 - j)**2));

        const node = new AStarNode(G, H, null);
        heap.push(node);
        arr.push(G + H);
      }
    }

    arr.sort((a, b) => a - b);

    let pos = 0;
    while(!heap.empty()) {
      const minNode = heap.top();
      heap.pop();
      expect(minNode.F).toBe(arr[pos++]);
    }
  });
});
