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
absImages.right[0].src =
"assets/characters/abs_normal/absnormal_right_walk_2.png";

//drawing functions

function drawScene() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(backgrounds[currentScene], 0, 0, canvas.width, canvas.height);

	//Title screen start box
	if(currentScene === "title"){
		ctx.strokeStyle = "red";
		ctx.lineWidth = 4;
		ctx.strokeRect(startBox.x, startBox.y, startBox.width, startBox.height);
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
update();

