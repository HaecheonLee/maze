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
  visualize_grid();

  // visualize_tracking(dfs(startX, startY), endX, endY);
  // visualize_tracking(bfs(startX, startY));
  // travel_shortest_path(startX, startY, endX, endY);
}

function visualize_grid() {
  const grid = get_maze_grid();
  set_grid(grid);
}

async function run(func) {
  if(!running) {
    running = true;
    await func();
    running = false;
  }
}

function traverse_by_dfs() {
  const asyncFunc = async() => {
    reset_grid();
    const startingCell = get_starting_cell();
    const tracking_by_dfs = dfs(startingCell.x, startingCell.y);

    await visualize_tracking(tracking_by_dfs);
  }

  run(asyncFunc);
}

function traverse_by_bfs() {
  const asyncFunc = async() => {
    reset_grid();
    const startingCell = get_starting_cell();
    const tracking_by_bfs = bfs(startingCell.x, startingCell.y);

    await visualize_tracking(tracking_by_bfs);
  }

  run(asyncFunc);
}

function escape_by_dfs() {
  const asyncFunc = async() => {
    reset_grid();
    const startingCell = get_starting_cell();
    const endingCell = get_ending_cell();
    const tracking_by_dfs = dfs(startingCell.x, startingCell.y);

    await visualize_tracking(tracking_by_dfs, endingCell.x, endingCell.y);
  }

  run(asyncFunc);
}

function escape_by_bfs() {
  const asyncFunc = async() => {
    reset_grid();
    const startingCell = get_starting_cell();
    const endingCell = get_ending_cell();
    const tracking_by_bfs = bfs(startingCell.x, startingCell.y);

    await visualize_tracking(tracking_by_bfs, endingCell.x, endingCell.y);
  }

  run(asyncFunc);
}

function escape_by_shortest_path() {
  const asyncFunc = async() => {
    reset_grid();
    const startingCell = get_starting_cell();
    const endingCell = get_ending_cell();

    bfs(startingCell.x, startingCell.y);
    await travel_shortest_path(startingCell.x, startingCell.y, endingCell.x, endingCell.y);
  }

  run(asyncFunc);
}

function smooth_scroll_to_title() {
  document.getElementsByClassName('title')[0].scrollIntoView();
}

function set_grid(grid) {
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
      reset_cell(cell);
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

function reset_grid() {
  const startingCell = get_starting_cell();
  const endingCell = get_ending_cell();

  for(let i = startingCell.x; i <= endingCell.x; i++) {
    for(let j = startingCell.y; j <= endingCell.y; j++) {
      reset_cell(get_cell(i, j));
    }
  }
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

function reset_cell(cell) {
  cell.visited = false;
  cell.distance = -1;
  cell.prev = null; // will be used in bfs for tracking path
  cell.style.backgroundColor = '';
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

  const curCell = get_cell(x, y);
  curCell.visited = true;
  tracking.push([x, y, 'rgba(255, 165, 0, 1)']);

  /* randomized traversing direction */
  const directions = [...DIRS];
  shuffle(directions);  // implemented in /js/maze.js

  for(const idx in directions) {
    const direction = directions[idx];
    const [nx, ny] = [x + DX[direction], y + DY[direction]];

    const nxtCell = get_cell(nx, ny);
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
  const startingCell = get_starting_cell();
  const endingCell = get_ending_cell();
  const totalCells = (endingCell.x + 1) * (endingCell.y + 1);

  startingCell.distance = 0;
  startingCell.visited = true;
  q.push([startX, startY]);

  while(!q.empty()) {
    const [x, y] = q.front();
    const curCell = get_cell(x, y);
    const transparency = Math.min(1, 0.15 + curCell.distance / totalCells * 1.25);

    tracking.push([x, y, `rgba(255, 165, 0, ${transparency})`]);
    q.pop();

    /* randomized traversing direction */
    shuffle(directions); // implemented in /js/maze.js

    for(const idx in directions) {
      const direction = directions[idx];
      const [nx, ny] = [x + DX[direction], y + DY[direction]];

      const nxtCell = get_cell(nx, ny);
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
    const curCell = get_cell(x, y);
    update_cell_visited(curCell, cellColor);

    if(x === endX && y == endY) break;
    await sleep(travelSpeed);
  }
}

async function travel_shortest_path(startX, startY, endX, endY) {
  // shortest path: from [endX, endY] to [startX, startY]
  const path = [];
  let curCell = get_cell(endX, endY);

  while(curCell) {
    path.push([curCell.x, curCell.y]);
    curCell = curCell.prev;
  }

  for(let i = path.length - 1; i >= 0; i--) {
    await sleep(travelSpeed * 0.25);

    const [x, y] = path[i];
    const curCell = get_cell(x, y);
    update_cell_visited(curCell);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function update_cell_visited(curCell, visitedCellBg = 'orange') {
  const span = document.createElement('span');
  span.classList.add('pulsing-cell');

  curCell.style.background = visitedCellBg;
  curCell.style.backgroundClip = 'padding-box';   // for firefox
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

function get_cell(x, y) {
  return document.getElementById(`cell${x}_${y}`);
}

function get_starting_cell() {
  return document.querySelector('[data-starting=true]');
}

function get_ending_cell() {
  return document.querySelector('[data-ending=true]');
}
