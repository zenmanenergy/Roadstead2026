const scenes = [
    'bedroom',
    'room_lab',
    'room_city_0',
    'room_city_1',
    'room_doctor',
    'room_pharmacy',
    'CITY-absnormal'
];

let sceneData = {};
let currentScene = "title";

async function loadSceneData() {
    const fileMap = {
        'bedroom' : 'bedroom',
        'lab': 'room_lab',
        'city_0': 'room_city_0',
        'city_1': 'room_city_1',
        'doctor': 'room_doctor',
        'pharmaacy': 'room_pharmacy',
    }
    for (const sceneName of scenes) { 
        const fileName = fileMap[sceneName];
        const response= await fetch('/Steve/absnormal/data/${filename}.json');

        if (response.ok) {
            sceneData[sceneName] = await response.json();
            if (sceneData[sceneName].items){
              sceneData[sceneName].items.forEach(item => {
                if (item.ingameImage) {
                    const img= new Image();
                    img.src = 'assets/items/ingame/${item.ingameImage}';
                    item.imageObj = img;
                }
              })  
            }
        }  

    }
   



function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i <polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect = (yi > point[1]) !== (yj > point[1]) && 
        point [0] < (xj-xi) * (point[1] - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

function canMoveTo(newX, newY, width, height) {
    const feet= HITBOX.getfeet(newX, newY); 
    if (!sceneData[currentScene] || !sceneData[currentScene].walkableAreas0) {
        return true;
    }
   
    }

    const centerX = newX + width / 2;
    const centerY = newY + height / 2;

    for (const area of sceneData[currentScene].walkableAreas) {
        if (isPointInPolygon([centerX, centerY], area.points)) {
            return true;
        }
    }
    return false;
}

