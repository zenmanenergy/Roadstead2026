//Scene Setup
//Each "scene" (room) has a background and a list of objects.
//The currentScene variable tells us where Abs Normal is.
let currentScene = "bedroom";

const scenes = {
    bedroom: { background: new Image(), objects: [] },
    city: { background: new Image(), objects: [] },
    pharmacy: { background: new Image(), objects: [] },
};

//load background images for each room.
scenes.bedroom.background.src = "assets/backgrounds/room_bedroom.png"
scenes.city.background.src = "assets/backgrounds/room_city.png";
scenes.pharmacy.background.src = "assets/backgrounds/room_pharmacy.png";

//Door Objects
//Each door connects one scene to another.
scenes.bedroom.objects = [
    { x: 950, y: 480, width: 96, height: 160, type: "door", action: "to _city", img: new Image() }
];

scenes.city.objects = [
    { x: 100, y: 480, width: 96, height: 160, type: "door", action: "to_bedroom", img: new Image() }
];

scenes.pharmacy.objects = [
    { x: 100, y: 480, width: 96, height: 160, type: "door", action: "to_city", img: new Image() }
];
//load all door images so they can be drawn later
for (const s in scenes) {
    scenes[s].objects.forEach(o => o.img.src = `assets/objects/${o.type}.png`);
}
//Door Transition Logi: Checks if Abs Normal is touching a door and switdches scenes.
function handleDoors() {
    const playerBox = { x:absX, y: absY, width: frameWidth, height: frameHeight };
    for (let obj of scenes[currentScene].objects) {
        if (isColliding(playerBox, obj) && obj.action) {
            if (obj.action === "to_city") currentScene = "city";
            if (obj.action === "to_bedroom") currentScene = "bedroom";
            if (obj.action === "to_pharmacy") currentScene = "pharmacy";
            //reset player pos so they appear at the entrance
            absX = 150;
            absY = 420;
            break;
        }
    }
}
//scene drawing
function drawScene() {
    const scene = scenes [currentScene];
    ctx.drawImage(scene.background, 0, 0, canvas.width, canvas.height);
    scene.objects.forEach(obj => {
        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    });
}