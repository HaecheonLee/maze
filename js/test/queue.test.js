const Queue = require('../queue');

describe("Queue Class Testing", ()=> {
  it("empty() & size(): return true when the size is 0", () => {
    const q = new Queue();
    expect(q.empty() && !q.size()).toEqual(true);
  });

  it("front() & back(): the head and the tail indicates the first and the last each", () => {
    const q = new Queue();

    const S = 1, E = 100;
    for(let i = S; i <= E; i++) {
      q.push(i);
    }

    expect(q.front()).toEqual(S);
    expect(q.back()).toEqual(E);
  });

  it("push(x): the head indicates first, and the tail indicates last", () => {
    const q = new Queue();

    for(let i = 1; i <= 10; i++) {
      const newNode = q.push(i);
      expect(q.back()).toEqual(newNode.val);
      // console.log(`${i} is `, q.back());
    }
  });

  describe("pop() testing", () => {
    it("pop(): remove the first element from the list", () => {
      const q = new Queue();

      q.push(1);
      for(let i = 2; i <= 10; i++) {
        q.pop();
        q.push(i);

        expect(q.front()).toEqual(i);
        expect(q.back()).toEqual(i);
      }

      expect(q.size()).toEqual(1);
    });

    it("pop(): the head and the tail are null, when empty", () => {
      const q = new Queue();

      for(let i = 1; i <= 1000; i++) {
        q.push(i);
      }

      expect(q.front()).toEqual(expect.anything());
      expect(q.back()).toEqual(expect.anything());

      // make the list empty
      while(!q.empty()) {
        q.pop();
      }

      expect(q.front()).toBeNull();
      expect(q.back()).toBeNull();
    });
  })
});
