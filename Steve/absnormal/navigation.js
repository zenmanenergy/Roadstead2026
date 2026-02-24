// Navigation Module
// Handles scene transitions and door collisions

console.log('🚪 navigation.js loaded - Navigation functions ready');

// Check if player is at a door and transition to next scene
function checkTransitions() {
	checkDoorCollision();
}

// Alias for consistency
function checkDoor() {
	checkDoorCollision();
}

// Detailed door collision detection
function checkDoorCollision() {
	if (!sceneData[currentScene] || !sceneData[currentScene].doors) {
		return;
	}

	const playerCenterX = absX + 48;
	const playerCenterY = absY + 96;
	
	for (let i = 0; i < sceneData[currentScene].doors.length; i++) {
		const door = sceneData[currentScene].doors[i];
		
		// Check if player center is in this door polygon
		if (isPointInPolygon([playerCenterX, playerCenterY], door.points)) {
			// Check if this door has a destination
			if (door.nextScene) {
				console.log(`\n🚪 Door collision! Transitioning to: ${door.nextScene}`);
				changeScene(door.nextScene);
				return;
			}
		}
	}
}
