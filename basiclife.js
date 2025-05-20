function makeEmpty2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++){
        arr[i] = new Array(rows);
    }
    return arr;
}
function countNeighbors(arr, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++){
        for (let j = -1; j < 2; j++){
            
            //enable wraparound
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            
            sum += arr[col][row];
        }
    }
    sum -= arr[x][y];
    return sum;
}

let grid;
let cols;
let rows;
let resolution = 6;

function setup() {
    let canvas = createCanvas(450, 300);
    canvas.parent('game');
    frameRate(15);
    
    cols = width / resolution;
    rows = height / resolution;
    
    grid = makeEmpty2DArray(cols, rows);
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            grid[i][j] = floor(random(2));
        }
    }
}

function draw() {
    background(0);
    
    let next = makeEmpty2DArray(cols, rows);
    
    //Compute next based on grid
    
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            let state = grid[i][j]; //Current value of cell
            
            //Compute live neighbors
            let sum = 0;
            let neighbors = countNeighbors(grid, i, j);
            //Rules
            if (state == 0 && neighbors == 3){ //if dead cell and 3 neighbors
                next[i][j] = 1;
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) { //if alive but under/over crowded
                next[i][j] = 0;
            } else { //if alive and exactly 3 neighbors
                next[i][j] = state;
            }
        }
    }
    
    
    grid = next;
    
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            let x = i * resolution;
            let y = j * resolution;
            if (grid [i][j] == 1) {
                
                fill(255);
                rect(x, y, resolution, resolution);
            }
            
        }
    }
}