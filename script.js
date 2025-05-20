let elapsedTimeMs = 0; //ms since start
let testCube, token;
let speed = 1;
let gameState = 0;
let playerImg;
let titleImg;
let score;

function preload()
{
    playerImg = loadImage('/Assets/New Piskel-1.png.png');
    titleImg = loadImage('/Assets/Title.png');
}

function setup()
{
    //Create a canvas 160 pixels wide by 120 pixels tall and scale it up by 4 times
    createCanvas(160, 120, 'pixelated x2');
    canvas.focus();
    
    //Display all sprites at integer coordinates
    allSprites.pixelPerfect = true;
    
    //Attempting to set a target framerate (not working last I checked)
    try
    {
        frameRate(60);
    }
    catch
    {
        console.log('Framerate failed to set!');
    }
    
    
   
    image(titleImg, 0, 0);
    //startGame();
    
}
function draw() //Here it functions as a combo between update and render in unity script
{
    //Clear needs to run every frame to refresh what's showing on the screen. The background command sets our canvas to a default black color.
    clear();
    background(0,0,0);
    
    switch(gameState)
    {
    case 0: //TitleScreen
        image(titleImg, 0, 0);
        break;
    case 1: //Gameplay
        //Increment time elapsed since start and Display debug information
        elapsedTimeMs = elapsedTimeMs + deltaTime;
        displayDebug();
        
        //Gameplay Code Starts Here
        stayInScreen(token);
        if (testCube.overlaps(token))
        {
            score+=1;
            token.x = Math.floor(Math.random() * canvas.w);
            token.y = Math.floor(Math.random() * canvas.h);
        }
    }
    
    //has its own handling for gamestates
    detectInputs();

    
    
    
}

function startGame()
{
    gameState = 1;
    //Create game sprites. Constructor follows the convention (x, y, width, height, collider type)
    testCube = new Sprite(80, 60, 8, 8, 'k');
    testCube.img = playerImg;
    
    token = new Sprite (100, 60, 10);
    token.color = 'yellow';
    //token.collider = 'k';
    token.layer = 0;
    token.x = Math.floor(Math.random() * canvas.w);
    token.y = Math.floor(Math.random() * canvas.h);
    
    //Initialize score
    score = 0;
}

function detectInputs()
{
    switch (gameState)
    {
        case 1:
        if (kb.pressing('right'))
        {
            testCube.vel.x = speed;
        }
        if (kb.pressing('left'))
        {
            testCube.vel.x = -speed;
        }
        if (!kb.pressing('left') && !kb.pressing('right') ||
             kb.pressing('left') && kb.pressing('right'))
        {
            testCube.vel.x = 0;
        }
        if (kb.pressing('up'))
        {
            testCube.vel.y = -speed;
        }
        if (kb.pressing('down'))
        {
            testCube.vel.y = speed;
        }
        if (!kb.pressing('up') && !kb.pressing('down') ||
             kb.pressing('up') && kb.pressing('down'))
        {
            testCube.vel.y = 0;
        }
        stayInScreen(testCube);
        break;
    case 0:
        if (kb.presses(' '))
        {
            startGame();
        }
        break;
    default:
    }
}

function stayInScreen(sprite)
{
    sprite.x = constrain (sprite.x, sprite.width/2, canvas.w - (sprite.width/2));
    sprite.y = constrain (sprite.y, sprite.height/2, canvas.h - (sprite.height/2));
}

function displayDebug()
{
    textAlign(RIGHT, TOP);
    textSize(12);
    fill('white');
    let array = [nf(floor(elapsedTimeMs / 1000)), 's'];
    text(join(array, ' '), canvas.w, 0);
    
    if (gameState === 1)
    {
        textAlign(LEFT, TOP);
        //array = ['Score', nf(score)];
        text('Score: ' + score, 0, 0);
        text.layer = 10;
    }
    
}