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
  const [startX, startY] = [0, 0];
  const [endX, endY] = [grid.length - 1, grid[0].length - 1];
  visualize_grid(grid);

  visualize_tracking(dfs(startX, startY), endX, endY);
  // visualize_tracking(bfs(startX, startY));
  // travel_shortest_path(startX, startY, endX, endY);
}

function smooth_scroll_to_title() {
  document.getElementsByClassName('title')[0].scrollIntoView();
}

function visualize_grid(grid) {
  const N = grid.length, M = grid[0].length;

  const table = document.createElement('table');
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

      cell.x = x;
      cell.y = y;
      cell.borderThinDotted = borderPassable;
      cell.wallState = wallState;
      cell.visited = false;
      cell.distance = 0;
      cell.prev = null; // will be used in bfs for tracking path
      set_cell_style(cell);
    }
  }

  // build border top and left of the grid
  build_outer_wall(table, N, M);

  // (0,0) and (N - 1, N - 1) are entrance and exit
  table.rows[0].cells[0].style.borderTop =
    table.rows[N - 1].cells[M - 1].style.borderBottom = '';

  // set starting & ending attribute for each point
  table.rows[0].cells[0].setAttribute('data-starting', true);
  table.rows[N - 1].cells[M - 1].setAttribute('data-ending', true);

  const app = document.getElementById('app');
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
  table.id = 'table_maze';
  table.style.borderSpacing = '0';
  table.style.borderCollapse = 'collapse';
}

function set_row_style(row) {
  row.style.position = 'relative';
}

function set_cell_style(cell) {
  cell.id = get_cell_id(cell.x, cell.y);
  cell.style.padding = '0.25em 0.25em';
  if(!cell.style.borderTop) cell.style.borderTop = cell.borderThinDotted;
  if(!cell.style.borderBottom) cell.style.borderBottom = cell.borderThinDotted;
  if(!cell.style.borderRight) cell.style.borderRight = cell.borderThinDotted;
  if(!cell.style.borderLeft) cell.style.borderLeft = cell.borderThinDotted;
}

function dfs(x, y) {
  const tracking = [];

  const curCell = document.getElementById(get_cell_id(x, y));
  curCell.visited = true;
  tracking.push([x, y, 'rgba(255, 165, 0, 1)']);

  /* randomized traversing direction */
  const directions = [...DIRS];
  shuffle(directions);  // implemented in /js/maze.js

  for(const idx in directions) {
    const direction = directions[idx];
    const [nx, ny] = [x + DX[direction], y + DY[direction]];

    const nxtCell = document.getElementById(get_cell_id(nx, ny));
    if(is_cell_not_visitied(nxtCell)) {
      if(!is_wall_built(curCell, DIR_NUM[direction]) && !is_wall_built(nxtCell, DIR_NUM[OPPOSITE[direction]])) {
        tracking.push(...dfs(nx, ny));
      }
    }
  }

  tracking.push([x, y, 'rgba(255, 165, 0, .5)']);
  return tracking;
}

function bfs(startX, startY) {
  const tracking = [];

  const q = new Queue();
  const directions = [...DIRS];
  const startingCell = document.getElementById(get_cell_id(startX, startY));
  startingCell.visited = true;
  q.push([startX, startY]);

  while(!q.empty()) {
    const [x, y] = q.front();
    const curCell = document.getElementById(get_cell_id(x, y));
    tracking.push([x, y, 'rgba(255, 165, 0, 1)']);
    q.pop();

    /* randomized traversing direction */
    shuffle(directions); // implemented in /js/maze.js

    for(const idx in directions) {
      const direction = directions[idx];
      const [nx, ny] = [x + DX[direction], y + DY[direction]];

      const nxtCell = document.getElementById(get_cell_id(nx, ny));
      if(is_cell_not_visitied(nxtCell)) {
        if(!is_wall_built(curCell, DIR_NUM[direction]) && !is_wall_built(nxtCell, DIR_NUM[OPPOSITE[direction]])) {
          nxtCell.prev = curCell;
          nxtCell.visited = true;
          nxtCell.distance = curCell.distance + 1;
          q.push([nx, ny]);
        }
      }
    }
  }

  return tracking;
}

async function visualize_tracking(tracking, endX = -1, endY = -1) {
  // If endX & endY unset, it will display how it traverses each cell in a grid

  for(let i = 0; i < tracking.length; i++) {
    const [x, y, cellColor] = tracking[i];
    const curCell = document.getElementById(get_cell_id(x, y));
    update_cell_visited(curCell, cellColor);

    if(x === endX && y == endY) break;
    await sleep(travelSpeed);
  }
}

async function travel_shortest_path(startX, startY, endX, endY) {
  // shortest path: from [endX, endY] to [startX, startY]
  const path = [];
  let curCell = document.getElementById(get_cell_id(endX, endY));

  while(curCell) {
    path.push([curCell.x, curCell.y]);
    curCell = curCell.prev;
  }

  for(let i = path.length - 1; i >= 0; i--) {
    await sleep(travelSpeed * 0.25);

    const [x, y] = path[i];
    const curCell = document.getElementById(get_cell_id(x, y));
    update_cell_visited(curCell);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function update_cell_visited(curCell, visitedCellBg = 'orange') {
  const span = document.createElement('span');
  span.classList.add('pulsing-cell');

  curCell.style.backgroundColor = visitedCellBg;
  curCell.appendChild(span);
}

function is_cell_not_visitied(visitingCell) {
  return visitingCell && !visitingCell.visited;
}

function is_wall_built(visitingCell, direction) {
  return visitingCell.wallState & direction;
}

function get_cell_id(x, y) {
  return `cell${x}_${y}`;
}
