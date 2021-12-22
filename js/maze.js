function get_maze_grid() {
  // the size of grid (N, M): defined in maze_defs.js
  // const N = Math.floor(Math.random() * MAX_N) + MIN_N;
  // const M = Math.floor(Math.random() * MAX_N) + MIN_N;

  const N = Number(document.getElementById('noRows').value);
  const M = Number(document.getElementById('noCols').value);

  if(!is_valid_input(N, M)) {
    return false;
  }

  const grid = [...Array(N)].map((x) => Array(M).fill(0));

  // random starting point (y, x): [0, N - 1]
  const startingX = Math.floor(Math.random() * N);
  const startingY = Math.floor(Math.random() * M);

  // carve_passages_by_recursion(startingX, startingY, N, M, grid);
  carve_passages_by_stack(startingX, startingY, N, M, grid);

  return grid;
}

function carve_passages_by_recursion(curX, curY, N, M, grid) {
  /* by recursion */

  const directions = [...DIRS];
  shuffle(directions);

  directions.forEach((direction) => {
    const [nxtX, nxtY] = [curX + DX[direction], curY + DY[direction]];

    // check boundary for the next visiting cell
    if(is_out_of_bound(nxtX, nxtY, N, M)) {
      // check if the visiting cell is unvisited
      if(grid[nxtX][nxtY] === 0) {
        grid[curX][curY] |= DIR_NUM[direction];
        grid[nxtX][nxtY] |= DIR_NUM[OPPOSITE[direction]];

        carve_passages_by_recursion(nxtX, nxtY, N, M, grid);
      }
    }
  });
}

function carve_passages_by_stack(startingX, startingY, N, M, grid) {
  /* by stack */

  const visited = [...Array(N)].map(x => Array(M).fill(false));
  const directions = [...DIRS];

  const stack = [];
  stack.push([startingX, startingY]);
  visited[startingX][startingY] = true;

  while(stack.length > 0) {
    const [curX, curY] = stack.pop();
    shuffle(directions);

    // check if the current cell has unvisited neighbors
    for(let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const [nxtX, nxtY] = [curX + DX[direction], curY + DY[direction]];

      // check boundary for the next cell
      if(is_out_of_bound(nxtX, nxtY, N, M)) {
        // check if the next cell is visited
        if(!visited[nxtX][nxtY]) {
          // push the current cell to the stack
          stack.push([curX, curY]);

          // the next cell is set as visited
          visited[nxtX][nxtY] = true;

          // remove the wall between the two cells
          grid[curX][curY] |= DIR_NUM[direction];
          grid[nxtX][nxtY] |= DIR_NUM[OPPOSITE[direction]];

          // push the next cell to the stack
          stack.push([nxtX, nxtY]);
          break;
        }
      }
    }
  }
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

function is_valid_input(N, M) {
  if(!N) {
    alert(`Please enter a number value for row`);
    return false;
  }

  if(!M) {
    alert(`Please enter a number value for column`);
    return false;
  }

  if(N > MAX_N || N < 0) {
    alert(`Rows must be between 0 and ${MAX_N}`);
    return false;
  }

  if(M > MAX_N || M < 0) {
    alert(`Cols must be beteen 0 and ${MAX_N}`);
    return false;
  }

  return true;
}
