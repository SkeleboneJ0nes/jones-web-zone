//Tiles: SEA, COAST, GRASS
const EMPTY = 0;
const OCEAN = 1;
const COAST = 2;
const COASTNW = 3;
const COASTN = 4;
const COASTNE = 5;
const COASTE = 6;
const COASTSE = 7;
const COASTS = 8;
const COASTSW = 9;
const COASTW = 10;
const GRASS = 11;

const EMPTYCOLOR = [0, 0, 0, 0];
const OCEANCOLOR = [51, 156, 255, 255];
const COASTCOLOR = [252, 245, 182, 255];
const GRASSCOLOR = [20, 184, 91, 255];
let bgcolor = [255, 0, 255];

const TILETYPES = [EMPTY, OCEAN, COAST, COASTNW, COASTN, COASTNE, COASTE, COASTSE, COASTS, COASTSW, COASTW, GRASS];
const TILECOLORS = [EMPTYCOLOR, OCEANCOLOR, COASTCOLOR, COASTCOLOR, COASTCOLOR, COASTCOLOR, COASTCOLOR, COASTCOLOR, COASTCOLOR, COASTCOLOR, COASTCOLOR, GRASSCOLOR];

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const INPUTWIDTH = 11;
const INPUTHEIGHT = 11;

const OUTPUTWIDTH = 100;
const OUTPUTHEIGHT = 100;

const SCALE = 3;

let g;
let lastTile = [];
/*
let testArray = [
    OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN,
    OCEAN, OCEAN, COASTNW, COASTN, COASTNE, OCEAN, OCEAN,
    OCEAN, COASTNW, COAST, GRASS, COAST, COASTNE, OCEAN,
    OCEAN, COASTW, GRASS, GRASS, GRASS, COASTE, OCEAN,
    OCEAN, COASTSW, COAST, GRASS, COAST, COASTSE, OCEAN,
    OCEAN, OCEAN, COASTSW, COASTS, COASTSE, OCEAN, OCEAN,
    OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN
    ];*/

/*
let testArray = [
    OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN,
    OCEAN, OCEAN, COAST, COAST, COAST, OCEAN, OCEAN,
    OCEAN, COAST, GRASS, GRASS, GRASS, COAST, OCEAN,
    OCEAN, COAST, GRASS, GRASS, GRASS, COAST, OCEAN,
    OCEAN, COAST, GRASS, GRASS, GRASS, COAST, OCEAN,
    OCEAN, OCEAN, COAST, COAST, COAST, OCEAN, OCEAN,
    OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN
    ];*/
    

let testArray = [
OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, COASTNW, COASTN, COASTNE, OCEAN, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, COASTNW, COASTN, COAST, GRASS, GRASS, COASTNE, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, COASTW, COAST, GRASS, GRASS, GRASS, COAST, COASTNE, OCEAN, 
OCEAN, OCEAN, COASTNW, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, COASTE, OCEAN, 
OCEAN, COASTNW, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, COASTE, OCEAN, 
OCEAN, COASTW, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, COASTE, OCEAN, 
OCEAN, COASTSW, GRASS, GRASS, GRASS, GRASS, GRASS, COAST, COASTS, COASTSW, OCEAN, 
OCEAN, OCEAN, COASTSW, COAST, GRASS, GRASS, COAST, COASTSW, OCEAN, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, COASTSW, COASTS, COASTS, COASTSW, OCEAN, OCEAN, OCEAN, OCEAN,
];
/*
let testArray = [
OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, OCEAN, OCEAN, COAST, COAST, COAST, OCEAN, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, COAST, COAST, GRASS, GRASS, GRASS, COAST, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, COAST, GRASS, GRASS, GRASS, GRASS, GRASS, COAST, OCEAN, 
OCEAN, OCEAN, COAST, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, COAST, OCEAN, 
OCEAN, COAST, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, COAST, OCEAN, 
OCEAN, COAST, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, COAST, OCEAN, 
OCEAN, COAST, GRASS, GRASS, GRASS, GRASS, GRASS, GRASS, COAST, COAST, OCEAN, 
OCEAN, OCEAN, COAST, COAST, GRASS, GRASS, GRASS, COAST, OCEAN, OCEAN, OCEAN, 
OCEAN, OCEAN, OCEAN, COAST, COAST, COAST, COAST, OCEAN, OCEAN, OCEAN, OCEAN,
];*/

let rules = [
    //(DESTINATION_TILE, ORIGIN_TILE, DIRECTIONAL_RELATIONSHIP)
    //DESTINATION_TILE is allowed to exist to the DIRECTIONAL_RELATIONSHIP of ORIGIN_TILE
    ];
let weights = [];
    
