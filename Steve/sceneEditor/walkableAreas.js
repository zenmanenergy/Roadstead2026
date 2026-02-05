// Walkable Areas Tab Module

let walkableAreas = [];

function finishWalkablePolygon(points) {
	if (points.length < 3) {
		alert('Need at least 3 points for a polygon');
		return false;
	}

	walkableAreas.push([...points]);
	return true;
}

function deleteWalkableArea(index) {
	walkableAreas.splice(index, 1);
	updateOutput();
	populateFormFields();
	redraw();
}

function populateWalkableAreasPanel() {
	const walkableContainer = document.getElementById('walkableListContainer');
	const walkableList = document.getElementById('walkableList');
	
	if (walkableAreas.length > 0) {
		walkableContainer.style.display = 'block';
		walkableList.innerHTML = walkableAreas.map((area, index) => `
			<div style="padding: 8px; background: #2d2d30; margin-bottom: 6px; border-radius: 3px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
				<div>
					<div><strong>Walkable Area ${index + 1}</strong></div>
					<div>Points: ${area.length}</div>
				</div>
				<button onclick="deleteWalkableArea(${index})" style="padding: 4px 8px; font-size: 10px; background: #d13438; color: white; border: none; border-radius: 2px; cursor: pointer;">Delete</button>
			</div>
		`).join('');
	} else {
		walkableContainer.style.display = 'none';
	}
}

function clearWalkableAreas() {
	walkableAreas = [];
}

function getWalkableAreasForOutput() {
	return walkableAreas.map(area => ({
		points: area.map(p => Array.isArray(p) ? [p[0], p[1]] : [p.x, p.y])
	}));
}
