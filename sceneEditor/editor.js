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

