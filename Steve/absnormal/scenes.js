const scenes = [
	'bedroom',
	'room_lab',
	'room_city',
	'room_office',
	'room_pharmacy',
	'CITY-absnormal'
];

let sceneData = {};
let currentScene = "title";


async function loadSceneData() {
	
	for (const sceneName of scenes) {
		try {
			const response = await fetch(`data/${sceneName}.json`);
			if (response.ok) {
				sceneData[sceneName] = await response.json();
				console.log(`✓ Loaded scene: ${sceneName}`);
			} else {
				console.warn(`✗ Failed to load ${sceneName}: HTTP ${response.status}`);
			}
		} catch (error) {
			console.warn(`✗ Error loading ${sceneName}: ${error.message}`);
		}
	}
}

function isSceneValid(sceneName) {
	return sceneData[sceneName] !== undefined;
}

function getScene(sceneName) {
	return sceneData[sceneName] || null;
}

function getSceneStartPoint(sceneName) {
	const scene = sceneData[sceneName];
	if (scene && scene.startPoint) {
		return scene.startPoint;
	}
	return null;
}


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

function canMoveTo(newX, newY, width, height) {
	if (!sceneData[currentScene] || !sceneData[currentScene].walkableAreas) {
		return true;
	}
	
	const centerX = newX + width / 2;
	const centerY = newY + height / 2;
	
	for (const area of sceneData[currentScene].walkableAreas) {
		if (isPointInPolygon([centerX, centerY], area.points)) {
			return true;
		}
	}
	return false;
}


