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
}

function visualize_grid(grid) {
  const table = document.createElement("table");
  const borderStyle = "thick solid #000000";

  // table setup
  table.id = "table_maze";
  table.style.borderSpacing = "0";
  table.style.borderCollapse = "collapse";
  table.style.border = borderStyle;
  table.style.padding = "1px";

  // rows
  for(let x = 0; x < grid.length; x++) {
    const row = table.insertRow(x);

    for(let y = 0; y < grid[x].length; y++) {
      const cell = row.insertCell(y);

      if(!(grid[x][y] & DIR_NUM.S)) {
        cell.style.borderBottom = borderStyle;
      }

      if(grid[x][y] & DIR_NUM.E) {
        if(!((grid[x][y] | grid[x][y + 1]) & DIR_NUM.S)) {
          cell.style.borderBottom = borderStyle;
        }
      } else {
        cell.style.borderRight = borderStyle;
      }

      cell.style.padding = "0.85em";
      cell.innerHTML = `(${x},${y})`;
    }
  }

  const app = document.getElementById("app");
  app.appendChild(table);
}

function smooth_scroll_to_title() {
  document.getElementsByClassName("title")[0].scrollIntoView();
}
