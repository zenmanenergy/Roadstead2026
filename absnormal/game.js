//created by Gort the Smelly

/*
An Absnormal Adventure - Week 3
Sprite sheet animation + multi room transitions
*/
//Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Game State
let gameState = "title";  //"title" or "playing"

let absDirection = "down";
let absX = 368;
let absY = 268;
let currentBackgroundImage = null;

let keys = {};

canvas.addEventListener('click', (event) => {
    if (gameState !== "playing") return;

    const canvasRect = canvas.getBoundingClientRect();
    const clickX = event.clientX - canvasRect.width;
    const clickY = event.clientY - canvasRect.height;

    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    const canvasClickX = clickX * scaleX;
    const canvasClickY = clickY * scaleY;

    targetX = canvasClickX - HITBOX.CENTER_OFFSET_X
    targetY = canvasClickY - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;

});

titleScreen.onload = () => drawTitle();

function drawTitle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(titleScreen,0,0,canvas.width,canvas.height);
}

window.addEventListener('load', () => {
    loadSceneData().then(() => {
        if (titleScreen.complete) {
            drawTitle();
        } else {
            titleScreen.onload = drawTitle;
        }
    });
});

function update() {
    if (gameState !== "playing") {
        requestAnimationFrame(update);
        return;
    }

    checkDoorCollision();

    ctx.clearRect(0,0, canvas.width, canvas.height);

    if (currentBackgroundImage && currentBackgroundImage.complete) {
        ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
    }
    drawAbsNormal();

    requestAnimationFrame(update);
}

function drawAbsNormal() {
    const center = HITBOX.getCenter(absX, absY);
    const feet = HITBOX.getFeet(absX, absY);

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(center.x, center.y, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(feet.x, feet.y, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`Pos: (${Math.round(absX)}, ${Math.round(absY)})`, 10, 30);
    ctx.fillText(`Feet: (${Math.round(feet.x)}, ${Math.round(feet.y)})`, 10, 50);
}

function changeScene(sceneName) {
    if (!sceneData[sceneName]) {
        return;
    }

    currentScene = sceneName;

    setPlayerStartPoint(currentScene);

    currentBackgroundImage = new Image();
    currentBackgroundImage.src = sceneData[currentScene].image;

    currentBackgroundImage.onerror = () => {
    };
}