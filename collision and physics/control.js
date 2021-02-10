let play = false;

let playButton = document.getElementById("play");
let stopButton = document.getElementById("stop");
let isStop = false;

playButton.addEventListener("click", () => {
    play = true;
    cancelAnimationFrame(rafId);
    gameObjects = [];
    createWorld();
    animate();

    isStop = false;
    stopButton.innerHTML = "Stop!";
})

stopButton.addEventListener("click", () => {
    if(!isStop && play) {
        cancelAnimationFrame(rafId);
        stopButton.innerHTML = "Restart!";
        isStop = !isStop;
        play = !play;
    } else if(isStop && !play){
        animate();
        stopButton.innerHTML = "Stop!";
        isStop = !isStop;
        play = !play;
    }
})