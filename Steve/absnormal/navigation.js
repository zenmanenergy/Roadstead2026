console.log('🚪 navigation.js loaded - Navigation functions ready');

function checkTransitions() {
	checkDoorCollision();
}

function checkDoor() {
	checkDoorCollision();
}

function checkDoorCollision() {
	if (!sceneData[currentScene] || !sceneData[currentScene].doors) {
		return;
	}

	const feet = HITBOX.getFeet(absX, absY);
	
	for (let i = 0; i < sceneData[currentScene].doors.length; i++) {
		const door = sceneData[currentScene].doors[i];
		
		// Shift door polygons from center-based to feet-based coordinates
		const shiftedDoorPoints = HITBOX.shiftPolygonToFeet(door.points);
	if (isPointInPolygon([feet.x, feet.y], shiftedDoorPoints)) {
			if (door.nextScene) {
				console.log(`\n🚪 Door collision! Transitioning to: ${door.nextScene}`);
				changeScene(door.nextScene);
				return;
			}
		}
	}
}
