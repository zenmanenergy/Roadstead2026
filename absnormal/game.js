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
let currentRoom = 'lab';

//Load Character Sprites
const absWalk = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};

let absDirection = "down";
let absX = 368;
let absY = 268;
let currentBackgroundImage = null;

let keys = {};

const frameWidth = 96;
const frameHeight = 96;
const framePerAnimation = 4;

let frameIndex = 0;

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

titleScreen.onload = () => drawTitle();

function drawTitle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(titleScreen,0,0,canvas.width,canvas.height);
}

window.addEventListener('load', () => {
    loadSceneData().then(() => {
        if (titleScreen.complete){
            drawTitle();
        }else{
            titleScreen.onload = drawTitle;
        }
    }).catch(error => {
        if (titleScreen.complete) {
            drawTitle();
        }else{
            titleScreen.onload = drawTitle;
        }
    });
});

function handleClick(event){
    if (gameState === "title"){
        handleTitleClick(event);
    } else if (gameState === "playing"){
    }
}

function changeRooms() {
    if(currentRoom === 'lab' && absX <0){
        currentRoom = 'city';
        absX = 0;
    }

    if(currentRoom === 'city' && absX <0) {
        currentRoom = 'lab';
        absX = canvas.width - frameWidth;
    }
}

function update() {
    if(gameState !== "playing") {
        requestAnimationFrame(update);
        return;
    }
    checkDoorCollision();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(currentBackgroundImage && currentBackgroundImage.complete) {
        ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
    }

    drawAbsNormal();

    requestAnimationFrame(update);

}

function drawAbsNormal() {
    ctx.fillStyle="rgba(225,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(absX + 48, absY + 48, 30, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "rgba(0, 0, 225, 0.5)";
    ctx.font = "12px Arial";
    ctx.fillText(absDirection, absX + 48, absY + 110);

    ctx.fillStyle = "rgba(225, 225, 225, 1)";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`Pos: (${Math.round(absX)}, ${Math.round(absY)})`, 10, 30);
    drawStartPointDebug();
}

function checkDoorCollision(){
    if(!sceneData[currentScene] || !sceneData[currentScene].doors){
        return;
    }
    const playerCenterX = absX + 48;
    const playerCenterY = absY  +  96;
    
    for  (let i = 0; i < sceneData[currentScene].doors.length; i++) {
        const door = sceneData[currentScene].doors[i];

        if (isPointInPolygon([playerCenterX, playerCenterY], door.points)){
            if (door.destination){
                changeScene(door.destination);
                return;
            }
        }
    }
}

function changeScene(sceneName) {
    if(!sceneData[sceneName]){
        return;
    }

    currentScene = sceneName;

    setPlayerStartPoint(currentScene);
    currentBackgroundImage = new Image();
    currentBackgroundImage  = sceneData[currentScene].image;

    currentBackgroundImage.onerror = () => {
    };
}

async function ensureSceneLoaded(sceneName) {
    if (sceneData[sceneName]) {
        return true;
    }
    try {
        constresponse = await fetch(`data/${sceneName}.json`);
        if(Response.ok)  {
            sceneData[sceneName] = await Response.json();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

function debugSceneData(sceneName){
    if (!sceneData[sceneName]) {
        return;
    }
    const scene = sceneData[sceneName];
}