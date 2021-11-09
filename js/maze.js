function get_maze_grid() {
  // the size of grid (N, N): [5, 15]
  const N = Math.floor(Math.random() * MAX_N) + MIN_N;
  const grid = [...Array(N)].map((x) => Array(N).fill(0));

  // random starting point (y, x): [0, N - 1]
  const startingX = Math.floor(Math.random() * N);
  const startingY = Math.floor(Math.random() * N);

  carve_passages_from(startingX, startingY, N, grid);

  return grid;
}

function carve_passages_from(curX, curY, N, grid) {
  directions = ['E', 'W', 'N', 'S'];
  shuffle(directions);

  directions.forEach((direction) => {
    [nxtX, nxtY] = [curX + DX[direction], curY + DY[direction]];

    // check boundary for the next visiting cell
    if(is_out_of_bound(nxtX, nxtY, N)) {
      // check if the visiting cell is unvisited
      if(grid[nxtX][nxtY] === 0) {
        grid[curX][curY] |= DIR_NUM[direction];
        grid[nxtX][nxtY] |= DIR_NUM[OPPOSITE[direction]];

        carve_passages_from(nxtX, nxtY, N, grid);
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

function is_out_of_bound(x, y, N) {
  return 0 <= x && x < N && 0 <= y && y < N;
}
