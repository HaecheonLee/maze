class AStarNode {
  #_x;
  #_y;
  #_F;
  #_G;
  #_H;
  #_parentNode;

  constructor(x = -1, y = -1, g = 0, h = 0, parentNode = null) {
    // F = G + H
    // G is the minimum cost from a starting point to the current node
    // H is the heuristic cost from the current node to an ending point

    this.x = x;
    this.y = y;
    this.F = g + h;
    this.G = g;
    this.H = h;
    this.parentNode = parentNode;
  }

  compare(node) {
    // return true if the current node has small 'F' than the comparing node
    if(node instanceof this.constructor) {
      return this.F < node.F;
    } else {
      throw new Error(`AStartNode.compare(node): ${node} is not instasnce of AStartNode`);
    }
  }

  get x() {
    return this.#_x;
  }

  set x(val) {
    this.#_x = val;
  }

  get y() {
    return this.#_y;
  }

  set y(val) {
    this.#_y = val;
  }

  get F() {
    return this.#_F;
  }

  set F(val) {
    this.#_F = val;
  }

  get G() {
    return this.#_G;
  }

  set G(val) {
    this.#_G = val;

    // update F score when G changes
    this.F = this.H + this.G;
  }

  get H() {
    return this.#_H;
  }

  set H(val) {
    this.#_H = val;

    // update F score when H changes
    this.F = this.H + this.G;
  }

  get parentNode() {
    return this.#_parentNode;
  }

  set parentNode(val) {
    this.#_parentNode = val;
  }
}

/* this line is only needed when testing */
// module.exports = AStarNode;
