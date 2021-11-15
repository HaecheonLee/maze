function get_maze_grid() {
  // the size of grid (N, M): defined in maze_defs.js
  const N = Math.floor(Math.random() * MAX_N) + MIN_N;
  const M = Math.floor(Math.random() * MAX_N) + MIN_N;
  const grid = [...Array(N)].map((x) => Array(M).fill(0));

  // random starting point (y, x): [0, N - 1]
  const startingX = Math.floor(Math.random() * N);
  const startingY = Math.floor(Math.random() * M);

  carve_passages_from(startingX, startingY, N, M, grid);

  return grid;
}

function carve_passages_from(curX, curY, N, M, grid) {
  const directions = ['E', 'W', 'N', 'S'];
  shuffle(directions);

  directions.forEach((direction) => {
    const [nxtX, nxtY] = [curX + DX[direction], curY + DY[direction]];

    // check boundary for the next visiting cell
    if(is_out_of_bound(nxtX, nxtY, N, M)) {
      // check if the visiting cell is unvisited
      if(grid[nxtX][nxtY] === 0) {
        grid[curX][curY] |= DIR_NUM[direction];
        grid[nxtX][nxtY] |= DIR_NUM[OPPOSITE[direction]];

        carve_passages_from(nxtX, nxtY, N, M, grid);
      }
    }
  });
}

function shuffle(array) {
  /* Fisher-Yates shuffle: an unbiased way to shuffle */

  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function is_out_of_bound(x, y, N, M) {
  return 0 <= x && x < N && 0 <= y && y < M;
}
