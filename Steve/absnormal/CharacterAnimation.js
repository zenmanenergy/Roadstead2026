let lastX = 0;
let lastY = 0;
let frameDelay = 15;
let frameCount = 0;
let frame = 1;
let moving = false;
let speed = 3;

const absImages = {
	down: [new Image(), new Image()],
	up: [new Image(), new Image()],
	left: [new Image(), new Image()],
	right: [new Image(), new Image()],
};

absImages.down[0].src =
"assets/characters/abs_normal/absnormal_down_walk_1.png";
absImages.down[1].src =
"assets/characters/abs_normal/absnormal_down_walk_2.png";
absImages.up[0].src =
"assets/characters/abs_normal/absnormal_up_walk_1.png";
absImages.up[1].src =
"assets/characters/abs_normal/absnormal_up_walk_2.png";
absImages.left[0].src =
"assets/characters/abs_normal/absnormal_left_walk_1.png";
absImages.left[1].src =
"assets/characters/abs_normal/absnormal_left_walk_2.png";
absImages.right[0].src =
"assets/characters/abs_normal/absnormal_right_walk_1.png";
absImages.right[1].src =
"assets/characters/abs_normal/absnormal_right_walk_2.png";

function movePlayer() {
	lastX = absX;
	lastY = absY;
	moving = false;
	let newX = absX;
	let newY = absY;
    
    if (keys["w"] || keys["arrowup"]) { newY -= speed; absDirection = "up"; moving = true; }
    if (keys["s"] || keys["arrowdown"]) { newY += speed; absDirection = "down"; moving = true; }
    if (keys["a"] || keys["arrowleft"]) { newX -= speed; absDirection = "left"; moving = true; }
    if (keys["d"] || keys["arrowright"]) { newX += speed; absDirection = "right"; moving = true; }
	
	if (canMoveTo(newX, newY, HITBOX.SPRITE_WIDTH, HITBOX.SPRITE_HEIGHT)) {
		absX = newX;
		absY = newY;
	}
	
	if (moving) {
		frameCount++;
		if (frameCount >= frameDelay) {
			frameCount = 0;
			frame = frame === 1 ? 2 : 1;
		}
	}
}

function drawScene() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (currentBackgroundImage) {
		ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
	}
	drawPlayer();
	
	// Debug: Draw feet hitbox only
	const feet = HITBOX.getFeet(absX, absY);
	
	ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
	ctx.beginPath();
	ctx.arc(feet.x, feet.y, 15, 0, Math.PI * 2);
	ctx.fill();
	
	// Debug text
	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	ctx.font = "bold 12px Arial";
	ctx.fillText(`Feet Y: ${Math.round(feet.y)}`, 10, 30);
}

function drawPlayer(){
	const img = frame === 1
		? absImages[absDirection][0]
		: absImages[absDirection][1];
	ctx.drawImage(img, absX, absY, HITBOX.SPRITE_WIDTH, HITBOX.SPRITE_HEIGHT);
}

function update(){
	if (currentScene !== "title"){
		movePlayer();
		checkTransitions();
		checkDoor();
	}
	drawScene();
	requestAnimationFrame(update);
}

