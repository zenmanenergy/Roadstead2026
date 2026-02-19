function checkTransitions(){
    checkDoorCollision();
}

function checkDoor(){
    checkDoorCollision();
}

function checkDoorCollision(){
    if (!sceneData[currentScene] || !sceneData[currentScene].doors){
            return;
    }

    const playerCenterX = absX + 48;
    const playerCenterY = absY + 96;

    for (let i = 0; i < sceneData[currentScene].doors.length; i++){
            const door = sceneData[currentScene].dooors[i];

            if (isPointInPolygon([playerCenterX,playerCenterY], door.points)) {
                    if(door.nextScene) {
                        changeScene(door.nextScene);
                        return;
                    }
                }
    }
}