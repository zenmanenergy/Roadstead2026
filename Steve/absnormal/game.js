//created by Gort the Smelly

/*
An Absnormal Adventure - Week 3
Sprite sheet animation + multi room transitions
*/
//Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//Game State
let gameState = "title";  //"title" or "playing"

//Image Assests
const titleScreen = new Image();
titleScreen.src = "assets/backgrounds/title_screen.png";

//track which room (background) is active
let currentRoom = 'lab';

const background = {
    lab: new Image(),
    city: new Image(),
};
//Load Backgrounds
background.lab.src = "assets/backgrounds/room_lab.png";
background.city.src = "assets/backgrounds/room_city.png";

//Load Character Sprites
const absWalk = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};
// absWalk.up.src = "assets/characters/abs_walk_up.png";
// absWalk.down.src = "assets/characters/abs_walk_down.png";
// absWalk.left.src = "assets/characters/abs_walk_left.png";
// absWalk.right.src = "assets/characters/abs_walk_right.png";

// Player state
let absDirection = "down";
let absX = 368;
let absY = 268;
let currentBackgroundImage = null;

//movement speed (pixels per frame)
// let speed = 3;
//track keys for smooth movement
let keys = {};

//animation constants
const frameWidth = 96;  //width of one frame in sprite sheet
const frameHeight = 96; //height of one frame
const framePerAnimation = 4; //number of frames in each direction 

//animation counters 
let frameIndex = 0;
// let frameDelay = 8;
// let frameCount = 0; 

//Event Listener
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

//gameLoop
// requestAnimationFrame(update);
// function update() {
//     movePlayer();
//     changeRooms();
//     drawGame();
//     requestAnimationFrame(update);
// }

//Draw Title Screen
titleScreen.onload = () => drawTitle();

function drawTitle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(titleScreen, 0, 0, canvas.width, canvas.height);
}

// Initialize game - draw title screen
window.addEventListener('load', () => {
    if (titleScreen.complete) {
        drawTitle();
    }
});

//handle click
function handleClick(event) {
    console.log('!!! handleClick CALLED !!!');
    console.log('gameState:', gameState);
    
    if (gameState === "title") {
        console.log('In title screen - processing click');
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        console.log(`Click detected at: mouseX=${mouseX}, mouseY=${mouseY}`);
        console.log(`Start button area is: x=300-500, y=260-340`);
        
        if (mouseX >= 300 && mouseX <= 500 && mouseY >= 260 && mouseY <= 340) {
            console.log('========================================');
            console.log('START BUTTON CLICKED!!!');
            console.log('========================================');
            console.log('sceneData available:', sceneData);
            console.log('sceneData keys:', Object.keys(sceneData));
            
            gameState = "playing";
            currentScene = "bedroom";
            
            console.log(`currentScene set to: ${currentScene}`);
            console.log(`sceneData[bedroom]:`, sceneData[currentScene]);
            
            // Use startPoint if available
            if (sceneData[currentScene] && sceneData[currentScene].startPoint) {
                console.log('StartPoint found:', sceneData[currentScene].startPoint);
                absX = sceneData[currentScene].startPoint[0] - 48;
                absY = sceneData[currentScene].startPoint[1] - 96;
                absDirection = "down";
                console.log(`✓ Set position to startPoint: absX=${absX}, absY=${absY}`);
                console.log(`Raw startPoint: [${sceneData[currentScene].startPoint[0]}, ${sceneData[currentScene].startPoint[1]}]`);
            } else {
                console.log('⚠️ No startPoint found!');
                absX = canvas.width / 2 - 48;
                absY = canvas.height / 2 - 96;
                absDirection = "down";
                console.log(`✗ Using default center position: absX=${absX}, absY=${absY}`);
            }
            console.log(`FINAL player position BEFORE image load: absX=${absX}, absY=${absY}`);
            console.log(`Player direction: ${absDirection}`);
            
            // Load the background image from sceneData
            console.log('About to load background image...');
            if (sceneData[currentScene] && sceneData[currentScene].image) {
                console.log(`Image path from sceneData: ${sceneData[currentScene].image}`);
                currentBackgroundImage = new Image();
                console.log('Image object created');
                currentBackgroundImage.src = sceneData[currentScene].image;
                console.log(`Image src set to: ${currentBackgroundImage.src}`);
                
                // Check if image is already cached
                if (currentBackgroundImage.complete) {
                    console.log('IMAGE ALREADY CACHED - calling update immediately');
                    requestAnimationFrame(update);
                } else {
                    console.log('IMAGE NOT CACHED - setting up onload handler');
                    
                    // Start the game loop once the background image is loaded
                    currentBackgroundImage.onload = () => {
                        console.log('############################################');
                        console.log('✓✓✓ IMAGE ONLOAD FIRED ✓✓✓');
                        console.log('############################################');
                        console.log(`Image size: ${currentBackgroundImage.width}x${currentBackgroundImage.height}`);
                        console.log(`Character at: absX=${absX}, absY=${absY}`);
                        requestAnimationFrame(update);
                    };
                    
                    currentBackgroundImage.onerror = () => {
                        console.log('############################################');
                        console.log('✗✗✗ IMAGE ONERROR FIRED ✗✗✗');
                        console.log('############################################');
                        console.log(`Failed to load: ${currentBackgroundImage.src}`);
                    };
                }
            } else {
                console.log('⚠️ No background image in sceneData - starting update anyway');
                requestAnimationFrame(update);
            }
        } else {
            console.log(`Click NOT in start button area. Was at (${mouseX}, ${mouseY})`);
        }
    } else {
        console.log('Not in title screen state - gameState is:', gameState);
    }
}


