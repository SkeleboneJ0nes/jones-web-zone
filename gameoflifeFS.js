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
            
            if (arr[col][row] > 0) {
                sum += 1;
            }
        }
    }
    if (arr[x][y] > 0){
        sum-=1;
    }
    return sum;
}
function gcd(a,b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) {var temp = a; a = b; b = temp;}
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}
function calcNextState() {
    let next = makeEmpty2DArray(cols, rows);
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            let state = grid[i][j]; //Current value of cell
            
            //Compute live neighbors
            let sum = 0;
            let neighbors = countNeighbors(grid, i, j);
            //Rules
            if (state == 0 && neighbors == 3){ //if dead cell and 3 neighbors
                next[i][j] = 1;
            } else if (state > 0 && (neighbors < 2 || neighbors > 3)) { //if alive but under/over crowded
                next[i][j] = 0;
            } else { //if alive and exactly 3 neighbors
                next[i][j] = state;
            }
            
            if (next[i][j] > 0 && next[i][j] < 255)
            {
                next[i][j] += 1;
            } else if (next[i][j] = 255) {
                next[i][j] = 0;
            }
        }
    }
    return next;
}

let running = false;
let gridLines = false;
let grid;
let savedGrid;
let cols;
let rows;
let targetResolution = 2;
let resolution;

function setup() {
    let winWidth = window.innerWidth;
    winWidth -= winWidth%targetResolution;
    let winHeight = window.innerHeight;
    winHeight -= winHeight%targetResolution;
    resolution = targetResolution;
    let canvas = createCanvas(winWidth, winHeight);
    canvas.parent('game');
    
    cols = width / resolution;
    rows = height / resolution;
    
    grid = makeEmpty2DArray(cols, rows);
    savedGrid = makeEmpty2DArray(cols, rows);
    //Generate random starting array
    /*
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            grid[i][j] = floor(random(2));
        }
    }*/
}

function draw() {
    background(255);
    if (running || !gridLines) {
        noStroke();
    } else {
        stroke('black');
    }
    
    
    if (running) {
        //Compute next based on current grid state
        grid = calcNextState();
    }
    
    colorMode(HSB);
    //Actually draw the new grid
    for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
            let x = i * resolution;
            let y = j * resolution;
            let hue = grid [i][j];
            
            if (hue > 0) {
                fill(hue, 255, 100);
                rect(x, y, resolution, resolution);
            } else if (gridLines){
                fill (0, 0, 255);
                rect(x, y, resolution, resolution);
            }
            
            
        }
    }
}
function mouseClicked() {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        col = floor(mouseX/resolution);
        row = floor(mouseY/resolution);
        grid[col][row] = 1;
    }
}
function mouseDragged() {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        col = floor(mouseX/resolution);
        row = floor(mouseY/resolution);
        grid[col][row] = 1;
    }
}
function keyTyped() {
    if (keyCode === 71) {
        gridLines = !gridLines;
    }
    if (keyCode === 76) { //L
        grid = savedGrid;
    }
    if (keyCode === 80) { //p key press
        running = !running;
    }
    if (keyCode === 78) { // n key press, make new array
        grid = makeEmpty2DArray(cols, rows);
    }
    if (keyCode === 82) { //r key press, gen rand array
        for (let i = 0; i < cols; i++){
            for (let j = 0; j < rows; j++){
                grid[i][j] = floor(random(2));
            }
        }
    }
    if (keyCode === 83) { //S
        savedGrid = grid;
    }
}