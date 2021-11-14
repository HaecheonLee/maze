// support modern browsers and old browsers such as IE9
function ready(fn) {
  if(document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  smooth_scroll_to_title();
  init();
});

function init() {
  const grid = get_maze_grid();
  visualize_grid(grid);
  // dfs(0, 0);
  bfs(0, 0);
}

function smooth_scroll_to_title() {
  document.getElementsByClassName("title")[0].scrollIntoView();
}

function visualize_grid(grid) {
  const N = grid.length, M = grid[0].length;

  const table = document.createElement("table");
  set_table_style(table);

  for(let x = 0; x < N; x++) {
    const row = table.insertRow(x);
    set_row_style(row);

    for(let y = 0; y < M; y++) {
      const cell = row.insertCell(y);
      let wallState = 0;

      if(!(grid[x][y] & DIR_NUM.S)) {
        wallState |= DIR_NUM.S;
        cell.style.borderBottom = borderImpassable;
      }

      if(grid[x][y] & DIR_NUM.E) {
        if(!((grid[x][y] | grid[x][y + 1]) & DIR_NUM.S)) {
          wallState |= DIR_NUM.S;
          cell.style.borderBottom = borderImpassable;
        }
      } else {
        wallState |= DIR_NUM.E;
        cell.style.borderRight = borderImpassable;
      }

      // update grid's value based on wall's border
      // grid[x][y] = update_cell_value(wallState);

      cell.x = x;
      cell.y = y;
      cell.borderThinDotted = borderPassable;
      cell.wallState = wallState;
      cell.visited = false;
      cell.distance = 0;
      set_cell_style(cell);
    }
  }

  // build border top and left of the grid
  build_outer_wall(table, N, M);

  // (0,0) and (N - 1, N - 1) are entrance and exit
  table.rows[0].cells[0].style.borderTop =
    table.rows[N - 1].cells[M - 1].style.borderBottom = "";

  const app = document.getElementById("app");
  app.appendChild(table);
}

function build_outer_wall(table, N, M) {
  // borderLeft
  for(let i = 0; i < N; i++) {
    table.rows[i].cells[0].style.borderLeft = borderImpassable;
  }

  // borderTop
  for(let j = 0; j < M; j++) {
    table.rows[0].cells[j].style.borderTop = borderImpassable;
  }
}

function set_table_style(table) {
  table.id = "table_maze";
  table.style.borderSpacing = "0";
  table.style.borderCollapse = "collapse";
}

function set_row_style(row) {
  row.style.position = "relative";
}

function set_cell_style(cell) {
  cell.id = `cell${cell.x}_${cell.y}`;
  cell.style.padding = "0.25em 0.25em";
  if(!cell.style.borderTop) cell.style.borderTop = cell.borderThinDotted;
  if(!cell.style.borderBottom) cell.style.borderBottom = cell.borderThinDotted;
  if(!cell.style.borderRight) cell.style.borderRight = cell.borderThinDotted;
  if(!cell.style.borderLeft) cell.style.borderLeft = cell.borderThinDotted;
}

function update_cell_value(state) {
  const obj = {wallState: state, visited: false, distance: -1};
  return obj;
}

async function dfs(x, y) {
  await sleep(travelSpeed);

  const curCell = document.getElementById(`cell${x}_${y}`);
  for(const idx in DIRS) {
    const direction = DIRS[idx];
    const [nx, ny] = [x + DX[direction], y + DY[direction]];

    const nxtCell = document.getElementById(`cell${nx}_${ny}`);
    if(is_cell_not_visitied(nxtCell)) {
      if(!is_wall_built(curCell, DIR_NUM[direction]) && ! is_wall_built(nxtCell, DIR_NUM[OPPOSITE[direction]])) {
        update_cell_visited(curCell);
        nxtCell.visited = true;
        await dfs(nx, ny);
      }
    }
  }
}

function bfs(startX, startY, grid) {
  /* calculates distance from (0,0) */

  const q = new Queue();
  q.push([startX, startY]);

  while(!q.empty()) {
    const [x, y] = q.front();
    const curCell = document.getElementById(`cell${x}_${y}`);
    q.pop();

    for(const idx in DIRS) {
      const direction = DIRS[idx];
      const [nx, ny] = [x + DX[direction], y + DY[direction]];

      const nxtCell = document.getElementById(`cell${nx}_${ny}`);
      if(is_cell_not_visitied(nxtCell)) {
        if(!is_wall_built(curCell, DIR_NUM[direction]) && ! is_wall_built(nxtCell, DIR_NUM[OPPOSITE[direction]])) {
          // update_cell_visited(nxtCell);
          nxtCell.visited = true;
          nxtCell.distance = curCell.distance + 1;
          q.push([nx, ny]);
        }
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function update_cell_visited(curCell) {
  const span = document.createElement('span');
  span.classList.add('pulsing-cell');

  curCell.classList.add('visited');
  curCell.appendChild(span);
}

function is_cell_not_visitied(visitingCell) {
  return visitingCell && !visitingCell.visited;
}

function is_wall_built(visitingCell, direction) {
  return visitingCell.wallState & direction;
}
