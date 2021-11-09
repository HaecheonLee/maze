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

  // remove border-spacing
  table.style.borderSpacing = "0";
  table.style.borderCollapse = "collapse";

  // rows
  for(let i = 0; i < grid.length; i++) {
    const row = table.insertRow(i);

    for(let j = 0; j < grid[i].length; j++) {
      const cell = row.insertCell(j);

      const borderStyle = "thick solid #000000";
      for(const property in DIR_NUM) {
        const wallIndex = DIR_NUM[property];

        if(grid[i][j] & wallIndex) {
          console.log(i , j , grid[i][j] , wallIndex);
          switch(wallIndex) {
            case 1:
              cell.style.borderRight = borderStyle;
              break;
            case 2:
              cell.style.borderLeft = borderStyle;
              break;
            case 4:
              cell.style.borderTop = borderStyle;
              break;
            case 8:
              cell.style.borderBottom = borderStyle;
              break;
            default:
          }
        }
      }

      cell.style.padding = "10px";
      cell.innerHTML = `${i} - ${j}`;
    }
  }

  const app = document.getElementById("app");
  app.appendChild(table);
}
