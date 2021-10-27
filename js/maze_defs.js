const MIN_N = 5, MAX_N = 10;                                   // MIN_N & MAX_N for RANDOM value
let N = null;                                                 // board size
let grid = null;                                              // array
const DIR_NUM = {'E': 1, 'W': 2, 'N': 4, 'S': 8};
const DX = { 'E': 1, 'W': -1, 'N': 0, 'S': 0 };
const DY = { 'E': 0, 'W': 0, 'N': -1, 'S': 1 };
const OPPOSITE = {'E': 'W', 'W': 'E', 'N': 'S', 'S': 'N'};
