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
titleScreen.src = "assets/backgrounds/title_screen.gif";

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
titleScreen.onload = () => drawTitleScreen();

function drawTitleScreen() {
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
            gameState = playing";
            requestAnimationFrame(update);
        })
    }
}

//Start the Game
function startGame() {
    gameState = "playing";
    drawGameScene();
}

//Draw Main Scene
function drawGameScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Draw Abs Normal roughly centered
    const absWidth = 64;
    const absHeight = 64;
    const absX = (canvas.width - absWidth) /2;
    const absY = (canvas.height - absHeight) /2;
    
    ctx.drawImage(abs, absX, absY, absWidth, absHeight);
}