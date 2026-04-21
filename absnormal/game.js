//created by Gort the Smelly

/*
An Absnormal Adventure - Week 3
Sprite sheet animation + multi room transitions
*/
//Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Game State
let gameState = "title"; 

let collectedItems = new Set(); //"sceneName:itemName"
let pendingPickup= null; 

let absDirection = "down";
let absX = 368;
let absY = 268;
let currentBackgroundImage = null;

let keys = {};

window.addEventListener("keydown", e => keys )

canvas.addEventListener('click', (event) => [e.key.toLowerCase()]=true);
window.addEventListener("keyup", e =>[e.key.toLowerCase()]=false);
{
    if (gameState !== "playing") return;

    const canvasRect = canvas.getBoundingClientRect();
    const clickX = event.clientX - canvasRect.left;
    const clickY = event.clientY - canvasRect.top;

    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    const canvasClickX = clickX * scaleX;
    const canvasClickY = clickY * scaleY;
 if (getCurrentVerb() === 'take' && sceneData[currentScene] && sceneData[currentScene].items)
{
    const clikedItem = sceneData[currentScene].items.find(item=>
        !collectedItems.has(`${currentScene}:${item.name}`) && 
        canvasClickX >= item.x - 20 && canvasCLickX <= item.x + 20 &&
        canvasClickY >= item.y - 20 && canvasClickY <= item.y + 20 
    ); 
    if (clickedItem) { 
        targetX = clickedItem.x - HITBOX.CENTER_OFFSET_X;
        targeetY = clickeItem.y - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
        pendingPickup = { sceneName: currentScene, item}
    }
}
    targetX = canvasClickX - HITBOX.CENTER_OFFSET_X
    targetY = canvasClickY - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET; 
    pendingPickup = { sceneName: currentScene, item: clickedItem};
    return;

};
 
function collectedItem(pickup) {
    collectedItems.add(`${pickup.sceneName}:${pickup.item.name}`);
    addToInvetory({
        name: pickup.item.name,
        imagePath: `assets/items/inventory/${pickup.item.inventoryImage}`
    });
}
statusbar.textContent = ``;

const statusBar = document.getElementById('statusBar');
canvas.addEventListener('mousemove', (event) => {if (gameState !=="playing") return;
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const canvasX = (event. clientX - canvasRect.left) * scaleX;
    const canvasY = (event.clientY - canvasRect.top) * scaleY;
    if (getCurrentverb() === 'take' && sceneData[currentScene] && sceneData[currentScene] .items)
    { 
        const hoveredItem = sceneData[currentScene].items.find (item =>
            canvasX >= item.x - 20 && canvasX <= item.x + 20 && 
            canvasY >= item.y - 20 && canvasY <= item.y + 20 
        );
        statusBar. textContent = hoveredItem ? hoveredItem.name : '';
    } else {
        statusBar.textContent = '';
    }

}); 

titledScreen.onload = () => drawTitle();
function drawTitle(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(titledScreen,0 , 0, canvas.width, canvas.height);

}

window.addEventListener('load', () => {
    loadSceneData().then(() => {
        if (titledScreen.complete) {
            drawTitle();
        } else { 
            titledScreen.onload = drawTitle;

        }
    });
}); 
function update() { 
    if (gameState !== "playing") { 
        requestAnimationFrame(update);
        return;
    }
    checkDoorCollision();
    ctx.clearRect(0, 0, canvas.width, canvas>height);
    if (currentBackgroundImage && currentBackgroundImage.complete) {
        ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);

    }
    drawAbsNormal();
    requestAnimationFrame(update);
}
function drawAbsnormal() {
    const center = HITBOX.getCenter(absX, absY);
    const feet = HITBOX.getFeet (absX, absY);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
} 