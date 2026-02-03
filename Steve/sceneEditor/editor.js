let canvas, ctx, image, select;
let walkablePolygons = [];
let doorPolygons = [];
let doorDestinations = {};
let startPoint = null;
let currentPolygon = [];
let currentType = 'walkable';
let selectedDoorIndex = null;
let sceneList = [];

const backgrounds = [
	'background_start.png',
	'CITY-absnormal.png',
	'room_bedroom.png',
	'room_city.png',
	'room_lab.png',
	'room_office.png',
	'room_pharmacy.png',
	'start_button.png',
	'title_screen.png'
];

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	select = document.getElementById('imageSelect');
	
	// Initialize scene list for door destinations
	sceneList = backgrounds.map(bg => bg.replace('.png', ''));
	
	backgrounds.forEach(bg => {
		const option = document.createElement('option');
		option.value = bg;
		option.textContent = bg;
		select.appendChild(option);
	});
	
	document.querySelectorAll('input[name="polygonType"]').forEach(radio => {
		radio.addEventListener('change', (e) => {
			finishPolygon();
			currentType = e.target.value;
			selectedDoorIndex = null;
			draw();
			generateJSON();
		});
	});
	
	select.addEventListener('change', (e) => {
		if (e.target.value) {
			clearPolygons();
			const filename = e.target.value.replace('.png', '.json');
			document.getElementById('filename').textContent = 'absnormal/data/' + filename;
			image = new Image();
			image.src = '../absnormal/assets/backgrounds/' + e.target.value;
			image.onload = draw;
		}
	});
	
	canvas.addEventListener('click', (e) => {
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;
		
		// If currently drawing a door polygon, add points instead of selecting
		if (currentType === 'door' && currentPolygon.length > 0) {
			currentPolygon.push([x, y]);
			draw();
			generateJSON();
			return;
		}
		
		// Check if clicking on an existing door to select it
		if (currentType === 'door') {
			for (let i = 0; i < doorPolygons.length; i++) {
				if (isPointInPolygon(x, y, doorPolygons[i])) {
					selectedDoorIndex = i;
					draw();
					return;
				}
			}
			// If we have a selected door and clicked outside it, deselect
			if (selectedDoorIndex !== null) {
				selectedDoorIndex = null;
				draw();
				return;
			}
			// Otherwise, start a new door polygon
			currentPolygon.push([x, y]);
			draw();
			generateJSON();
			return;
		}
		
		if (currentType === 'start') {
			startPoint = [x, y];
			draw();
			generateJSON();
		} else {
			currentPolygon.push([x, y]);
			draw();
			generateJSON();
		}
	});
	
	// Setup door destination UI
	setupDoorDestinationUI();
}

document.addEventListener('DOMContentLoaded', init);

function finishPolygon() {
	if (currentPolygon.length > 2) {
		if (currentType === 'walkable') {
			walkablePolygons.push(currentPolygon);
		} else if (currentType === 'door') {
			doorPolygons.push(currentPolygon);
			// Initialize door with no destination
			doorDestinations[doorPolygons.length - 1] = null;
			// Auto-select the newly created door
			selectedDoorIndex = doorPolygons.length - 1;
		}
		currentPolygon = [];
		draw();
		generateJSON();
	}
}

function clearPolygons() {
	walkablePolygons = [];
	doorPolygons = [];
	doorDestinations = {};
	startPoint = null;
	currentPolygon = [];
	selectedDoorIndex = null;
	document.getElementById('output').value = '';
	draw();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	
	walkablePolygons.forEach(poly => drawPolygon(poly, '#00ff00'));
	doorPolygons.forEach((poly, i) => {
		const isSelected = i === selectedDoorIndex;
		drawPolygon(poly, isSelected ? '#ffcc00' : '#ff0000');
	});
	drawPolygon(currentPolygon, currentType === 'walkable' ? '#ffff00' : '#ff6600');
	
	if (startPoint) {
		ctx.fillStyle = '#00ccff';
		ctx.beginPath();
		ctx.arc(startPoint[0], startPoint[1], 8, 0, Math.PI * 2);
		ctx.fill();
	}
	
	// Update door UI visibility
	updateDoorUI();
}

function drawPolygon(points, color) {
	if (points.length === 0) return;
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	points.forEach(p => ctx.lineTo(p[0], p[1]));
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = color + '33';
	ctx.fill();
	points.forEach(p => {
		ctx.fillStyle = color;
		ctx.fillRect(p[0] - 3, p[1] - 3, 6, 6);
	});
}

function generateJSON() {
	const allWalkable = [...walkablePolygons, ...(currentType === 'walkable' ? [currentPolygon] : [])].filter(p => p.length > 0);
	const allDoors = [...doorPolygons, ...(currentType === 'door' ? [currentPolygon] : [])].filter(p => p.length > 0);
	const data = {
		image: 'assets/backgrounds/' + document.getElementById('imageSelect').value,
		walkableAreas: allWalkable.map(poly => ({ points: poly })),
		doors: allDoors.map((poly, i) => ({ 
			points: poly,
			destination: doorDestinations[i] || null
		})),
		startPoint: startPoint
	};
	const json = JSON.stringify(data, null, 2);
	document.getElementById('output').value = json;
}

function isPointInPolygon(x, y, polygon) {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i][0], yi = polygon[i][1];
		const xj = polygon[j][0], yj = polygon[j][1];
		const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}
	return inside;
}

function setupDoorDestinationUI() {
	const controlsDiv = document.getElementById('controls');
	let destinationUI = document.getElementById('doorDestinationUI');
	
	if (!destinationUI) {
		destinationUI = document.createElement('div');
		destinationUI.id = 'doorDestinationUI';
		destinationUI.style.cssText = 'display: none; gap: 10px; align-items: center; padding: 10px; background: #333; border-radius: 4px; margin-top: 10px;';
		destinationUI.innerHTML = `
			<span>Selected Door Destination:</span>
			<select id="doorDestinationSelect">
				<option value="">None</option>
			</select>
		`;
		controlsDiv.appendChild(destinationUI);
		
		// Populate destination options
		sceneList.forEach(scene => {
			const option = document.createElement('option');
			option.value = scene;
			option.textContent = scene;
			document.getElementById('doorDestinationSelect').appendChild(option);
		});
		
		document.getElementById('doorDestinationSelect').addEventListener('change', (e) => {
			if (selectedDoorIndex !== null) {
				doorDestinations[selectedDoorIndex] = e.target.value || null;
				generateJSON();
			}
		});
	}
}

function updateDoorUI() {
	const ui = document.getElementById('doorDestinationUI');
	const select = document.getElementById('doorDestinationSelect');
	const finishBtn = document.getElementById('finishDoorBtn');
	
	// Show finish button when drawing a door
	if (currentType === 'door' && currentPolygon.length > 0) {
		finishBtn.style.display = 'inline-block';
	} else {
		finishBtn.style.display = 'none';
	}
	
	// Show destination UI when a door is selected
	if (selectedDoorIndex !== null && currentType === 'door') {
		ui.style.display = 'flex';
		select.value = doorDestinations[selectedDoorIndex] || '';
	} else {
		ui.style.display = 'none';
	}
}