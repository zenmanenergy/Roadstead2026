const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "title";

let absDirection = "down";
let absX = 368;
let absY = 268;
let currentBackgroundImage = null;

let keys = {}; 

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

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


