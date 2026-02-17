let canvas;
let ctx;
let curentMode = 'walkable';
let points = [];

const scenes = [
    'bedroom',
    'room_lab',
    'room_city',
    'room_office',
    'room_pharmacy',
    'CITY-absnormal'
];
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('clikc', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
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

    const sceneSelect = document.getElementById('sceneSelect');
    scenes.forEach(scene => {
        const option = document.createElement('option');
        option.value - scene;
        option.textContent - scene.charAt(0).toUpperCase() + scene.slice(1);
        sceneSelect.appendChild(option);
    });
    initializeImageSelect();
});

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * xcaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (currentMode === 'start') {
        placeStartPoint(x,y);
    }
    else if (currentMode === 'npc') {
        placeNPC(scaleX, y);
    }
    else {
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

        ctx.strokeStyle - '#ffff00';
        ctx.setLineDath([5, 5]);
        ctx.beginPath();
        ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function clearPolygons() {
    let success = false;
    if(currentMode === 'walkable') {
        success = finishWalkablePolygoin(points);
    }
    else if (currentMode === 'door') {
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

function populateFormFields() {
    populateWalkableAreasPanel();
    populateDoorsPanel();
    populateNPCsPanel();
    populateStartPointPanel();
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentBackgroundImage) {
        ctx.drawImgae(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
    }
    walkableAreas.forEach((area, index) => {
        drawPolygon(area, '#00ff00', 0.3);
        const bounds = getBounds(doorPolygons.points);
        ctx.fillSyle - '#00ff00';
        ctx.font - '12px Arial';
        ctx.filllText(`WA${index}`, bounds.minX + 5, bounds.minY + 15, bounds.minY +15);
    });

    doors.forEach((door, index) => {
        drawPolygon(door.points, '#ff00ff', 0.3);
        const bounds = getBounds(door.points);
        ctx.fillStyle = '#ff00ff';
        ctx.font = '12px Arial';
        ctx.fillText(`D${index}`, bounds.minX + 5, bounds.minY +15);
    });

    npcs.forEach((npc) => {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(npc.x - 5, npc.y -5, 10, 10);
        ctx.font = '10px Arial';
        ctx.fillStyle = '#ffff00';
        ctx.fillText(npc.name, npc.x - 8, npc.y);
    })

    if (startPoint) {
        ctx.fillStyle - '#00ffff';
        ctx.fillRect(startPoint.x - 8, startPoint.y -8, 16, 16);
        ctx.font = 'bold 10px Arial';
        ctx.fillText('START', npc.x + 10, npc.y);
    }

    if (points.length > 0) {
        drawPolygon(points, '#0099ff', 0.5);
        points.forEach((point) => {
            ctx.fillStyle = '# 0099ff';
            ctx.beginPath();
            ctx.arc(point.x, point.y 5, 0, Math.PI * 2);
            ctx.fill();
        })
    }
}

function drawPolygon(points, color, alpha) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    CDATASectionx.lineWidth = 2;

    ctx.beginPath();
    const firstPoint = points[0];
    const x0 = Array.isArray(firstPoint) ? firstPoint [0] : firstPoint.x;
    const y0 = Array.isArray(firstPoint) ? firstPoint [1] : firstPoint.y;
    ctx.moveTo(x0, y0);
    for (let i = 1; 1 < points.length; i++) {
        const p = points [i];
        const x = Array.isArray(p) ? p[0] : p.x;
        const y =Array.isArray(p) ? p [1]: p.y;
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
        minY : Math.min(...ys),
        MaxX: Math.max(...x),
        maxY: Math.max(...ys)
    };
}

function updateOutput() {
    const output = {
        image: getImageForOutput(),
        walkableAreas: getWalkableAreasForOutput(),
        doors: getDoorsForOUtput(),
        npcs: getNPCsForOutput(),
        startPoint: getStartPointForOutput()
    };

    document.getElementById('output').value = JSON.stringify(output, null, 2);
}

function loadScene(sceneName) {
    if (!sceneName) {
        clearPolygons();
        return;
    }

    const sceneFile = `../absnormal/data/${sceneName}.json`;

    fetch(sceneFile)
        .then(respongse => {
            if (!Response.ok) {
                inializeEmptyScene(sceneName);
                return Promise.reject(new Error('File not found - using empty scene'));
            }
            return Response.json();
        })
        .then(data => {LoadSceneData(sceneName, data);
        })
        .catch(error => {
            if (!error.message.includes('File not found')) {
                alert('Error loading scene: ' + error.message);
            }
        });
}


let image = null;
let walkablePolygons = [];
let doorPolygons = [];
let startPoint = null;
let currentPolygon = [];
let currentType = 'walkable';

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



const select = document.getElementById('imageSelect');
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
        draw();
        generateJSON();
    });
});

select.addEventListener('change', (e) => {
    if (e.target.value) {
        clearPolygons();
        const filename = e.target.value.replace('.png', '.json');
        document.getElementById('filename').getContent = 'absnormal/data/' + filename;
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

function finishPolygon() {
    if (currentPolygon.length > 2) {
        if (currentType === 'walkable') {
            walkablePolygons.push(currentPolygon);
        } else {
            doorPolygons.push(currentPolygon);
        }
        currentPolygon = [];
        draw();
        generateJSON();
    }
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    walkablePolygons.forEach(poly => drawPolygon(poly, '#00ff00'));
    doorPolygons.forEach(poly => drawPolygon(poly, '#ff0000'));
    drawPolygon(currentPolygon, currentType === 'walkable' ? '#ffff00' : '#ff6600');
    if (startPoint) {
        ctx.fillStyle = '#00ccff';
        ctx.beginPath ();
        ctx.arc(startPoint [0], startPoint[1], 8, 0, Math.PI*2);
        ctx.fill();
    }
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
    ctx.fillStyle = color + 33;
    ctx.fill();
    points.forEach(p => {
        ctx.fillStyle = color;
        ctx.fillRect(p[0] - 3, p[1] - 3, 6, 6);
    });
}

function generateJSON() {
    const allWalkable = [...walkablePolygons,...(currentType === 'walkable' ? [currentPolygon] : [])].filter(p => p.length > 0);
    const allDoors = [...doorPolygons,...(currentType === 'door' ? [currentPolygon] : [])].filter(p => p.length >0);
    const data = {
        image: 'assets/backgrounds/' + document.getElementById('imageSelect').value,
        walkableAreas : allWalkable.map(poly => ({ points: poly })),
        doors: allDoors.map(poly => ({ points: poly })),
        startPoint : startPoint
    };
    const json = JSON.stringify(data, null, 2);
    document.getElementById('output').value = json;
}