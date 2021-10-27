function get_maze_grid() {
  // the size of grid (N, N): [5, 15]
  const N = Math.floor(Math.random() * MAX_N) + MIN_N;
  const grid = [...Array(N)].map((x) => Array(N).fill(0));

  // random starting point (y, x): [0, N - 1]
  const startingX = Math.floor(Math.random() * N);
  const startingY = Math.floor(Math.random() * N);

  carve_passages_from(startingY, startingX, N, grid);

  return grid;
}

function carve_passages_from(curY, curX, N, grid) {
  directions = ['E', 'W', 'N', 'S'];
  shuffle(directions);

  directions.forEach((direction) => {
    [nxtY, nxtX] = [curY + DY[direction], curX + DX[direction]];

    // check boundary for the next sqaure
    if(0 <= nxtY && nxtY < N && 0 <= nxtX && nxtX < N) {
      // never reached grid
      if(grid[nxtY][nxtX] === 0) {
        grid[curY][curX] |= DIR_NUM[direction];
        grid[nxtY][nxtX] |= DIR_NUM[OPPOSITE[direction]];

        carve_passages_from(nxtY, nxtX, N, grid);
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
