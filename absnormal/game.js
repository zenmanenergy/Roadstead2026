//created by Gort the

/*
The Adventures of Abs Normal - Week 1
Displays title screen -> waits for Start click -> shows main scene
*/
//Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Game State
let gameState = "title";  //"title" or "playing"

//Image Assests
const titleScreen = new Image();
titleScreen.src = "assets/backgrounds/title_screen.png";

const background = new Image();
background.src = "assets/backgrounds/background_start.gif";

const absSprites = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};
absSprites.up.src = "assets/characters/abs_up.gif"
absSprites.down.src = "assets/characters/abs_down.gif"
absSprites.left.src = "assets/characters/abs_left.gif"
absSprites.right.src = "assets/characters/abs_right.gif"

let absDirection = "down";
let absX = 368;
let absY = 268;
let speed = 3;
let keys = {};

//Event Listener
canvas.addEventListener("click", handleClick);
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

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

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(absSprites[absDirection], absX, absY, 64, 64);
}

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