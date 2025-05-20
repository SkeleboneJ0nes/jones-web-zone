//Tiles: SEA, COAST, GRASS
const EMPTY = 0;
const OCEAN = 1;
const COAST = 2;
const GRASS = 3;

const EMPTYCOLOR = [0, 0, 0, 0];
const OCEANCOLOR = [51, 156, 255, 255];
const COASTCOLOR = [252, 245, 182, 255];
const GRASSCOLOR = [20, 184, 91, 255];

const TILETYPES = [EMPTY, OCEAN, COAST, GRASS];
const TILECOLORS = [EMPTYCOLOR, OCEANCOLOR, COASTCOLOR, GRASSCOLOR];

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const INPUTWIDTH = 7;
const INPUTHEIGHT = 7;

const OUTPUTWIDTH = 50;
const OUTPUTHEIGHT = 50;

const SCALE = 10;

let g;

//for demo
let running, tilesPlaced, simSpeed;

let testArray = [
    OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN,
    OCEAN, OCEAN, COAST, COAST, COAST, OCEAN, OCEAN,
    OCEAN, COAST, COAST, GRASS, COAST, COAST, OCEAN,
    OCEAN, COAST, GRASS, GRASS, GRASS, COAST, OCEAN,
    OCEAN, COAST, COAST, GRASS, COAST, COAST, OCEAN,
    OCEAN, OCEAN, COAST, COAST, COAST, OCEAN, OCEAN,
    OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN
    ];

let rules = [];
let weights = [];
let grid = [];
let entropy = [];

//Given an array of integers that represent tile types, automatically generate a list of valid rules
function createRules (sample, rules) {
    //Check tiles within input array "sample"
    for (let i = 0; i < sample.length-1; i++) {
        //if it's not on the right side of the screen, check the tile's right neighbor
        if (i%INPUTWIDTH < INPUTWIDTH-1) {
            let newRule = [sample[i+1], sample[i], EAST];
            let newRuleReverse = [sample[i], sample[i+1], WEST];
            
            //Check if rules array already contains given rule. If not, add rule.
            let contains = false;
            for (let j = 0; j < rules.length; j++) {
                if (compareRule(newRule, rules[j])) {
                    contains = true;
                }
            }
            if (!contains) {
                rules.push(newRule);
                rules.push(newRuleReverse);
            }
        }
        //if it's not on the bottom of the screen, check the tile's bottom neighbor
        if (i < sample.length-1-INPUTHEIGHT) {
            let newRule = [sample[i+INPUTHEIGHT], sample[i], SOUTH];
            let newRuleReverse = [sample[i], sample[i+INPUTHEIGHT], NORTH];
            
            //Check if rules array already contains given rule. If not, add rule.
            let contains = false;
            for (let j = 0; j < rules.length; j++) {
                if (compareRule(newRule, rules[j])) {
                    contains = true;
                }
            }
            if (!contains) {
                rules.push(newRule);
                rules.push(newRuleReverse);
            }
        }
    }
    //Every tile except empty can be placed next to an empty spot
    for (let i = 1; i < TILETYPES.length; i++) {
        rules.push ([TILETYPES[i], 0, NORTH]);
        rules.push ([TILETYPES[i], 0, EAST]);
        rules.push ([TILETYPES[i], 0, SOUTH]);
        rules.push ([TILETYPES[i], 0, WEST]);
    }
}

function compareRule (a, b) {
    if (a[0] === b[0]) {
        if (a[1] === b[1]) {
            if (a[2] === b[2]) {
                return true;
            }
        }
    }
    return false;
}

function getValidTiles (element, direction) {
    let validTiles = [];
    for (let i = 0; i < rules.length; i++) {
        if (rules[i][1] === element && rules[i][2] === direction)
        {
            const tempTile = rules[i][0];
            if (!validTiles.includes(tempTile)) {
                validTiles.push(tempTile);
            }
        }
    }
    return validTiles;
}

function initializeArray (arr, width, height, startingValue) {
    for (let i = 0; i < (width * height); i++) {
        arr.push(startingValue);
    }
}

function checkEntropy(index) {
    let neighborValidTiles = [];
    let tilesToAdd = [];
    let myValidTiles = [];
    let directionsChecked = 0;
    //If index is not on the top side of the screen, check the above neighbor and add valid tiles to array
    if (index-OUTPUTWIDTH >= 0) {
        directionsChecked++;
        tilesToAdd = getValidTiles (grid[index-OUTPUTWIDTH], SOUTH);
        neighborValidTiles = neighborValidTiles.concat(tilesToAdd);
        //console.log("Checked North");
    }
    //If index is not on the right side of the screen, check the right neighbor and add valid tiles to array
    if (index%OUTPUTWIDTH != OUTPUTWIDTH-1) {
        directionsChecked++;
        tilesToAdd = getValidTiles (grid[index + 1], WEST);
        neighborValidTiles = neighborValidTiles.concat(tilesToAdd);
        //console.log("Checked East");
    }
    //If index is not on the bottom side of the screen, check the below neighbor and add valid tiles to array
    if (index < (OUTPUTWIDTH * OUTPUTHEIGHT) - OUTPUTWIDTH) {
        directionsChecked++;
        tilesToAdd = getValidTiles (grid[index+OUTPUTWIDTH], NORTH);
        neighborValidTiles = neighborValidTiles.concat(tilesToAdd);
        //console.log("Checked South");
    }
    //If index is not on the left side of the grid, check the left neighbor and add valid tiles to array
    if (index%OUTPUTWIDTH != 0) {
        directionsChecked++;
        tilesToAdd = getValidTiles (grid[index-1], EAST);
        neighborValidTiles = neighborValidTiles.concat(tilesToAdd);
        //console.log("Checked West");
    }
     
    //Check the frequency of each tile type in the validTiles list. If the number is equal to the number of tiletypes we have, then that tile can be placed there.
    for (let i = 1; i < TILETYPES.length; i++) {
        if (checkFrequency(neighborValidTiles, TILETYPES[i]) === directionsChecked) {
            myValidTiles.push(TILETYPES[i]);
        }
    }
    return myValidTiles;
}

