// Main Scene Editor - Coordinates all modules

let canvas;
let ctx;
let currentMode = 'walkable';
let points = [];

// Scene list
const scenes = [
	'bedroom',
	'room_lab',
	'room_city',
	'room_office',
	'room_pharmacy',
	'CITY-absnormal'
];

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded event fired');
	
	// Initialize canvas after DOM is loaded
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	console.log('Canvas initialized:', canvas, ctx);

	// Set up canvas events
	canvas.addEventListener('click', handleCanvasClick);
	canvas.addEventListener('mousemove', handleCanvasMouseMove);
	console.log('Canvas events attached');

	// Set up tab switching
	console.log('Setting up tab switching, found tabs:', document.querySelectorAll('.tab-button').length);
	document.querySelectorAll('.tab-button').forEach(button => {
		button.addEventListener('click', () => {
			document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
			document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

			button.classList.add('active');
			const tabName = button.dataset.tab;
			document.getElementById(`tab-${tabName}`).classList.add('active');

			currentMode = tabName;
			points = [];
			redraw();
		});
	});
	console.log('Tab switching setup complete');

	// Populate scenes
	const sceneSelect = document.getElementById('sceneSelect');
	console.log('Scene select element:', sceneSelect);
	scenes.forEach(scene => {
		const option = document.createElement('option');
		option.value = scene;
		option.textContent = scene.charAt(0).toUpperCase() + scene.slice(1);
		sceneSelect.appendChild(option);
	});
	console.log('Scenes populated:', scenes.length);

	// Initialize images module
	initializeImageSelect();
	console.log('Images module initialized');
});

// ===== Canvas Events =====

function handleCanvasClick(e) {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;
	const x = (e.clientX - rect.left) * scaleX;
	const y = (e.clientY - rect.top) * scaleY;

	if (currentMode === 'start') {
		placeStartPoint(x, y);
	} else if (currentMode === 'npc') {
		placeNPC(x, y);
	} else {
		// Walkable areas and doors use polygon points
		points.push({ x, y });
		redraw();
	}
}

function handleCanvasMouseMove(e) {
	if (points.length > 0) {
		redraw();
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;

		// Draw preview line to current mouse position
		ctx.strokeStyle = '#ffff00';
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.setLineDash([]);
	}
}

// ===== Polygon Operations =====
function finishPolygon() {
	let success = false;

	if (currentMode === 'walkable') {
		success = finishWalkablePolygon(points);
	} else if (currentMode === 'door') {
		success = finishDoorPolygon(points);
	}

	if (success) {
		points = [];
		updateOutput();
		populateFormFields();
		redraw();
	}
}

function undoLastPoint() {
	points.pop();
	redraw();
}

// ===== Form Field Population =====
function populateFormFields() {
	populateWalkableAreasPanel();
	populateDoorsPanel();
	populateNPCsPanel();
	populateStartPointPanel();
}

function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw background image
	if (currentBackgroundImage) {
		ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
	}

	// Draw all walkable areas
	walkableAreas.forEach((area, index) => {
		drawPolygon(area, '#00ff00', 0.3);
		// Draw label
		const bounds = getBounds(area);
		ctx.fillStyle = '#00ff00';
		ctx.font = '12px Arial';
		ctx.fillText(`WA${index}`, bounds.minX + 5, bounds.minY + 15);
	});

	// Draw all doors
	doors.forEach((door, index) => {
		drawPolygon(door.points, '#ff00ff', 0.3);
		const bounds = getBounds(door.points);
		ctx.fillStyle = '#ff00ff';
		ctx.font = '12px Arial';
		ctx.fillText(`D${index}`, bounds.minX + 5, bounds.minY + 15);
	});

	// Draw all NPCs
	npcs.forEach((npc) => {
		ctx.fillStyle = '#ffff00';
		ctx.fillRect(npc.x - 5, npc.y - 5, 10, 10);
		ctx.font = '10px Arial';
		ctx.fillStyle = '#ffff00';
		ctx.fillText(npc.name, npc.x + 8, npc.y);
	});

	// Draw start point
	if (startPoint) {
		ctx.fillStyle = '#00ffff';
		ctx.fillRect(startPoint.x - 8, startPoint.y - 8, 16, 16);
		ctx.font = 'bold 10px Arial';
		ctx.fillText('START', startPoint.x + 10, startPoint.y);
	}

	// Draw current points being drawn
	if (points.length > 0) {
		drawPolygon(points, '#0099ff', 0.5);

		// Highlight current points
		points.forEach((point) => {
			ctx.fillStyle = '#0099ff';
			ctx.beginPath();
			ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
			ctx.fill();
		});
	}
}

