// startPoint = null;

 let startPoint = null;

function placeStartPoint(x, y) {
	startPoint = { x, y };
	updateOutput();
	redraw();
}
function clearStartPoint(){
	startpoint = null;
	updateoutput();
	redraw();
}

function populateStartPointPanel() {
	// Start point is shown on the canvas, no list needed
	// This function is called for consistency with other modules
}

function clearStartPoints() {
	startpoint = null;
}

function getStartPointForOutput() {
	return startpoint ? [startpoint.x, startpoint.y] : null; 
}