//Check how many times a value appears in an array
function checkFrequency (arr, value) {
    let occurences = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            occurences ++;
        }
    }
    return occurences;
}

//Given array of entropy values, generate a list of tile indices that share the lowest value and return a random one
function pickIndexWithLowestValue(arr) {
    //Start lowestValue variable at the highest number it could possibly be.
    let lowestValue = TILETYPES.length-1;
    let lowValTiles = [];
    for (let i = 0; i < arr.length; i++) {
        //Only check a square if a tile has not already been placed there
        if (grid[i] == 0) {
            //If a value is lower than the lowest seen so far, set new low value and clear lowValTiles list
            if (arr[i] < lowestValue) {
                lowestValue = arr[i];
                lowValTiles = [i];
            //else if the value at current index is equal to lowest value, add it to the lowValTiles list
            } else if (arr[i] === lowestValue) {
                lowValTiles.push(i);
            }
            //Otherwise skip
        }
    }
    //Return a random value from the lowValTiles array
    return lowValTiles[randomInteger(0, lowValTiles.length-1)];
}

//Place an index at a given position
function placeTile(arr, index) {
    let validTiles = checkEntropy(index);
    //TODO if no valid tiles, return and retry map gen OR undo steps until valid tiles exist
    let chosenTile = validTiles[randomInteger(0, validTiles.length-1)];
    //console.log("Chosen tile: " + chosenTile);
    let neighbors = neighborIndices(index, OUTPUTWIDTH, OUTPUTHEIGHT);
    grid[index] = chosenTile;
    //Update entropy values of neighbors to reflect the new placement
    for (let i = 0; i < neighbors.length; i++) {
        let neighborIndex = neighbors[i];
        entropy[neighborIndex] = checkEntropy(neighborIndex).length;
    }
}

//Returns a list of adjacent indices to a given index in a 1D array, given a width and height that the array will be displayed at
function neighborIndices(index, width, height) {
    let neighboringTiles = [];
    //If tile isn't on top row, add index above
    if (index >= width) {
        neighboringTiles.push(index-width);
    }
    if (index%width != width-1) {
        neighboringTiles.push(index+1);
    }
    if (index < (width * height) - width) {
        neighboringTiles.push(index+width);
    }
    if (index%width != 0) {
        neighboringTiles.push(index-1);
    }
    return neighboringTiles;
}

//Guess
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printArrayToGraphics (graphics, arr) {
    graphics.loadPixels();
    for (let i = 0; i < arr.length; i++) {
        const tileType = arr[i];
        let tileColor = [];
        if (tileType == null) {
            tileColor = [255, 0, 0, 255];
            //console.log("null!");
        } else {
            tileColor = TILECOLORS[tileType];
        }
        for (let j = 0; j < 4; j++) {
            graphics.pixels[4*i + j] = tileColor[j];
        }
    }
    graphics.updatePixels();
}

function demoSetup () {
    createRules(testArray, rules);
    grid = [];
    entropy = [];
    initializeArray(entropy, OUTPUTWIDTH, OUTPUTHEIGHT, TILETYPES.length-1);
    initializeArray(grid, OUTPUTWIDTH, OUTPUTHEIGHT, EMPTY);
    const randIndex = randomInteger (0, OUTPUTWIDTH*OUTPUTHEIGHT-1);
    placeTile(grid, randIndex);
    tilesPlaced=1;
    running = false;
    simSpeed = 1;
}
function advanceDemoFrame() {
    //console.log("trying!");
    if (tilesPlaced < width*height) {
        let chosenIndex = pickIndexWithLowestValue(entropy);
        placeTile(grid, chosenIndex);
        tilesPlaced++;
    }
    else {
        running = false;
    }
}


function setup () {
    const canvas = createCanvas(OUTPUTWIDTH * SCALE, OUTPUTHEIGHT * SCALE);
    canvas.parent('game');
    g = createGraphics(OUTPUTWIDTH, OUTPUTHEIGHT);
    pixelDensity(1);
    demoSetup();
    running = true;
}

function draw() {
    background(0);
    printArrayToGraphics(g, grid, 1);
    scale(SCALE);
    image(g,0, 0);
    if (running) {
        for (let i = 0; i < simSpeed; i++) {
            advanceDemoFrame();
        }
    }
}

function keyPressed() {
    if (keyCode === 78) {
        for (let i = 0; i < simSpeed; i++) {
            advanceDemoFrame();
        }
    }
    if (keyCode === 80) {
        running = !running;
    }
    if (keyCode === 107) {
        simSpeed++;
    }
    if (keyCode === 109) {
        if (simSpeed > 1) {
            simSpeed++;
        }
    }
    if (keyCode === 13) {
        demoSetup();
        running=true;
    }
}