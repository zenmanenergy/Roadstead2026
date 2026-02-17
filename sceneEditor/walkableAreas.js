// Walkable areas tab module 

let walkableareas = [];

function finishwalkablepolygon(points) {
	if (points.length < 3) {
		alert('need at least 3 points for a polygon') ;
		return false; 
	}
	walkableareas.push([...points]);
	return true;
}

function deletewalkablearea(index) {
	walkableareas.splice(index, 1); 
	updateoutput();
	populateformfields();
	redraw();
}

function populatewalkableareaspanel() {
	const walkablecontainer = document.getElementById('walkableareascontainer');
	const walkablelist = document.getelementbyID('walkablelist');
}
function populateWalkableAreasPanel() {
	const walkableContainer = document.getElementById('walkableListContainer');
	const walkableList = document.getElementById('walkableList');
	if (walkableareas.length > 0) { 
		const walkablecontainer = document.getElementById('walkableareascontainer');
		walkablecontainer.style.display = 'block';
		const walkablelist = document.getElementById('walkablelist');
		walkablelist.innerHTML = walkableareas.map((area, index) => `
		<div style="padding: 8px; background: #2d2d30; margin-bottom: 6px; border-radius: 3px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
				<div>
					<div><strong>Walkable Area ${index + 1}</strong></div>
					<div>Points: ${area.length}</div>
				</div>
				<button onclick="deleteWalkableArea(${index})" style="padding: 4px 8px; font-size: 10px; background: #d13438; color: white; border: none; border-radius: 2px; cursor: pointer;">Delete</button>
			</div>
		`).join('');
	} else {
		walkablecontainer.style.display = 'none';
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
