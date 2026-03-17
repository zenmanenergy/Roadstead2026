const scenes = [
	'bedroom',
	'lab',
	'city_0',
	'city_1',
	'doctor',
	'pharmacy'
];

let sceneData = {};
let currentScene = "title";


async function loadSceneData() {
	const fileMap = {
		'bedroom': 'bedroom',
		'lab': 'room_lab',
		'city_0': 'room_city_0',
		'city_1': 'room_city_1',
		'doctor': 'room_doctor',
		'pharmacy': 'room_pharmacy'
	};
	
	for (const sceneName of scenes) {
		const fileName = fileMap[sceneName];
		const response = await fetch(`/Steve/absnormal/data/${fileName}.json`);
		if (response.ok) {
			sceneData[sceneName] = await response.json();
			console.log(`✓ Loaded scene: ${sceneName}`);
		} else {
			console.warn(`✗ Failed to load ${sceneName}: HTTP ${response.status}`);
		}
	}
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
	
	const feet = HITBOX.getFeet(newX, newY);
	
	// Shift the walkable area polygons from center-based to feet-based coordinates
	for (const area of sceneData[currentScene].walkableAreas) {
		const shiftedPolygon = HITBOX.shiftPolygonToFeet(area.points);
		if (isPointInPolygon([feet.x, feet.y], shiftedPolygon)) {
			return true;
		}
	}
	return false;
}


