const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "title";

let collectedItems = new Set(); // "sceneName:itemName"
let pendingAction = null;       // { verb, target, targetType, sceneName }

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
	const scaleX = canvas.width / canvasRect.width;
	const scaleY = canvas.height / canvasRect.height;
	const canvasClickX = (event.clientX - canvasRect.left) * scaleX;
	const canvasClickY = (event.clientY - canvasRect.top) * scaleY;

	const verb = getCurrentVerb();

	// Check if clicking on an item
	if (sceneData[currentScene] && sceneData[currentScene].items) {
		const clickedItem = sceneData[currentScene].items.find(item =>
			!collectedItems.has(`${currentScene}:${item.name}`) &&
			canvasClickX >= item.x - 20 && canvasClickX <= item.x + 20 &&
			canvasClickY >= item.y - 20 && canvasClickY <= item.y + 20
		);
		if (clickedItem) {
			targetX = clickedItem.x - HITBOX.CENTER_OFFSET_X;
			targetY = clickedItem.y - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
			pendingAction = { verb, target: clickedItem, targetType: 'item', sceneName: currentScene };
			return;
		}
	}

	// Check if clicking on an NPC
	if (sceneData[currentScene] && sceneData[currentScene].npcs) {
		const clickedNPC = sceneData[currentScene].npcs.find(npc =>
			canvasClickX >= npc.x - 48 && canvasClickX <= npc.x + 48 &&
			canvasClickY >= npc.y - 96 && canvasClickY <= npc.y + 96
		);
		if (clickedNPC) {
			targetX = clickedNPC.x - HITBOX.CENTER_OFFSET_X;
			targetY = clickedNPC.y - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET + 50;
			pendingAction = { verb, target: clickedNPC, targetType: 'npc', sceneName: currentScene };
			return;
		}
	}

	// Default: move to clicked position
	pendingAction = null;
	targetX = canvasClickX - HITBOX.CENTER_OFFSET_X;
	targetY = canvasClickY - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
});

function setStatusMessage(msg) {
	statusBar.textContent = msg;
	statusBarLocked = true;
	if (statusBarLockTimer) clearTimeout(statusBarLockTimer);
	statusBarLockTimer = setTimeout(() => { statusBarLocked = false; }, 3000);
}

function buildActionContext(target, targetType, sceneName) {
	return {
		item: target,
		targetType,
		sceneName,
		showMessage: (msg) => setStatusMessage(msg),
		collectItem: (item) => collectItem({ sceneName, item }),
		hasItem: (name) => inventory.some(i => i.name === name),
		changeScene: (scene) => changeScene(scene)
	};
}

function executePendingAction(pending) {
	const { verb, target, targetType, sceneName } = pending;

	// If the target has a custom action for this verb, use it
	if (target.actions && target.actions[verb]) {
		const ctx = buildActionContext(target, targetType, sceneName);
		executeAction(target.actions[verb], ctx);
		return;
	}

	// Default behaviors
	if (targetType === 'item') {
		if (verb === 'look') {
			lookAtItem({ sceneName, item: target });
		} else if (verb === 'take') {
			collectItem({ sceneName, item: target });
		} else {
			setStatusMessage(`You can't ${verb} the ${target.name}.`);
		}
	} else if (targetType === 'npc') {
		if (verb === 'look') {
			setStatusMessage(`You look at ${target.name}.`);
		} else if (verb === 'talk') {
			setStatusMessage(`${target.name} has nothing to say.`);
		} else {
			setStatusMessage(`You can't ${verb} ${target.name}.`);
		}
	}
}

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
		imagePath: `assets/items/inventory/${pickup.item.inventoryImage1}`,
		inventoryImage1: pickup.item.inventoryImage1,
		inventoryImage2: pickup.item.inventoryImage2
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

	let hoveredName = '';
	if (sceneData[currentScene]) {
		if (sceneData[currentScene].items) {
			const hoveredItem = sceneData[currentScene].items.find(item =>
				!collectedItems.has(`${currentScene}:${item.name}`) &&
				canvasX >= item.x - 20 && canvasX <= item.x + 20 &&
				canvasY >= item.y - 20 && canvasY <= item.y + 20
			);
			if (hoveredItem) hoveredName = hoveredItem.name;
		}
		if (!hoveredName && sceneData[currentScene].npcs) {
			const hoveredNPC = sceneData[currentScene].npcs.find(npc =>
				canvasX >= npc.x - 48 && canvasX <= npc.x + 48 &&
				canvasY >= npc.y - 96 && canvasY <= npc.y + 96
			);
			if (hoveredNPC) hoveredName = hoveredNPC.name;
		}
	}
	statusBar.textContent = hoveredName;
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