//Start the Game

// function movePlayer() {
// 	let moving = false; // Track if the player is moving this frame

// 	// Check pressed keys and move character accordingly
// 	if (keys['arrowup'] || keys['w']) {
// 		absY -= speed;
// 		absDirection = 'up';
// 		moving = true;
// 	}
// 	if (keys['arrowdown'] || keys['s']) {
// 		absY += speed;
// 		absDirection = 'down';
// 		moving = true;
// 	}
// 	if (keys['arrowleft'] || keys['a']) {
// 		absX -= speed;
// 		absDirection = 'left';
// 		moving = true;
// 	}
// 	if (keys['arrowright'] || keys['d']) {
// 		absX += speed;
// 		absDirection = 'right';
// 		moving = true;
// 	}

// 	// Prevent player from leaving the visible area
// 	if (absX < 0) absX = 0;
// 	if (absY < 0) absY = 0;
// 	if (absX > canvas.width - frameWidth) absX = canvas.width - frameWidth;
// 	if (absY > canvas.height - frameHeight) absY = canvas.height - frameHeight;

// 	// Update which frame of the animation to show
// 	if (moving) {
// 		frameCount++;
// 		if (frameCount >= frameDelay) { 
// 			frameCount = 0;
// 			frameIndex = (frameIndex + 1) % framePerAnimation; // cycle through 0–3
// 		}
// 	} else {
// 		frameIndex = 0; // reset to first frame when idle
// 	}
// }
function changeRooms() {
	// If in the lab and reach right edge → go to city
	if (currentRoom === 'lab' && absX > canvas.width - frameWidth) {
		currentRoom = 'city';
		absX = 0;
	}

	// If in the city and reach left edge → go back to lab
	if (currentRoom === 'city' && absX < 0) {
		currentRoom = 'lab';
		absX = canvas.width - frameWidth;
	}
}

// function drawGame() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(background[currentRoom], 0, 0, canvas.width, canvas.height);
//     drawAbsNormal();
// }

// function drawAbsNormal() {
//     //select correct abssprite
//     const sprite = absWalk[absDirection];
//     //calculate source x
//     const sx = frameWidth * frameHeight;
//     //drawing one sprite from the sprite sheet onto the canvas
//     ctx.drawImage(sprite, sx, 0, frameWidth, frameHeight, absX, absY, frameWidth, frameHeight);
// }

// const absImages = {
// 	down: [new Image(), new Image()],
// 	up: [new Image(), new Image()],
// 	left: [new Image(), new Image()],
// 	right: [new Image(), new Image()],
// };

//character image setup

// absImages.down[0].src =
// "assets/characters/abs_normal/absnormal_down_walk_1.png";
// absImages.down[1].src =
// "assets/characters/abs_normal/absnormal_down_walk_2.png";
// absImages.up[0].src =
// "assets/characters/abs_normal/absnormal_up_walk_1.png";
// absImages.up[1].src =
// "assets/characters/abs_normal/absnormal_up_walk_2.png";
// absImages.left[0].src =
// "assets/characters/abs_normal/absnormal_left_walk_1.png";
// absImages.left[1].src =
// "assets/characters/abs_normal/absnormal_left_walk_2.png";
// absImages.right[0].src =
// "assets/characters/abs_normal/absnormal_right_walk_1.png";
// absImages.right[0].src =
// "assets/characters/abs_normal/absnormal_right_walk_2.png";

//drawing functions

