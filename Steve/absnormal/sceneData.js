// Load all scene data from /absnormal/data/*.json
let sceneData = {};

async function loadSceneData() {
	const scenes = ['bedroom'];
	
	for (const scene of scenes) {
		try {
			const response = await fetch(`data/${scene}.json`);
			if (response.ok) {
				sceneData[scene] = await response.json();
				console.log(`✓ Loaded ${scene}:`, sceneData[scene]);
			} else {
				console.warn(`✗ Failed to load ${scene}: ${response.status}`);
			}
		} catch (e) {
			console.warn(`✗ No data file for ${scene}:`, e.message);
		}
	}
	console.log('All scene data loaded:', sceneData);
}

// Point-in-polygon using ray casting algorithm
function isPointInPolygon(point, polygon) {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i];
		const [xj, yj] = polygon[j];
		
		const intersect = (yi > point[1]) !== (yj > point[1]) &&
			point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
}

// Check if player bounding box can move to new position
function canMoveTo(newX, newY, width, height) {
	if (!sceneData[currentScene] || !sceneData[currentScene].walkableAreas) {
		return true; // No data, allow movement
	}
	
	// Check if center of player is in a walkable area
	const centerX = newX + width / 2;
	const centerY = newY + height / 2;
	
	for (const area of sceneData[currentScene].walkableAreas) {
		if (isPointInPolygon([centerX, centerY], area.points)) {
			return true;
		}
	}
	return false;
}

// Load scene data on startup
loadSceneData();
