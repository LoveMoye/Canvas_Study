let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

function canvasInit() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = "#911211";
}

function clearCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

window.onload = canvasInit();

window.addEventListener('resize', () => {
    canvasInit();
})


function getRandomNumberRange(min, max) {
    return Math.random() * (max - min) + min;
}