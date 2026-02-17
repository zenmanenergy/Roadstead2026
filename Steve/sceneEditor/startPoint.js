// Start Point Tab Module

let startPoint = null;

function placeStartPoint(x, y) {
	startPoint = { x, y };
	updateOutput();
	redraw();
}
	
function clearStartPoint() {
	startPoint = null;
	updateOutput();
	redraw();
}

function populateStartPointPanel() {
	// Start point is shown on the canvas, no list needed
	// This function is called for consistency with other modules
}

function clearStartPoints() {
	startPoint = null;
}

function getStartPointForOutput() {
	return startPoint ? [startPoint.x, startPoint.y] : null;
}
