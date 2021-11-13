// support modern browsers and old browsers such as IE9
function ready(fn) {
  if(document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  init();
});

function init() {
  const grid = get_maze_grid();
  visualize_grid(grid);
  smooth_scroll_to_title();
  dfs(0, 0, grid);
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
        cell.style.borderBottom = borderThickSolid;
      }

      if(grid[x][y] & DIR_NUM.E) {
        if(!((grid[x][y] | grid[x][y + 1]) & DIR_NUM.S)) {
          wallState |= DIR_NUM.S;
          cell.style.borderBottom = borderThickSolid;
        }
      } else {
        wallState |= DIR_NUM.E;
        cell.style.borderRight = borderThickSolid;
      }

      // update grid's value based on wall's border
      grid[x][y] = update_cell(wallState);

      cell.x = x;
      cell.y = y;
      cell.borderThinDotted = borderThinDotted;
      set_cell_style(cell);
    }
  }

  // build border top and left of the grid
  build_outer_wall(table, N, M, borderThickSolid);

  // (0,0) and (N - 1, N - 1) are entrance and exit
  table.rows[0].cells[0].style.borderTop =
    table.rows[N - 1].cells[M - 1].style.borderBottom = "";

  const app = document.getElementById("app");
  app.appendChild(table);
}

function build_outer_wall(table, N, M, borderStyle) {
  // borderLeft
  for(let i = 0; i < N; i++) {
    table.rows[i].cells[0].style.borderLeft = borderStyle;
  }

  // borderTop
  for(let j = 0; j < M; j++) {
    table.rows[0].cells[j].style.borderTop = borderStyle;
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

async function dfs(x, y, grid) {
  await sleep(travelSpeed);

  const curCell = document.getElementById(`cell${x}_${y}`);
  curCell.classList.add('visited');

  for(const dir in directions) {
    const direction = directions[dir];
    [nx, ny] = [x + DX[direction], y + DY[direction]];

    const nxtCell = document.getElementById(`cell${nx}_${ny}`);
    if(nxtCell && !nxtCell.classList.contains('visited')) {
      if(!(grid[x][y].wallState & DIR_NUM[direction]) && !(grid[nx][ny].wallState & DIR_NUM[OPPOSITE[direction]])) {
        await dfs(nx, ny, grid);
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function update_cell(state) {
  const obj = {wallState: state, visited: false, distance: 0};
  return obj;
}
