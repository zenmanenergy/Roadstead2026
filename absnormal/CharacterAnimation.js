let frameDelay = 15;
let frameCount = 0;

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
    moving = false;
    if (keys["w"] || keys["arrowup"]) { absY -= speed; absDirection = "up"; moving = true; }
    if (keys["s"] || keys["arrowdown"]) { absY += speed; absDirection = "down"; moving = true; }
    if (keys["a"] || keys["arrowleft"]) { absX -= speed; absDirection = "left"; moving = true; }
    if (keys["d"] || keys["arrowright"]) { absX += speed; absDirection = "right"; moving = true; }
    
    // Prevent player from leaving the visible area
    if (absX < 0) absX = 0;
    if (absY < 0) absY = 0;
    if (absX > canvas.width - 192) absX = canvas.width - 192;
    if (absY > canvas.height - 192) absY = canvas.height - 192;
    
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
	ctx.drawImage(backgrounds[currentScene], 0, 0, canvas.width, canvas.height);

	//Title screen start box
	if(currentScene === "title"){
		// ctx.strokeStyle = "red";
		// ctx.lineWidth = 4;
		// ctx.strokeRect(startBox.x, startBox.y, startBox.width, startBox.height);
		ctx.font = "30px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("START", startBox.x + 80, startBox.y + 65);
		return;
	}
	drawPlayer();
}

//draw player according to direction and frame
function drawPlayer(){
	const img=
		frame === 1
		? absImages[absDirection][0]
		:absImages[absDirection][1];
		ctx.drawImage(img, absX, absY, 192, 192);
}

//game loop
function update(){
	if (currentScene !== "title"){
		movePlayer();
		checkTransitions();
	}
	drawScene();
	requestAnimationFrame(update);
}

//start animation loop
// update();

