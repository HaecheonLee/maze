class aStarNode {
  constructor() {
    // F = G + H
    // G is the minimum cost from a starting point to the current node
    // H is the heuristic cost from the current node to an ending point

    this.F = -1;
    this.G = -1;
    this.H = -1;
    this.parentNode = null;
  }

  compare(node) {
    // return true if the current node has small 'F' than the comparing node
    if(node instanceof aStarNode) {
      return this.F < node.F;
    }

    return false;
  }
}
