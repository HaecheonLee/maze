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

function smooth_scroll_to_title() {
  document.getElementsByClassName('title')[0].scrollIntoView();
}

function visualize_grid() {
  const grid = get_maze_grid();
  set_grid(grid);
}

async function run(func) {
  /* running: implemented in setting.js */
  if(!running) {
    running = true;
    await func();
    running = false;
  }
}

function traverse_by_dfs() {
  const asyncFunc = async() => {
    reset_grid();
    const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
    const tracking_by_dfs = dfs(sx, sy);

    await visualize_tracking(tracking_by_dfs);
  }

  run(asyncFunc);
}

function traverse_by_bfs() {
  const asyncFunc = async() => {
    reset_grid();
    const [x, y] = cell_pos_string_to_number_array(get_starting_cell());
    const tracking_by_bfs = bfs(x, y);

    await visualize_tracking(tracking_by_bfs);
  }

  run(asyncFunc);
}

function escape_by_dfs() {
  const asyncFunc = async() => {
    reset_grid();
    const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
    const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());
    const tracking_by_dfs = dfs(sx, sy);

    await visualize_tracking(tracking_by_dfs, ex, ey);
  }

  run(asyncFunc);
}

function escape_by_bfs() {
  const asyncFunc = async() => {
    reset_grid();
    const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
    const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());
    const tracking_by_bfs = bfs(sx, sy);

    await visualize_tracking(tracking_by_bfs, ex, ey);
  }

  run(asyncFunc);
}

function escape_by_shortest_path() {
  const asyncFunc = async() => {
    reset_grid();
    const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
    const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());

    bfs(sx, sy);
    await travel_shortest_path(sx, sy, ex, ey);
  }

  run(asyncFunc);
}

function toggle_game_mode() {
  // initial starting point
  reset_grid();
  currentX = currentY = 0;

  if(!game_mode) {
    game_mode_on();
  } else {
    game_mode_off();
  }
}

function game_mode_on() {
  if(!game_mode) {
    console.log('-------------------- GAME MODE ON --------------------');

    const curCell = get_cell(currentX, currentY);
    update_cell_visited(curCell, currentCellBg);

    document.onkeydown = game_mode_func;
    //document.addEventListener('keydown', game_mode_func);
  }
  game_mode = true;
}

function game_mode_off() {
  console.log('-------------------- GAME MODE OFF --------------------');
  if(game_mode) {
    document.onkeydown = null;
    // document.removeEventListener('keydown', game_mode_func);
  }
  game_mode = false;
}

function game_mode_func(e) {
  switch(e.keyCode) {
    case 37:
      move('W');
      // console.log('left');
      break;
    case 38:
      move('N');
      // console.log('up');
      break;
    case 39:
      move('E');
      // console.log('right');
      break;
    case 40:
      move('S');
      // console.log('down');
      break;
  }
}

function move(dir) {
  const [nxtX, nxtY] = [currentX + DX[dir], currentY + DY[dir]];

  const curCell = get_cell(currentX, currentY);
  const nxtCell = get_cell(nxtX, nxtY);
  if(nxtCell) {
    if(!is_wall_built(curCell, DIR_NUM[dir]) && !is_wall_built(nxtCell, DIR_NUM[OPPOSITE[dir]])) {
      update_cell_visited(curCell, 'orange', false);
      update_cell_visited(nxtCell, currentCellBg);

      [currentX, currentY] = [nxtX, nxtY];
    }
  }
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

      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.border = borderPassable;
      cell.dataset.wallState = wallState;
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
  const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
  const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());

  for(let i = sx; i <= ex; i++) {
    for(let j = sy; j <= ey; j++) {
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
  cell.dataset.visited = false;
  cell.dataset.distance = -1;
  cell.dataset.prev = ''; // will be used in bfs for tracking path
  cell.style.backgroundColor = '';
}

function set_cell_style(cell) {
  cell.id = get_cell_id(cell.dataset.x, cell.dataset.y);
  cell.style.padding = '0.25em 0.25em';
  if(!cell.style.borderTop) cell.style.borderTop = cell.dataset.border;
  if(!cell.style.borderBottom) cell.style.borderBottom = cell.dataset.border;
  if(!cell.style.borderRight) cell.style.borderRight = cell.dataset.border;
  if(!cell.style.borderLeft) cell.style.borderLeft = cell.dataset.border;
}

function dfs(x, y) {
  const tracking = [];

  const curCell = get_cell(x, y);
  curCell.dataset.visited = true;
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
  const totalCells = get_total_cell();

  startingCell.dataset.distance = 0;
  startingCell.dataset.visited = true;
  q.push([startX, startY]);

  while(!q.empty()) {
    const [x, y] = q.front();
    const curCell = get_cell(x, y);
    const transparency = Math.min(1, 0.15 + Number(curCell.dataset.distance) / totalCells * 1.25);

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
          nxtCell.dataset.prev = curCell.id;
          nxtCell.dataset.visited = true;
          nxtCell.dataset.distance = Number(curCell.dataset.distance) + 1;
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
    path.push(cell_pos_string_to_number_array(curCell));
    curCell = document.getElementById(curCell.dataset.prev);
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

function update_cell_visited(curCell, visitedCellBg = 'orange', needPulsing = true) {
  const spanInCell = curCell.querySelector('span');

  if(spanInCell) {
    // already pulsing span exists

    if(needPulsing) {
      spanInCell.remove();
      add_pulsing_effect(curCell);
    }

    curCell.style.background = visitedCellBg;
  } else {
    add_pulsing_effect(curCell);

    curCell.style.background = visitedCellBg;
    curCell.style.backgroundClip = 'padding-box';   // for firefox
  }
}

function add_pulsing_effect(curCell) {
  const span = document.createElement('span');
  span.classList.add('pulsing-cell');
  curCell.appendChild(span);
}

function is_cell_not_visitied(visitingCell) {
  return visitingCell && visitingCell.dataset.visited === 'false';
}

function is_wall_built(visitingCell, direction) {
  return Number(visitingCell.dataset.wallState) & direction;
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

function get_total_cell() {
  const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());
  return (ex + 1) * (ey + 1);
}

function cell_pos_string_to_number_array(cell) {
  /* data-* attribute only contains string type, and this is used for grid's cell position(x, y) */
  return [Number(cell.dataset.x), Number(cell.dataset.y)];
}
