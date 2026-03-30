let lastX = 0;
let lastY = 0;
let frameDelay = 15;
let frameCount = 0;
let frame = 1;
let moving = false;
let speed = 3;
let targetX = null;
let targetY = null;

const absImages = {
	down: [new Image(), new Image()],
	up: [new Image(), new Image()],
	left: [new Image(), new Image()],
	right: [new Image(), new Image()],
};

//character image setup

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

//drawing functions
function movePlayer() {
	lastX = absX;
	lastY = absY;
    moving = false;
    let newX = absX;
    let newY = absY;
    
    if (targetX !== null && targetY !== null){
		const deltax = targetX - absX;
		const deltaY = targetY - absY;
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		// If at target, stop moving
		if (distance < speed) {
				targetX = null;
				targetY = null;
		} else {
				// Move toward target
				const moveX = (deltaX / distance) * speed;
				const moveY = (deltaY / distance) * speed;

				newX = absX + moveX;
				newY = absY + moveY;

				// Determine direction based on movement
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
						absDirection = deltaX > 0 ? "right" : "left";
				} else {
						absDirection = deltaY > 0 ? "down" : "up";
				}
				moving = true;
		}
	}
	if (canMoveTo(newX, newY, Hitbox.SPRITE_WIDTH, HITBOX.SPRITE_HEIGHT)){
			absX = newX;
			absY = newY;
	} else {
			// Blocked by wall, stop animating
			moving = false;
	}
	// only animate if character actually moved
	if (moving && (absX !== last || absY !== lastY)) {
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
}
function drawPlayer(){
		const img = frame === 1
			? absImage[absDirection][0]
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