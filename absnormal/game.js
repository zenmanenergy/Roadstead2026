//created by Gort the Mighty

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
background.src = "assests/backgrounds/title_screen.gif";

const background = new Image();
background.src = "assets/backgrounds/background_start.gif";

const abs = new Image();
abs.src = "assets/characters/abs_placeholder.gif";

//Event Listener
canvas.addEventListener("click", handleClick);

//Draw Title Screen
titleScreen.onload = () => {
    drawTitleScreen();
};

function drawTitleScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    customElements.drawImage(titleScreen, 0, 0, canvas.width, canvas.height);
}

//handle click
function handleClick(event) {
    if (gameState === "title") {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        //Approximate clickable area for the Start button
        const startX = 300; //left
        const startY = 260; //top
        const startW = 200; //width
        const startH = 80;  //height

        if (
            mouseX >= startX &&
            mouseX <= startX + startW &&
            mouseY >= startY &&
            mouseY <= startY + startH
        )
        {
            startGame();
        }
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