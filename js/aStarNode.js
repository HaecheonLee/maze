class AStarNode {
  #_F;
  #_G;
  #_H;
  #_parentNode;

  constructor(G = 0, H = 0, parentNode = null) {
    // F = G + H
    // G is the minimum cost from a starting point to the current node
    // H is the heuristic cost from the current node to an ending point

    this.F = G + H;
    this.G = G;
    this.H = H;
    this.parentNode = parentNode;
  }

  compare(node) {
    // return true if the current node has small 'F' than the comparing node
    if(node instanceof AStarNode) {
      return this.F < node.F;
    } else {
      throw new Error(`AStartNode.compare(node): ${node} is not instasnce of AStartNode`);
    }
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
  }

  get H() {
    return this.#_H;
  }

  set H(val) {
    this.#_H = val;
  }

  get parentNode() {
    return this.#_parentNode;
  }

  set parentNode(val) {
    this.#_parentNode = val;
  }
}

/* this line is only needed when testing */
module.exports = AStarNode;
