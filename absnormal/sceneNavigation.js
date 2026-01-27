//Scene Setup
//Each "scene" (room) has a background and a list of objects.
//The currentScene variable tells us where Abs Normal is.

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './styles.css';

// import React, { useState } from 'react';
// import './style.css'; 

console.log('sceneNavigation.js loaded');
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
    lab: new Image(),
};

//load background images for each room.
backgrounds.title.src = "assets/backgrounds/title_screen.png"
backgrounds.bedroom.src = "assets/backgrounds/room_bedroom.png";
backgrounds.city.src = "assets/backgrounds/room_city.png";
backgrounds.doctor.src = "assets/backgrounds/room_office.png";
backgrounds.pharmacy.src = "assets/backgrounds/room_pharmacy.png"
backgrounds.lab.src = "assets/backgrounds/room_lab.png"

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
    if (keys["s"]) { absY += speed; absDirection = "down"; moving = true; }
    if (keys["a"]) { absX -= speed; absDirection = "left"; moving = true; }
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



//Door Objects
//Each door connects one scene to another.
// scenes.bedroom.objects = [
//     { x: 544, y: 288, width: 96, height: 160, type: "door", action: "to _city", img: new Image(assets/backgrounds/CITY-absnormal.png) }
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

// const App = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleDoor = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <div>
//             <div className="door-container">
//                 <div className={`door ${isOpen ? 'open' : ''}`}></div>
//             </div>
//             <button onClick={toggleDoor}>
//                 {isOpen ? 'Close Door' : 'Open Door'}
//             </button>
//         </div>
//     );
// };
// export default App;

const doorFrames = [];
for (let i = 1; i <=6; i++) {
    const img = new Image();
    img.src = `assets/backgrounds/door_frames/door_frame_${i}.png`;
    doorFrames.push(img);
}

// const door = document.getElementById("door");
const door = {
    x:547,
    y:194,
    width: 261,
    height:266,
    currentFrame: 0,
    isAnimating: false
}

function isNearDoor() {
    return currentScene === "bedroom" &&
           absX + 96 > door.x && absX < door.x + door.width &&
           absY + 96 > door.y && absY < door.y + door.height;
}


function animateDoor() {
    door.isAnimating = true;
    door.currentFrame = 0;
    
    const interval = setInterval(() => {
        door.currentFrame++;
        if (door.currentFrame >= doorFrames.length) {
            clearInterval(interval);
            door.isAnimating = false;
            currentScene = "lab";
            absX = canvas.width / 2 - 96;
            absY = canvas.height / 2 - 96;
        }
    }, 100);
}

function checkDoor() {
    if (isNearDoor() && !door.isAnimating) {
        animateDoor();
    }
}

// const button = document.getElementById("interactButton");

// let isOpen = false;
// let currentFrame = 0;
// let animationInterval;

// button.addEventListener("click", function () { // Fixed: Added closing quote and brackets
//     if (!isOpen) {
//         currentFrame = 0;
//         button.disabled = true; // Disable button during animation

//         animationInterval = setInterval(() => { // Fixed: Syntax for setInterval
//             if (currentFrame < doorFrames.length) {
//                 door.src = doorFrames[currentFrame];
//                 currentFrame++;
//             } else {
//                 clearInterval(animationInterval);
//                 button.textContent = 'Close Door'; // Change button text
//                 isOpen = true;
//                 button.disabled = false; // Re-enable button
//             }
//         }, 100); // Change frame every 100ms
//     } else {
//         // Optional logic for closing the door (if desired)
//     }
// });