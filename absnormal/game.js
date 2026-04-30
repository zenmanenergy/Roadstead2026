//VERY originaly made by Gort
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let gameState = "title";

let collectedItems = new Set(); // "sceneName:itemName"
let pendingPickup = null;       // { sceneName, item } — set when walking to pick up

let absDirection = "down";
let absX = 368;
let absY = 268;
let currentBackgroundImage = null;

let keys = {}; 

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
canvas.addEventListener('click', (event) => {
    if (gameState !== "playing") return;

	const canvasRect = canvas.getBoundingClientRect();
	const clickX = event.clientX - canvasRect.left;
	const clickY = event.clientY - canvasRect.top;

	// Scale click position to actual canvas resolution (800x600)
	const scaleX = canvas.width / canvasRect.width;
	const scaleY = canvas.height / canvasRect.height;

    const canvasClickX = clickX * scaleX;
    const canvasClickY = clickY * scaleY;
    
    if (getCurrentVerb() === 'take' && sceneData[currentScene] && sceneData[currentScene].items) {
        const clikedItem = sceneData[currentScene].items.find(item=>
            !collectedItems.has(`${currentScene}:${item.name}`) && 
            canvasClickX >= item.x - 20 && canvasCLickX <= item.x + 20 &&
            canvasClickY >= item.y - 20 && canvasClickY <= item.y + 20 
        ); 
        if (clickedItem) { 
            targetX = clickedItem.x - HITBOX.CENTER_OFFSET_X;
            targetY = clickeItem.y - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
            pendingPickup = { sceneName: currentScene, item: clickedItem};
            return;
        }
    }
    targetX = canvasClickX - HITBOX.CENTER_OFFSET_X
    targetY = canvasClickY - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET; 
});
 
function collectedItem(pickup) {
    collectedItems.add(`${pickup.sceneName}:${pickup.item.name}`);
    addToInvetory({
        name: pickup.item.name,
        imagePath: `assets/items/inventory/${pickup.item.inventoryImage}`
    });
    statusBar.textContent = '';
}

const statusBar = document.getElementById('statusBar');

canvas.addEventListener('mousemove', (event) => {
    if (gameState !=="playing") return;

    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const canvasX = (event. clientX - canvasRect.left) * scaleX;
    const canvasY = (event.clientY - canvasRect.top) * scaleY;

    if (getCurrentverb() === 'take' && sceneData[currentScene] && sceneData[currentScene].items) { 
        const hoveredItem = sceneData[currentScene].items.find (item =>
            canvasX >= item.x - 20 && canvasX <= item.x + 20 && 
            canvasY >= item.y - 20 && canvasY <= item.y + 20 
        );
        statusBar. textContent = hoveredItem ? hoveredItem.name : '';
    } else {
        statusBar.textContent = '';
    }
}); 

titleScreen.onload = () => drawTitle();

function drawTitle(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(titleScreen,0 , 0, canvas.width, canvas.height);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentBackgroundImage && currentBackgroundImage.complete) {
        ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);

    }
    drawAbsNormal();

    requestAnimationFrame(update);
}
function drawAbsnormal() {
	const center = HITBOX.getCenter(absX, absY);
	const feet = HITBOX.getFeet(absX, absY);
	
	// Draw center hitbox (red)
	ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
	ctx.beginPath();
	ctx.arc(center.x, center.y, 30, 0, Math.PI * 2);
	ctx.fill();
	
	// Draw feet hitbox (blue)
	ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
	ctx.beginPath();
	ctx.arc(feet.x, feet.y, 30, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.fillStyle = "rgba(0, 255, 255, 1)";
	ctx.font = "12px Arial";
	ctx.fillText(absDirection, center.x, center.y + 14);
	
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

    setPlayerStartPoint(currentScene)

    currentBackgroundImage = new image();
    currentBackgroundImage.src = sceneData[currentScene].image;

    currentBackgroundImage.onerror = () => {
    };
}
