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
    
    if (canMoveTo(newX, newY, 192, 192)) {
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

	//Title screen start box
	if(currentScene === "title"){
		ctx.font = "30px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("START", startBox.x + 80, startBox.y + 65);
		return;
	}
	drawPlayer();
}

function drawPlayer(){
	const img=
		frame === 1
		? absImages[absDirection][0]
		:absImages[absDirection][1];
		ctx.drawImage(img, absX, absY, 192, 192);
	}
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

