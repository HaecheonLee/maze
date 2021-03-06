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
}

function smooth_scroll_to_title() {
  document.getElementsByClassName('title')[0].scrollIntoView();
}

function visualize_grid() {
  game_mode_off();
  reset_log();

  const grid = get_maze_grid();
  set_grid(grid);
}

async function run_async(func) {
  /* running: implemented in setting.js */
  if(!isRunning) {
    isRunning = true;
    await func();
    isRunning = false;
  }
}

function traverse_by_dfs() {
  const asyncFunc = async() => {
    update_all_buttons_disabled(true);
    game_mode_off();
    reset_grid();

    const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
    const tracking = dfs(sx, sy);

    await visualize_tracking_async(tracking);
    update_all_buttons_disabled(false);
  }

  run_async(asyncFunc);
}

function traverse_by_bfs() {
  const asyncFunc = async() => {
    update_all_buttons_disabled(true);
    game_mode_off();
    reset_grid();

    const tracking = bfs();

    await visualize_tracking_async(tracking);
    update_all_buttons_disabled(false);
  }

  run_async(asyncFunc);
}

function escape_by_dfs() {
  const asyncFunc = async() => {
    update_all_buttons_disabled(true);
    game_mode_off();
    reset_grid();

    const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
    const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());
    const tracking = dfs(sx, sy);

    await visualize_tracking_async(tracking, ex, ey);
    update_all_buttons_disabled(false);
  }

  run_async(asyncFunc);
}

function escape_by_bfs() {
  const asyncFunc = async() => {
    update_all_buttons_disabled(true);
    game_mode_off();
    reset_grid();

    const tracking = bfs();
    const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());

    await visualize_tracking_async(tracking, ex, ey);
    update_all_buttons_disabled(false);
  }

  run_async(asyncFunc);
}

function escape_by_shortest_path() {
  const asyncFunc = async() => {
    update_all_buttons_disabled(true);
    game_mode_off();
    reset_grid();

    bfs();

    const [sx, sy] = cell_pos_string_to_number_array(get_starting_cell());
    const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());

    await travel_shortest_path_async(sx, sy, ex, ey);
    update_all_buttons_disabled(false);
  }

  run_async(asyncFunc);
}

function escape_by_a_star_search() {
  const asyncFunc = async() => {
    update_all_buttons_disabled(true);
    game_mode_off();
    reset_grid();

    const tracking = a_star_search();
    const [ex, ey] = cell_pos_string_to_number_array(get_ending_cell());

    await visualize_tracking_async(tracking, ex, ey);
    update_all_buttons_disabled(false);
  }

  run_async(asyncFunc);
}


function toggle_game_mode(btnGameMode) {
  // remove focusing after clicking
  btnGameMode.blur();
  reset_log();

  const asyncFunc = async() => {
    reset_grid();
    currentX = currentY = 0;

    if(!game_mode) {
      game_mode_on();
    } else {
      game_mode_off();
    }
  }

  run_async(asyncFunc);
}

function game_mode_on() {
  if(!game_mode) {
    console.log('-------------------- GAME MODE ON --------------------');

    const curCell = get_cell(currentX, currentY);
    update_cell_visited(curCell, currentCellBg);

    document.onkeydown = game_mode_func;
    //document.addEventListener('keydown', game_mode_func);
  }

  update_game_mode_indicator(true);
  game_mode = true;
}

function game_mode_off() {
  console.log('-------------------- GAME MODE OFF --------------------');
  if(game_mode) {
    document.onkeydown = null;
    // document.removeEventListener('keydown', game_mode_func);
  }

  update_game_mode_indicator(false);
  game_mode = false;
}

