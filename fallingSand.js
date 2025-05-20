//function that creates a 2d array given # of columns and rows and fills it with 0s
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++){
        arr[i] = new Array(rows);
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function mouseDragged() {
    let col = constrain(floor(mouseX / w), 0, cols-1);
    let row = floor (mouseY / w);
    grid [col][row] = currentElement;
}

function keyTyped() {
    if (keyCode === 49) { // 1, non-numpad
        currentElement = 1; //sand
    }
    if (keyCode === 50) { // 2, non-numpad
        currentElement = 2; //water
    }
    if (keyCode === 48) { //0, non-numpad
        currentElement = 0;
    }
}

let grid;
let w = 10
let cols, rows;
let currentElement = 1;

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('game');
    frameRate(60);
    
    cols = width / w;
    rows = height / w;
    grid = make2DArray(cols, rows);
    
    for (let i = 0; i < cols; i++){
        grid[i][10] = 1;
        grid[i][11] = 1;
        grid[i][12] = 1;
    }
}

function draw() {
    background(0);
    noStroke();
    //Draw a grid of squares based on the value of each element in the 2d grid array
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            //stroke(255);
            let currentParticle = grid[i][j];
            if (currentParticle == 1) {
                fill(255, 204, 0);
                let x = i * w;
                let y = j * w;
                square (x, y, w);
            } else if (currentParticle == 2) {
                fill(0, 20, 225);
                let x = i * w;
                let y = j * w;
                square (x, y, w);
            }
        }
    }
    
    //Calculate the next state of the grid
    let nextGrid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            //Check the cells below the given cell
            let below = grid [i][j+1];
            let belowL, belowR, left, right;
            //If a given particle is made of sand
            if (state === 1) {
                //Checks that the particle's X position is greater than the left side of the screen so we don't get an index out of bounds error
                if (i > 0) {
                    belowL = grid[i-1][j+1];
                }
                //Checks that the particle's X position is less than the right side of the screen so we don't get an index out of bounds error
                if (i < cols - 1) {
                    belowR = grid[i+1][j+1];
                }
                if (below === 0) {
                    if (nextGrid[i][j+1] === 0) {
                        nextGrid[i][j+1] = 1;
                    }
                } else if (below === 2) {
                    nextGrid[i][j+1] = 1;
                    nextGrid[i][j] = 2;
                    grid[i][j+1] = 1;
                    grid[i][j] = 2;
                } else if (belowL === 0) {
                    if (nextGrid [i-1][j] === 0) {
                        nextGrid [i-1][j] = 1;
                    }
                } else if (belowR === 0) {
                    if (nextGrid [i+1][j] === 0) {
                        nextGrid [i+1][j] = 1;
                    }
                } else {
                    nextGrid[i][j] = 1;
                }
            }
            //If a given particle is made of water
            else if (state === 2) {
                //Returns 1 or -1
                let dir = Math.sign(random(1) - 0.5);
                if (i + dir >= 0 && i + dir <= cols - 1) {
                    left = grid[i+dir][j];
                }
                if (i - dir >= 0 && i - dir <= cols - 1) {
                    right = grid[i-dir][j];
                }
                if (below === 0) {
                    if (nextGrid[i][j+1] === 0) {
                        nextGrid[i][j+1] = 2;
                    } else {
                        nextGrid[i][j] = 2;
                    }
                } else if (left === 0) {
                    if (nextGrid [i+dir][j] === 0) {
                        nextGrid [i+dir][j] = 2;
                    } else {
                        nextGrid[i][j] = 2;
                    }
                    
                } else if (right === 0) {
                    if (nextGrid [i-dir][j] === 0) {
                        nextGrid [i-dir][j] = 2;
                    } else {
                        nextGrid[i][j] = 2;
                    }
                } else {
                    nextGrid[i][j] = 2;
                }
            }
            
        }
    }
    grid = nextGrid;
}