function drawPolygon(points, color, alpha) {
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.globalAlpha = alpha;
	ctx.lineWidth = 2;

	ctx.beginPath();
	const firstPoint = points[0];
	const x0 = Array.isArray(firstPoint) ? firstPoint[0] : firstPoint.x;
	const y0 = Array.isArray(firstPoint) ? firstPoint[1] : firstPoint.y;
	ctx.moveTo(x0, y0);
	for (let i = 1; i < points.length; i++) {
		const p = points[i];
		const x = Array.isArray(p) ? p[0] : p.x;
		const y = Array.isArray(p) ? p[1] : p.y;
		ctx.lineTo(x, y);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.globalAlpha = 1;
}

function getBounds(points) {
	const xs = points.map(p => Array.isArray(p) ? p[0] : p.x);
	const ys = points.map(p => Array.isArray(p) ? p[1] : p.y);
	return {
		minX: Math.min(...xs),
		minY: Math.min(...ys),
		maxX: Math.max(...xs),
		maxY: Math.max(...ys)
	};
}

// ===== JSON Output =====
function updateOutput() {
	const output = {
		image: getImageForOutput(),
		walkableAreas: getWalkableAreasForOutput(),
		doors: getDoorsForOutput(),
		npcs: getNPCsForOutput(),
		startPoint: getStartPointForOutput()
	};

	document.getElementById('output').value = JSON.stringify(output, null, 2);
}

// ===== Scene Loading =====
function loadScene(sceneName) {
	if (!sceneName) {
		clearPolygons();
		return;
	}

	const sceneFile = `../absnormal/data/${sceneName}.json`;
	console.log('Loading scene from:', sceneFile);
	
	fetch(sceneFile)
		.then(response => {
			console.log('Fetch response status:', response.status);
			if (!response.ok) {
				console.log('Scene file not found, creating empty scene');
				initializeEmptyScene(sceneName);
				return Promise.reject(new Error('File not found - using empty scene'));
			}
			return response.json();
		})
		.then(data => {
			console.log('Scene data loaded:', data);
			loadSceneData(sceneName, data);
		})
		.catch(error => {
			console.warn('Error loading scene:', error.message);
			if (!error.message.includes('File not found')) {
				alert('Error loading scene: ' + error.message);
			}
		});
}

function initializeEmptyScene(sceneName) {
	console.log('Initializing empty scene:', sceneName);
	
	clearWalkableAreas();
	clearDoors();
	clearNPCs();
	clearStartPoints();
	clearBackgroundImage();
	points = [];

	document.getElementById('filename').textContent = `absnormal/data/${sceneName}.json`;
	document.getElementById('npcName').value = '';
	document.getElementById('npcType').value = '';
	document.getElementById('doorNextScene').value = '';
	
	updateOutput();
	populateFormFields();
	redraw();
	console.log('Empty scene initialized');
}

function loadSceneData(sceneName, data) {
	console.log('loadSceneData called with sceneName:', sceneName, 'data:', data);
	
	clearWalkableAreas();
	clearDoors();
	clearNPCs();
	clearStartPoints();
	clearBackgroundImage();

	// Load walkable areas
	if (data.walkableAreas && Array.isArray(data.walkableAreas)) {
		data.walkableAreas.forEach(area => {
			const points = area.points || area;
			walkableAreas.push(points);
		});
		console.log('Loaded walkable areas:', walkableAreas);
	}

	// Load doors
	if (data.doors && Array.isArray(data.doors)) {
		data.doors.forEach(door => {
			const doorPoints = door.points || door;
			doors.push({
				points: doorPoints,
				nextScene: door.nextScene || ''
			});
		});
		console.log('Loaded doors:', doors);
	}

	// Load NPCs
	if (data.npcs && Array.isArray(data.npcs)) {
		data.npcs.forEach(npc => {
			npcs.push({
				x: npc.x,
				y: npc.y,
				name: npc.name || 'NPC',
				type: npc.type || 'npc'
			});
		});
		console.log('Loaded NPCs:', npcs);
	}

	// Load start point
	if (data.startPoint) {
		if (Array.isArray(data.startPoint)) {
			startPoint = { x: data.startPoint[0], y: data.startPoint[1] };
		} else {
			startPoint = data.startPoint;
		}
		console.log('Loaded start point:', startPoint);
	}

	// Load background image if specified
	if (data.image) {
		const imageName = data.image.split('/').pop();
		currentImagePath = imageName;
		console.log('Setting currentImagePath to:', currentImagePath);
		
		const imageSelect = document.getElementById('backgroundImageSelect');
		imageSelect.value = imageName;
		console.log('Selected image in dropdown:', imageName);
		
		const img = new Image();
		img.src = `../absnormal/assets/backgrounds/${imageName}`;
		console.log('Loading background image from:', img.src);
		img.onload = () => {
			console.log('Background image loaded successfully');
			currentBackgroundImage = img;
			redraw();
		};
		img.onerror = () => {
			console.warn('Could not load background image:', imageName);
			redraw();
		};
	} else {
		console.log('No image in data');
		document.getElementById('backgroundImageSelect').value = '';
		redraw();
	}

	document.getElementById('filename').textContent = `absnormal/data/${sceneName}.json`;
	document.getElementById('npcName').value = '';
	document.getElementById('npcType').value = '';
	document.getElementById('doorNextScene').value = '';
	
	updateOutput();
	populateFormFields();
	redraw();
	console.log('Scene loaded and redrawn');
}

// ===== Clear All =====
function clearPolygons() {
	clearWalkableAreas();
	clearDoors();
	clearNPCs();
	clearStartPoints();
	clearBackgroundImage();
	points = [];
	document.getElementById('sceneSelect').value = '';
	updateOutput();
	redraw();
}

// ===== Canvas Rendering =====