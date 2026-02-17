//doors

let doors = [];

function finishDoorPolygon(points){
    if(points.length<3){
        alert('Need at least 3 points for polygon');
        return false;
    }
    const nextScene = document.getElementById('doorNextScene').value;
    if(!nextScene) {
        alert('Please select next scene');
        return false;
    }
    doors.push({
        points: [...points],
        nextScene: nextScene
    });

    return true;
}

function deleteDoor(index) {
    doors.splice(index, 1);
    updateOutput();
    populateFormFeilds();
    redraw();
}

function populateDoorsPanel() {
    const doorsContainer = document.getElementById('doorsListContainer');
    const doorsList = document.getElementById('doorsList');

    if (doors.length > 0) {
        doorsContainer.style.display = 'block';
        doorsList.innerHTML = doors.map((door, index) => `
            <div style="padding: 8px; background: #2d2d30; margin-bottom: 6px; border-radius: 3px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
                <div><strong>Door ${index + 1}</strong></div>
                <div>Next Scene: <span style="color: #4ec9b0;">${door.nextScene || '(not set)'}</span></div>
                <div>Points: ${door.points.length}</div>
                <button onclick="deleteDoor(${index})" style="padding: 4px 8px; font-size: 10px; background: #d13438; color: white; border: none; border-radius: 2px; cursor: pointer;">
                    Delete
                </button>
            </div>
        `).join('');
    } else {
        doorsContainer.style.display = 'none';
    }
}

function clearDoors() {
    doors = [];
}

function getDoorsForOutput() {
    return doors.map(door => ({
        points: door.points.map(p => Array.isArray(p) ? [p[0], p[1]] : [p.x, p.y]),
        nextScene: door.nextScene
    }));
}