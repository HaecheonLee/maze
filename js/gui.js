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
}

function visualize_grid(grid) {
  const SZ = grid.length;

  const table = document.createElement("table");
  const borderThickSolid = "thick solid #000000";
  const borderThinDotted = "thin dotted #000000";

  // table setup
  table.id = "table_maze";
  table.style.borderSpacing = "0";
  table.style.borderCollapse = "collapse";
  table.style.padding = "1px";

  for(let x = 0; x < grid.length; x++) {
    const row = table.insertRow(x);

    for(let y = 0; y < grid[x].length; y++) {
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

      cell.id = `cell${x}${y}`;
      cell.style.padding = "0.5em 0.25em";
      if(!cell.style.borderTop) cell.style.borderTop = borderThinDotted;
      if(!cell.style.borderBottom) cell.style.borderBottom = borderThinDotted;
      if(!cell.style.borderRight) cell.style.borderRight = borderThinDotted;
      if(!cell.style.borderLeft) cell.style.borderLeft = borderThinDotted;
    }
  }

  // build border top and left of the grid
  for(let i = 0; i < grid.length; i++) {
    table.rows[0].cells[i].style.borderTop =
      table.rows[i].cells[0].style.borderLeft =
        borderThickSolid;
  }

  // (0,0) and (N - 1, N - 1) open border
  table.rows[0].cells[0].style.borderTop =
    table.rows[SZ - 1].cells[SZ - 1].style.borderBottom = "";

  const app = document.getElementById("app");
  app.appendChild(table);
}

function smooth_scroll_to_title() {
  document.getElementsByClassName("title")[0].scrollIntoView();
}