let grid = [];
let entropy = [];

//Given an array of integers that represent tile types, automatically generate a list of valid rules
function createRules (sample, rules) {
    //Check tiles within input array "sample"
    for (let i = 0; i < sample.length-1; i++) {
        //if it's not on the right side of the screen, check the tile's right neighbor
        if (i%INPUTWIDTH < INPUTWIDTH-1) {
            let newRule = [sample[i+1], sample[i], EAST, 1];
            let newRuleReverse = [sample[i], sample[i+1], WEST, 1];
            
            
            //Check if rules array already contains given rule. If not, add rule.
            let contains = false;
            for (let j = 0; j < rules.length; j++) {
                if (compareRule(newRule, rules[j]) || compareRule(newRuleReverse, rules[j])) {
                    contains = true;
                    rules[j][3] ++;
                }
            }
            if (!contains) {
                rules.push(newRule);
                rules.push(newRuleReverse);
            }
        }
        //if it's not on the bottom of the screen, check the tile's bottom neighbor
        if (i < sample.length-1-INPUTWIDTH) {
            let newRule = [sample[i+INPUTWIDTH], sample[i], SOUTH, 1];
            let newRuleReverse = [sample[i], sample[i+INPUTWIDTH], NORTH, 1];
            
            //Check if rules array already contains given rule. If not, add rule.
            let contains = false;
            for (let j = 0; j < rules.length; j++) {
                if (compareRule(newRule, rules[j]) || compareRule(newRuleReverse, rules[j])) {
                    contains = true;
                    rules[j][3] ++;
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
        rules.push ([TILETYPES[i], 0, NORTH, 1]);
        rules.push ([TILETYPES[i], 0, EAST, 1]);
        rules.push ([TILETYPES[i], 0, SOUTH, 1]);
        rules.push ([TILETYPES[i], 0, WEST, 1]);
    }
}


//given an array of tiles, return the selection array with any invalid tiles removed.
function genNeighborWeightArray(index) {
    let result = [];
    let tileType;
    //If not on top of screen
    if (index-OUTPUTWIDTH >= 0) {
        //Save North tile's type to variable
        tileType = grid[index-OUTPUTWIDTH];
        //Double check whether it's already been placed - if not, skip
        if (tileType != 0) {
            //Generate list of rule frequencies for the north tile in its southern direction
            const frequencies = getRuleFrequencies(tileType, SOUTH);
            //add those frequencies to our output array
            result = result.concat(frequencies);
        }
    }
    //If not on right of screen
    if (index%OUTPUTWIDTH != OUTPUTWIDTH-1) {
        //Save East tile's type to variable
        tileType = grid[index + 1];
        //Double check whether it's already been placed - if not, skip
        if (tileType != 0) {
            //Generate list of rule frequencies for the East tile in its western direction
            const frequencies = getRuleFrequencies(tileType, WEST);
            //add those frequencies to our output array
            result = result.concat(frequencies);
        }
    }
    //If not on bottom of screen
    if (index < (OUTPUTWIDTH * OUTPUTHEIGHT) - OUTPUTWIDTH) {
        //Save South tile's type to variable
        tileType = grid[index+OUTPUTWIDTH];
        //Double check whether it's already been placed - if not, skip
        if (tileType != 0) {
            //Generate list of rule frequencies for the South tile in its northern direction
            const frequencies = getRuleFrequencies(tileType, NORTH);
            //add those frequencies to our output array
            result = result.concat(frequencies);
        }
    }
    if (index%OUTPUTWIDTH != 0) {
        //Save South tile's type to variable
        tileType = grid[index-1];
        //Double check whether it's already been placed - if not, skip
        if (tileType != 0) {
            //Generate list of rule frequencies for the West tile in its eastern direction
            const frequencies = getRuleFrequencies(tileType, EAST);
            //add those frequencies to our output array
            result = result.concat(frequencies);
        }
    }
    if (result.length === 0) {
        for (let i = 1; i < TILETYPES.length; i++) {
            result.push(TILETYPES[i]);
        }
    }
    return result;
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
//Returns an array of tiles that can be placed next to the given element in the given direction
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
//Similar to the above function but returns a list of valid tiles with repeats indicating frequency of that relationship in the input
function getRuleFrequencies (element, direction) {
    let validTiles = [];
    //Check all rules
    for (let i = 0; i < rules.length; i++) {
        //If the element matches the desired one and the direction matches,
        if (rules[i][1] === element && rules[i][2] === direction)
        {
            //Save the destination element to a variable
            const destTile = rules[i][0];
            //Save the frequency of that placement to a variable
            const frequency = rules[i][3];
            
            //Add that tile to our validTiles array x frequency
            for (let i = 0; i < frequency; i++) {
                validTiles.push(destTile);
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
    }
    //If index is not on the right side of the screen, check the right neighbor and add valid tiles to array
    if (index%OUTPUTWIDTH != OUTPUTWIDTH-1) {
        directionsChecked++;
        tilesToAdd = getValidTiles (grid[index + 1], WEST);
        neighborValidTiles = neighborValidTiles.concat(tilesToAdd);
    }
    //If index is not on the bottom side of the screen, check the below neighbor and add valid tiles to array
    if (index < (OUTPUTWIDTH * OUTPUTHEIGHT) - OUTPUTWIDTH) {
        directionsChecked++;
        tilesToAdd = getValidTiles (grid[index+OUTPUTWIDTH], NORTH);
        neighborValidTiles = neighborValidTiles.concat(tilesToAdd);
    }
    //If index is not on the left side of the grid, check the left neighbor and add valid tiles to array
    if (index%OUTPUTWIDTH != 0) {
        directionsChecked++;
        tilesToAdd = getValidTiles (grid[index-1], EAST);
        neighborValidTiles = neighborValidTiles.concat(tilesToAdd);
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
    //Create an array of valid tiles that can exist at the given index
    let validTiles = checkEntropy(index);
    //Create an array of the weighted tile values for the given location based on its neighbors, irrespective of their mutual compatibility
    let weightedSelections = genNeighborWeightArray(index);
    //Cull the weightedSelections array down based on which tiles are actually valid for that spot and store then in a new culledWeights array
    let culledWeights = [];
    for (let i = 0; i < weightedSelections.length; i++) {
        if (validTiles.includes(weightedSelections[i])) {
            culledWeights.push(weightedSelections[i]);
        }
    }
    //TODO if no valid tiles, return and retry map gen OR undo steps until valid tiles exist
    let chosenTile;
    if (culledWeights.length == 0) {
        //console.log(neighborIndices(index, OUTPUTWIDTH, OUTPUTHEIGHT));
        entropy[index] = 10000000;
        //placeTile (grid, lastTile);
    } else {
        chosenTile = culledWeights[randomInteger(0, culledWeights.length-1)];
        let neighbors = neighborIndices(index, OUTPUTWIDTH, OUTPUTHEIGHT);
        grid[index] = chosenTile;
        //Update entropy values of neighbors to reflect the new placement
        for (let i = 0; i < neighbors.length; i++) {
            let neighborIndex = neighbors[i];
            entropy[neighborIndex] = checkEntropy(neighborIndex).length;
        }
        lastTile = index;
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

function GenerateMap(sampleArr, entropyArr, outputArr, width, height) {
    //Generate list of rules based on given sample
    createRules(sampleArr, rules);
    
    //TODO: automatically generate tiletypes array based on samplearr input instead of assuming it just matches
    
    //Initialize entropy array with its max possible value at every index
    initializeArray(entropyArr, width, height, TILETYPES.length-1);
    //Initialize output grid with an empty value (0) at every index. Represents unplaced tile in certain functions.
    initializeArray(outputArr, width, height, EMPTY);
    
    //Place a random tile to start with
    const randIndex = randomInteger (0, width*height-1);
    placeTile(outputArr, randIndex);
    
    //Place all the other tiles
    for (let i = 0; i < width*height+1000; i++){
        let chosenIndex = pickIndexWithLowestValue(entropyArr);
        placeTile(outputArr, chosenIndex);
    }
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
            tileColor = [255, 0, 255, 255];
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

function setup () {
    const canvas = createCanvas(OUTPUTWIDTH * SCALE, OUTPUTHEIGHT * SCALE);
    canvas.parent('game2');
    g = createGraphics(OUTPUTWIDTH, OUTPUTHEIGHT);
    pixelDensity(1);
    
    //createRules(testArray, rules);
    //initializeArray(entropy, OUTPUTWIDTH, OUTPUTHEIGHT, TILETYPES.length-1);
    //initializeArray(grid, OUTPUTWIDTH, OUTPUTHEIGHT, EMPTY);
    //placeTile(grid, 101);
    //let test = genNeighborWeightArray(101);
    
    GenerateMap(testArray, entropy, grid, OUTPUTWIDTH, OUTPUTHEIGHT);
    //console.log(rules);
}

function draw() {
    background(bgcolor[0], bgcolor[1], bgcolor[2]);
    printArrayToGraphics(g, grid, 1);
    scale(SCALE);
    image(g,0, 0);
}

function keyPressed() {
    if (keyCode === 13) {
        bgcolor[0] = COASTCOLOR[0];
        bgcolor[1] = COASTCOLOR[1];
        bgcolor[2] = COASTCOLOR[2];
    }
}