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
  dfs(0, 0);
}

function smooth_scroll_to_title() {
  document.getElementsByClassName("title")[0].scrollIntoView();
}

function visualize_grid(grid) {
  const N = grid.length, M = grid[0].length;

  const table = document.createElement("table");
  const borderThickSolid = "thick solid #000000";
  const borderThinDotted = "thin dotted #000000";
  set_table_style(table);

  for(let x = 0; x < N; x++) {
    const row = table.insertRow(x);
    set_row_style(row);

    for(let y = 0; y < M; y++) {
      const cell = row.insertCell(y);

      if(!(grid[x][y] & DIR_NUM.S)) {
        cell.style.borderBottom = borderThickSolid;
      }

      if(grid[x][y] & DIR_NUM.E) {
        if(!((grid[x][y] | grid[x][y + 1]) & DIR_NUM.S)) {
          cell.style.borderBottom = borderThickSolid;
        }
      } else {
        cell.style.borderRight = borderThickSolid;
      }

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
  table.style.padding = "1px";
}

function set_row_style(row) {
  row.style.position = "relative";
}

function set_cell_style(cell) {
  cell.id = `cell${cell.x}_${cell.y}`;
  cell.style.padding = "0.5em 0.25em";
  if(!cell.style.borderTop) cell.style.borderTop = cell.borderThinDotted;
  if(!cell.style.borderBottom) cell.style.borderBottom = cell.borderThinDotted;
  if(!cell.style.borderRight) cell.style.borderRight = cell.borderThinDotted;
  if(!cell.style.borderLeft) cell.style.borderLeft = cell.borderThinDotted;
}

async function dfs(x, y) {
  await sleep(10);

  const curCell = document.getElementById(`cell${x}_${y}`);
  curCell.classList.add('visited');

  directions.forEach((direction) => {
    [nx, ny] = [x + DX[direction], y + DY[direction]];

    const nxtCell = document.getElementById(`cell${nx}_${ny}`);
    if(nxtCell && !nxtCell.classList.contains('visited')) {
      if(!is_wall_built(curCell, nxtCell, direction)) {
        dfs(nx, ny);
      }
    }
  });
}

function is_wall_built(now, nxt, dir) {
  switch(dir) {
    case 'E':
      if(is_border_thick(now.style.borderRight, nxt.style.borderLeft)) return true;
      break;
    case 'W':
      if(is_border_thick(now.style.borderLeft, nxt.style.borderRight)) return true;
      break;
    case 'N':
      if(is_border_thick(now.style.borderTop, nxt.style.borderBottom)) return true;
      break;
    case 'S':
      if(is_border_thick(now.style.borderBottom, nxt.style.borderTop)) return true;
      break;
    default:
  }

  return false;
}

function is_border_thick(border, border2) {
  return border.includes("thick") || border2.includes("thick");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
