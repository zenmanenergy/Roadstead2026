//Scene Setup
//Each "scene" (room) has a background and a list of objects.
//The currentScene variable tells us where Abs Normal is.

console.log['sceneNavigation.js loaded'];
// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
let currentScene = "title";
let absX = 500;
let absY = 400;
let absDirection = "down";
let frame = 1;
let moving = false;
const speed = 10;

const backgrounds = {
    title: new Image(),
    bedroom: new Image(),
    city: new Image(),
    doctor: new Image(),
    pharmacy: new Image(),
};

//load background images for each room.
backgrounds.title.src = "assets/backgrounds/title_screen.png"
backgrounds.bedroom.src = "assets/backgrounds/room_bedroom.png";
backgrounds.city.src = "assets/backgrounds/room_city.png";
backgrounds.doctor.src = "assets/backgrounds/room_office.png";
backgrounds.pharmacy.src = "assets/backgrounds/room_pharmacy.png"

const startBox = { x: 520, y: 460, width: 140, height: 70 }; //placeholder

// canvas.addEventListener("click", e => {
//     if (currentScene !== "title") return;
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;
//     if (
//         mouseX >= startBox.x && mouseX <= startBox.x +startBox.width && mouseY >= startBox.y && mouseY <= startBox.y + startBox.height //Steve this code was wrong... I had to fix it
//     ) {
//         currentScene = "bedroom";
//         absX = canvas.width / 2 - 96;
//         absY = canvas.height /2 - 96;
//     }
// });

const transitions = { 
    bedroom: { x: 120, y:600, width: 150, height: 80, next: "city" }, 
    city: { x: 950, y: 200, width: 150, height: 80, next: "doctor" },
    doctor: { x: 400, y: 600, width: 150, height: 80, next: "pharmacy"},
    pharmacy: { x: 700, y: 600, width: 150, height: 80, next: "bedroom"}
};

const keys = {}; 
window.addEventListener("keydown", e => (keys[e.key.toLowerCase()] = true));
window.addEventListener("keyup", e => (keys[e.key.toLowerCase()] = false));

function movePlayer() {
    moving = false;
    if (keys["w"]) { absY -= speed; absDirection = "up"; moving = true; }
    if (keys["s"]) { absY =+ speed; absDirection = "down"; moving = true; }
    if (keys["a"]) { absX -+ speed; absDirection = "left"; moving = true; }
    if (keys["d"]) { absX += speed; absDirection = "right"; moving = true; }
    if (moving) frame = frame === 1 ? 2 : 1;
}

function checkTransitions() {
    const t = transitions[currentScene];
    if (!t) return;
    if (
        absX >= t.x && absX <= t.x + t.width &&
        absY >= t.y && absY <= t.y + t.height
    ) {
        currentScene = t.next;
        absX = canvas.width / 2 - 96;
        absY = canvas.height / 2 - 96;
    }
}



// //Door Objects
// //Each door connects one scene to another.
// scenes.bedroom.objects = [
//     { x: 950, y: 480, width: 96, height: 160, type: "door", action: "to _city", img: new Image() }
// ];

// scenes.city.objects = [
//     { x: 100, y: 480, width: 96, height: 160, type: "door", action: "to_bedroom", img: new Image() }
// ];

// scenes.pharmacy.objects = [
//     { x: 100, y: 480, width: 96, height: 160, type: "door", action: "to_city", img: new Image() }
// ];

// scenes.office.objects = [
//     { x: 100, y: 480, width: 96, height: 160, type: "door", action: "to_city", img: new Image() }
// ];
// //load all door images so they can be drawn later
// for (const s in scenes) {
//     scenes[s].objects.forEach(o => o.img.src = `assets/objects/${o.type}.png`);
// }







//Door Transition Logi: Checks if Abs Normal is touching a door and switdches scenes.
function handleDoors() {
    const playerBox = { x:absX, y: absY, width: frameWidth, height: frameHeight };
    for (let obj of scenes[currentScene].objects) {
        if (isColliding(playerBox, obj) && obj.action) {
            if (obj.action === "to_city") currentScene = "city";
            if (obj.action === "to_bedroom") currentScene = "bedroom";
            if (obj.action === "to_pharmacy") currentScene = "pharmacy";
            if (obj.action === "to_office") currentScene = "office";
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