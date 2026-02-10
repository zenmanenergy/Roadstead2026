// startPoint = null;
        startpoint = { x, y };
 
function clearstartpoint(){
    startpoint = null;
    updateoutput();
    redraw();
}

function populatestartpointpanel() {
    // Start point is shown on the canvas, no list needed
    // This function is called for consistency with other modules
}

function clearstartpoint() {
    startpoint = null;
}

function getstartpointforoutput() {
    return startpoint ? [startpoint.x, startpoint.y] : null; 
}