// function drawScene() {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	ctx.drawImage(backgrounds[currentScene], 0, 0, canvas.width, canvas.height);

// 	//Title screen start box
// 	if(currentScene === "title"){
// 		ctx.strokeStyle = "red";
// 		ctx.lineWidth = 4;
// 		ctx.strokeRect(startBox.x, startBox.y, startBox.width, startBox.height);
// 		ctx.font = "30px Arial";
// 		ctx.fillStyle = "white";
// 		ctx.fillText("START", startBox.x + 80, startBox.y + 65);
// 		return;
// 	}
// 	drawPlayer();
// }

//draw player according to direction and frame
// function drawPlayer(){
// 	const img=
// 		frame === 1
// 		? absImages[absDirection][0]
// 		:absImages[absDirection][1];
// 		ctx.drawImage(img, absX, absY, 192, 192);
// }

//game loop
// function update(){
// 	if (currentScene !== "title"){
// 		movePlayer();
// 		checkTransitions();
// 	}
// 	drawScene();
// 	requestAnimationFrame(update);
// }

//start animation loop
// update();

// Render the character at the current position
let updateLogged = false;
function update() {
    if (gameState !== "playing") {
        requestAnimationFrame(update);
        return;
    }

    if (!updateLogged) {
        console.log('=== UPDATE LOOP STARTED ===');
        console.log(`gameState: ${gameState}`);
        console.log(`currentScene: ${currentScene}`);
        console.log(`absX: ${absX}, absY: ${absY}`);
        console.log(`currentBackgroundImage loaded: ${currentBackgroundImage?.complete}`);
        updateLogged = true;
    }

    // Check for door collisions
    checkDoorCollision();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background if loaded
    if (currentBackgroundImage && currentBackgroundImage.complete) {
        ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        console.log('Background image not ready. currentBackgroundImage:', currentBackgroundImage ? currentBackgroundImage.complete : 'undefined');
    }

    // Draw player character
    drawAbsNormal();

    requestAnimationFrame(update);
}

function drawAbsNormal() {
    console.log(`Drawing character at: absX=${absX}, absY=${absY}, direction=${absDirection}`);
    
    // For now, draw a simple placeholder circle at the player position
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(absX + 48, absY + 48, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw direction indicator
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.font = "12px Arial";
    ctx.fillText(absDirection, absX + 48, absY + 110);
    
    // Draw position text on screen
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`Pos: (${Math.round(absX)}, ${Math.round(absY)})`, 10, 30);
    ctx.fillText(`Raw StartPoint: (${Math.round(sceneData[currentScene]?.startPoint[0] || 0)}, ${Math.round(sceneData[currentScene]?.startPoint[1] || 0)})`, 10, 50);
}

function checkDoorCollision() {
    // Check if player center is inside any door polygon
    if (!sceneData[currentScene] || !sceneData[currentScene].doors) {
        return; // No door data for this scene
    }
    
    // Player bottom center position
    const playerCenterX = absX + 48;
    const playerCenterY = absY + 96;
    
    for (let i = 0; i < sceneData[currentScene].doors.length; i++) {
        const door = sceneData[currentScene].doors[i];
        
        // Check if player center is in this door polygon
        if (isPointInPolygon([playerCenterX, playerCenterY], door.points)) {
            // Check if this door has a destination
            if (door.destination) {
                console.log(`🚪 Door collision detected! Moving to scene: ${door.destination}`);
                changeScene(door.destination);
                return;
            }
        }
    }
}

function changeScene(sceneName) {
    // Check if the scene data exists
    if (!sceneData[sceneName]) {
        console.warn(`⚠️ Scene data not found for: ${sceneName}`);
        return;
    }
    
    console.log(`📍 Changing scene from ${currentScene} to ${sceneName}`);
    
    currentScene = sceneName;
    
    // Set player position to the new scene's start point
    if (sceneData[currentScene].startPoint) {
        absX = sceneData[currentScene].startPoint[0] - 48;
        absY = sceneData[currentScene].startPoint[1] - 96;
        console.log(`✓ Set position to startPoint: absX=${absX}, absY=${absY}`);
    } else {
        absX = canvas.width / 2 - 48;
        absY = canvas.height / 2 - 96;
        console.log(`⚠️ No startPoint found, using center position`);
    }
    
    // Load the new background image
    currentBackgroundImage = new Image();
    currentBackgroundImage.src = sceneData[currentScene].image;
    console.log(`Loading background image: ${currentBackgroundImage.src}`);
    
    currentBackgroundImage.onerror = () => {
        console.error(`Failed to load background: ${currentBackgroundImage.src}`);
    };
}