function game_mode_func(e) {
  switch(e.keyCode) {
    case 37:
      e.preventDefault(); // disable scrolling
      move('W');
      // console.log('left');
      break;
    case 38:
      e.preventDefault(); // disable scrolling
      move('N');
      // console.log('up');
      break;
    case 39:
      e.preventDefault(); // disable scrolling
      move('E');
      // console.log('right');
      break;
    case 40:
      e.preventDefault(); // disable scrolling
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

  const container = document.getElementById('table_container');

  // remove a table if it already exists
  const builtTable = container.querySelector('table');
  if(builtTable) builtTable.remove();

  container.appendChild(table);

  set_log_size(container.offsetWidth, container.offsetHeight / 2);
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

  for(const direction of directions) {
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

function bfs() {
  const tracking = [];
  const q = new Queue();
  const directions = [...DIRS];
  const startingCell = get_starting_cell();
  const halfCells = get_total_cell() / 2;

  startingCell.dataset.distance = 0;
  startingCell.dataset.visited = true;

  const [startX, startY] = cell_pos_string_to_number_array(startingCell);
  q.push([startX, startY]);

  while(!q.empty()) {
    const [x, y] = q.front();
    const curCell = get_cell(x, y);
    const transparency = Math.min(1, 0.28 + Number(curCell.dataset.distance) / halfCells * 1.25);

    q.pop();
    tracking.push([x, y, `rgba(255, 165, 0, ${transparency})`]);

    /* randomized traversing direction */
    shuffle(directions); // implemented in /js/maze.js

    for(const direction of directions) {
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

function a_star_search() {
  const heap = new Heap();
  const directions = [...DIRS];
  const tracking = [];
  const startingCell = get_starting_cell();
  const endingCell = get_ending_cell();
  const [startX, startY] = cell_pos_string_to_number_array(startingCell);
  const [endX, endY] = cell_pos_string_to_number_array(endingCell);
  const halfCells = get_total_cell() / 2;

  startingCell.dataset.distance = 0;
  startingCell.dataset.visited = true;

  heap.push(new AStarNode(startX, startY, 0, 0));

  while(!heap.empty()) {
    const curNode = heap.top();
    const curCell = get_cell(curNode.x, curNode.y);
    const transparency = Math.min(1, 0.28 + Number(curCell.dataset.distance) / halfCells * 1.25);
    heap.pop();

    tracking.push([curNode.x, curNode.y, `rgba(255, 165, 0, ${transparency})`]);
    shuffle(directions);

    for(const direction of directions) {
      const [nx, ny] = [curNode.x + DX[direction], curNode.y + DY[direction]];
      const nxtCell = get_cell(nx, ny);

      if(is_cell_not_visitied(nxtCell)) {
        if(!is_wall_built(curCell, DIR_NUM[direction]) && !is_wall_built(nxtCell, DIR_NUM[OPPOSITE[direction]])) {
          const distanceFromBase = Number(curCell.dataset.distance) + 1;
          const distanceToDest = Math.sqrt((endX - nx)**2 + (endY - ny)**2);

          nxtCell.dataset.prev = curCell.id;
          nxtCell.dataset.visited = true;
          nxtCell.dataset.distance = distanceFromBase;

          heap.push(new AStarNode(nx, ny, distanceFromBase, distanceToDest, curNode));
        }
      }
    }
  }

  return tracking;
}

async function visualize_tracking_async(tracking, endX = -1, endY = -1) {
  // If endX & endY unset, it will display how it traverses each cell in a grid
  reset_log();
  const startingTime = new Date();
  let numOfVisitedCell = 0;

  for(let i = 0; i < tracking.length; i++) {
    const [x, y, cellColor] = tracking[i];
    const curCell = get_cell(x, y);
    update_cell_visited(curCell, cellColor);

    write_log(`<span class='log_${x}_${y}'><strong>${digit_fixed(x, 2)},${digit_fixed(y, 2)}</strong> reached (${new Date() - startingTime} ms)</span>`);
    add_event_for_log_span(x, y);
    numOfVisitedCell++;

    if(x === endX && y == endY) break;
    await sleep(sleepingTime);
  }

  const endingTime = new Date();
  write_log(`total cells: ${(endX + 1) * (endY + 1)}, visited cells: ${numOfVisitedCell}`);
}

async function travel_shortest_path_async(startX, startY, endX, endY) {
  // shortest path: from [endX, endY] to [startX, startY]
  const path = [];
  let curCell = get_cell(endX, endY);

  while(curCell) {
    path.push(cell_pos_string_to_number_array(curCell));
    curCell = document.getElementById(curCell.dataset.prev);
  }

  reset_log();
  const startingTime = new Date();

  for(let i = path.length - 1; i >= 0; i--) {
    await sleep(sleepingTime * 0.25);

    const [x, y] = path[i];
    const curCell = get_cell(x, y);
    update_cell_visited(curCell);

    write_log(`<span id='log_${x}_${y}'><strong>${digit_fixed(x, 2)},${digit_fixed(y, 2)}</strong> reached (${new Date() - startingTime} ms)</span>`);
    add_event_for_log_span(x, y);
  }

  const endingTime = new Date();
  write_log(`total cells: ${(endX + 1) * (endY + 1)}, visited cells: ${path.length}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function update_cell_visited(curCell, visitedCellBg = 'orange', needPulsing = true) {
  const spanInCell = curCell.querySelector('span');

  if(spanInCell) {
    // a pulsing span already exists
    if(needPulsing) {
      spanInCell.classList.remove('pulsing-cell')
      add_pulsing_span(curCell);
    }
  } else {
    add_pulsing_span(curCell);
    curCell.style.backgroundClip = 'padding-box';   // for firefox
  }

  curCell.style.backgroundColor = visitedCellBg;
}

function add_pulsing_span(curCell) {
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

function update_game_mode_indicator(isOn) {
  const indicator = document.getElementById('game_mode_on_indicator');
  indicator.style.visibility = isOn ? 'visible' : 'hidden';
}

function update_all_buttons_disabled(isDisabled) {
  const buttons = document.querySelectorAll('button');

  for(let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = isDisabled;
  }
}

function reset_log() {
  const log = document.getElementById('log');
  log.innerHTML = "";
}

function write_log(msg) {
  const log = document.getElementById('log');

  const div = document.createElement('div');
  div.classList.add('log-line');
  div.innerHTML = msg;
  log.append(div);

  // set the scroll of the div to the bottom
  log.scrollTop = log.scrollHeight;
}

function set_log_size(width = 0, height = 0) {
  const log = document.getElementById('log');

  log.style.width = Math.max(200, width);
  log.style.height = Math.max(200, height);
}

function digit_fixed(number, length) {
  const str = number.toString();
  return str.padStart(length, '0');
}

function add_event_for_log_span(x, y) {
  const spans = document.querySelectorAll(`.log_${x}_${y}`);

  spans.forEach(span => {
    span.onmouseover = () => {
      const cell = get_cell(x, y);
      cell.classList.add('selected-cell');
    }

    span.onmouseout = () => {
      const cell = get_cell(x, y);
      cell.classList.remove('selected-cell');
    }
  });
}

function has_event(span, eventName) {
  return getEventListeners(span)[eventName]
}
