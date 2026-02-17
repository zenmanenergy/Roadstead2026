function setPlayerStartPoint(sceneName) {
	
	if (!sceneData[sceneName]) {
		return false;
	}

	if (sceneData[sceneName].startPoint) {
		const rawStartPoint = sceneData[sceneName].startPoint;
		
		absX = rawStartPoint[0] - 48;
		absY = rawStartPoint[1] - 96;
		absDirection = "down";
		
		return true;
	} else {
		absX = canvas.width / 2 - 48;
		absY = canvas.height / 2 - 96;
		absDirection = "down";
		return false;
	}
}

function getStartPoint(sceneName) {
	if (sceneData[sceneName] && sceneData[sceneName].startPoint) {
		return sceneData[sceneName].startPoint;
	}
	return null;
}
