function setPlayerStartPoint(sceneName) {
	
	if (!sceneData[sceneName]) {
		return false;
	}

	if (sceneData[sceneName].startPoint) {
		const rawStartPoint = sceneData[sceneName].startPoint;
		
		absX = rawStartPoint[0] - HITBOX.CENTER_OFFSET_X;
		absY = rawStartPoint[1] - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
		absDirection = "down";
		
		return true;
	} else {
		absX = canvas.width / 2 - HITBOX.CENTER_OFFSET_X;
		absY = canvas.height / 2 - HITBOX.CENTER_OFFSET_Y - HITBOX.FEET_OFFSET;
		absDirection = "down";
		return false;
	}
}