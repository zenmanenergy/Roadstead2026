//story variables: track whether player has picked up key items.
let hasPrescription = false;
let hasPills = false;

scenes.bedcroom.objects.push({
    x: 450, y: 520, width: 64, height: 64,
    type: "prescription", action: "pickup", img: new Image()
});

scenes.pharmacy.objects.push({
    x: 600, y: 520, width: 64, height: 64,
    type: "pills", action: "pickup", img: new Image()
});

for (const s in scenes) {
    scenes[s].objects.forEach(o => {
        if (!o.img.src) o.img.src = `assets/objects/${o.type}.png`;
    });
}
function handlePickups() {
    const playerBox = { x: absX, y: absY, width: frameWidth, height: frameHeight };

    for (let obj of scenes[currentScene].objects) {
        if (isColliding(playerBox, obj) && obj.action === "pickup") {
            if (obj.type === "prescription" && !hasPrescription) {
                hasPrescription = true;
                showMessage("Pickuped up the prescription!");
                removeObject(currentScene, obj);
            }
            if (obj.type === "pills" && hasPrescription && !hasPills) {
                hasPills = true;
                showMessage("You received the pills...Something feels strange, almost...abnormal.");
                removeObject(currentScene, obj);
            }
            break; //handle one object per frame
        }
    }
}
function removeObject(sceneName, obj) {
    const list = scenes[sceneName].objects;
    const i = list.indexOf(obj);
    if (i > -1) list.splice(i, 1);
}