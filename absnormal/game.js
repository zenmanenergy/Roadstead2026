//created by Gort the

/*
An Absnormal Adventure - Week 3
Sprite sheet animation + multi room transitions
*/
//Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Game State
let gameState = "playing";  //"title" or "playing"

//Image Assests
const titleScreen = new Image();
titleScreen.src = "assets/backgrounds/title_screen.png";

//track which room (background) is active
let currentRoom = 'lab';

const background = {
    lab: new Image(),
    city: new Image(),
};
//Load Backgrounds
background.lab.src = "assets/backgrounds/room_lab.png";
background.city.src = "assets/backgrounds/room_city.png";

//Load Character Sprites
const absWalk = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};
absSprites.up.src = "assets/characters/abs_walk_up.gif";
absSprites.down.src = "assets/characters/abs_walk_down.gif";
absSprites.left.src = "assets/characters/abs_walk_left.gif";
absSprites.right.src = "assets/characters/abs_walk_right.gif";

let absDirection = "down";
let absX = 368;
let absY = 268;

//movement speed (pixels per frame)
let speed = 3000;
//track keys for smooth movement
let keys = {};

//animation constants
const frameWidth = 64;  //width of one frame in sprite sheet
const frameHeight = 64; //height of one frame
const framePerAnimation = 4; //number of frames in each direction 

//animation counters 
let frameIndex = 0;
let frameDelay = 8;
let frameCount = 0; 

//Event Listener
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

//gameLoop
requestAnimationFrame(update);
function update() {
    movePlayer();
    changeRooms();
    drawGame();
    requestAnimationFrame(update);
}

//Draw Title Screen
titleScreen.onload = () => drawTitle();

function drawTitle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(titleScreen, 0, 0, canvas.width, canvas.height);
}

//handle click
function handleClick(event) {
    if (gameState === "title") {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        if (mouseX >= 300 && mouseX <= 500 && mouseY >= 260 && mouseY <= 340) {
            gameState = "playing";
            requestAnimationFrame(update);
        }
    }
}

function update() {
    if (gameState === "playing") {
        movePlayer();
        drawGame();
        requestAnimationFrame(update);
    }
}

//Start the Game

function movePlayer() {
    if (keys["arrowup"] || keys["w"]) {
        absY -= speed;
        absDirection = "up";
    }
    if (keys["arrowdown"] || keys["s"]) {
        absY += speed;
        absDirection = "down";
    }
    if (keys["arrowleft"] || keys["a"]) {
        absX -= speed;
        absDirection = "left";
    }
    if (keys["arrowright"] || keys["d"]) {
        absX += speed;
        absDirection = "right";
    }

    if (absX < 0) absX = 0;
    if (absY < 0) absY = 0;
    if (absX > canvas.width - 64) absX = canvas.width - 64;
    if (absY > canvas.height - 64) absY = canvas.height - 64;    
} 
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background[currentRoom], 0, 0, canvas.width, canvas.height);
    drawAbsNormal();
}

function drawAbsNormal() {
    //select correct abssprite
    const sprite = absWalk[absDirection];
    //calculate sourse x
    const sx = frameWidth * frameHeight;
    //drawing one sprite from the sprite sheet onto the canvas
    ctx.drawImage(sprite, sx, 0, frameWidth, frameHeight, absX, absY, frameWidth, frameHeight);
}