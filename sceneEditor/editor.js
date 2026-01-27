const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = null;
let walkablePolygons = [];
let doorPolygons = [];
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
    currentPolygon.push([x, y]);
    draw();
    generateJSON();    
});

function finishPolygon() {
    if (currentPolygon.length > 2) {
        if (currentType === 'walkable') {
            walkablePolygons.push(currentPolygon);
        } else {
            doorPolygons.push(current.Polygon);
        }
        currentPolygon = [];
        draw();
        generateJSON();
    }
}

function clearPolygons() {
    walkablePolygons = [];
    doorPolygons = [];
    currentPolygon = [];
    document.getElementById('output').value = '';
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    walkablePolygons.forEach(poly => drawPolygon(poly, '#00ff00'));
    doorPolygons.forEach(poly => drawPolygon(poly, '#ff0000'));
    drawPolygon(currentPolygon, currentType === 'walkable' ? '#ffff00' : '#ff6600');
}

function drawPolygon(points, color) {
    if (points.length)
}