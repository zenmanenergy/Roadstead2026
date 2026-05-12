const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "title";

let collectedItems = new Set(); // "sceneName:itemName"
let pendingPickup = null;       // { sceneName, item } — set when walking to pick up
let pendingLook = null;         // { sceneName, item } — set when walking to look at

let absDirection = "down";
let absX = 368;
let absY = 268;
let currentBackgroundImage = null;

let keys = {}; 

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Click-based movement handler
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

	// If Look verb is active, check if clicking on an item
	if (getCurrentVerb() === 'look' && sceneData[currentScene] && sceneData[currentScene].items) {
		const clickedItem = sceneData[currentScene].items.find(item =>
			!collectedItems.has(`${currentScene}:${item.name}`) &&
			canvasClickX >= item.x - 20 && canvasClickX <= item.x + 20 &&
			canvasClickY >= item.y - 20 && canvasClickY <= item.y + 20
		);
		if (clickedItem) {
			targetX = clickedItem.x - HITBOX.CENTER_OFFSET_X;
			targetY = clickedItem.y - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
			pendingLook = { sceneName: currentScene, item: clickedItem };
			return;
		}
	}

	// If Take verb is active, check if clicking on an item
	if (getCurrentVerb() === 'take' && sceneData[currentScene] && sceneData[currentScene].items) {
		const clickedItem = sceneData[currentScene].items.find(item =>
			!collectedItems.has(`${currentScene}:${item.name}`) &&
			canvasClickX >= item.x - 20 && canvasClickX <= item.x + 20 &&
			canvasClickY >= item.y - 20 && canvasClickY <= item.y + 20
		);
		if (clickedItem) {
			targetX = clickedItem.x - HITBOX.CENTER_OFFSET_X;
			targetY = clickedItem.y - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
			pendingPickup = { sceneName: currentScene, item: clickedItem };
			return;
		}
	}

	// Default: move to clicked position
	targetX = canvasClickX - HITBOX.CENTER_OFFSET_X;
	targetY = canvasClickY - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
});

function lookAtItem(look) {
	statusBar.textContent = look.item.lookMessage || `You see the ${look.item.name}.`;
	statusBarLocked = true;
	if (statusBarLockTimer) clearTimeout(statusBarLockTimer);
	statusBarLockTimer = setTimeout(() => { statusBarLocked = false; }, 3000);
}

function collectItem(pickup) {
	collectedItems.add(`${pickup.sceneName}:${pickup.item.name}`);
	addToInventory({
		name: pickup.item.name,
		imagePath: `assets/items/inventory/${pickup.item.inventoryImage}`
	});
	statusBar.textContent = '';
}

const statusBar = document.getElementById('statusBar');
let statusBarLocked = false;
let statusBarLockTimer = null;

canvas.addEventListener('mousemove', (event) => {
	if (gameState !== "playing" || statusBarLocked) return;

	const canvasRect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / canvasRect.width;
	const scaleY = canvas.height / canvasRect.height;
	const canvasX = (event.clientX - canvasRect.left) * scaleX;
	const canvasY = (event.clientY - canvasRect.top) * scaleY;

	if ((getCurrentVerb() === 'take' || getCurrentVerb() === 'look') && sceneData[currentScene] && sceneData[currentScene].items) {
		const hoveredItem = sceneData[currentScene].items.find(item =>
			!collectedItems.has(`${currentScene}:${item.name}`) &&
			canvasX >= item.x - 20 && canvasX <= item.x + 20 &&
			canvasY >= item.y - 20 && canvasY <= item.y + 20
		);
		statusBar.textContent = hoveredItem ? hoveredItem.name : '';
	} else {
		statusBar.textContent = '';
	}
});

titleScreen.onload = () => drawTitle();

function drawTitle() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(titleScreen, 0, 0, canvas.width, canvas.height);
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
	requestAnimationFrame(update);

	if (gameState !== "playing") {
		return;
	}

	checkDoorCollision();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (currentBackgroundImage && currentBackgroundImage.complete) {
		ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
	}

	drawNPCs();
	drawAbsNormal();
}

function drawNPCs() {
	if (!sceneData[currentScene] || !sceneData[currentScene].npcs) return;
	sceneData[currentScene].npcs.forEach(npc => {
		if (npc.imageObj && npc.imageObj.complete && npc.imageObj.naturalWidth > 0) {
			try {
				ctx.drawImage(npc.imageObj, npc.x - 96, npc.y - 96, 192, 192);
			} catch (e) {
				console.warn(`drawNPCs: failed to draw ${npc.name}:`, e);
			}
		}
	});
}

function drawAbsNormal() {
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
	
	setPlayerStartPoint(currentScene);
	
	currentBackgroundImage = new Image();
	currentBackgroundImage.src = sceneData[currentScene].image;
	
	currentBackgroundImage.onerror = () => {
	};
}


