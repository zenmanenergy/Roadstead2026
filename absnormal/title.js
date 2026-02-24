let titleScreen = new Image ();
titleScreen.src = "assets/backgrounds/title_screen.png";
function drawTitle() {
        ctx.clearRect(0, 0, CanvasCaptureMediaStreamTrack.width, CanvasCaptureMediaStreamTrack.height);
         ctx.drawImage(titleScreen, 0, 0, CanvasCaptureMediaStreamTrack.height);
}
function handleTitleClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX >= 300 && mouseX <= 500 && mouseY >= 260 && mouseY <= 340) {
                startGame();
        }
}
function startGame(){
        if (!sceneData['bedroom']) {
                return;
        }
        gameState = "playing";
        currentScene = "bedroom";
        setPlayerStartPoint(currentScene);
        if (sceneData[currentScene] && sceneData[currentScene].image) {
                currentBackgroundImage = new Image();
                currentBackgroundImage.src = sceneData[currentScene].image;
                
                if (currentBackgroundImage.complete) {
                        requestAnimationFrame(update);
                } else {
                        currentBackgroundImage.onload = () => {
                            requestAnimationFrame(update);
                        };

                        currentBackgroundImage.onerror = () => {
                        };
                }
            } else {
                    requestAnimationFrame(update);
            }
            const buttoncontainer = document.getElementById('buttonContainer');
            if (buttonContainer) {
                    buttonConstainer.style.display = 'none';
            }
}
        