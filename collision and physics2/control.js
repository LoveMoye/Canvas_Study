let s = new Square(ctx, 200, 10, 90, 35, 10, 0, 0, 1);
// let t = new Square(ctx, 100, 120, 90, 35, 0, 0, 0,1);
let circle = new Circle(ctx, 0, 0, 10, 0, 0, 0);

let animeObject = [];
let n=2;
function createWorld() {
    let s;
    for(let i=0; i<n; i++) {
        s = new Square(ctx, 200 + (100 * i), 200 + (10*i), 90, 35, 0, 0, 0, 1);
        animeObject.push(s);
    }
}

function rectCollide() {
    let obj1, obj2;

    for(let i=0; i<n; i++) {
        obj1 = animeObject[i];
        
        for(let j=0; j<n; j++) {
            obj2 = animeObject[j];
            if(obj1.squareEdgeIntersect(obj2) && i !== j) {
                obj1.collisionWithRect(obj2);
            }
        }
    }
}

function animate() {
    animeObject.forEach(obj => {
        obj.update();
    })

    animeObject.forEach(obj => {
        obj.bounce();
    })

    circle.mouseMove();

    animeObject.forEach(obj => {
        obj.collisionWithCircle(circle);
    })

    animeObject.forEach(obj => {
        obj.collideOverWall();
    })

    rectCollide();
    
    clearCanvas();

    animeObject.forEach(obj => {
        obj.draw();
        obj.vertexDraw();
    })
    
    circle.draw();
    rafId = window.requestAnimationFrame(animate);
}

let rafId = 0;

let playButton = document.getElementById('play');
playButton.addEventListener('click', e => {
    play = true;
    cancelAnimationFrame(rafId);
    animeObject = [];
    createWorld();
    animate();

    isStop = false;
    stopButton.innerHTML = "Stop!";
})


let stopButton = document.getElementById("stop");
let play = false;
let isStop = false;
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
