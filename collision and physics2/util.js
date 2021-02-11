let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

function canvasInit() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = "#51F2F1";
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

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function pointLineDist(x1, y1, x2, y2, cx, cy) {
    let len = dist(x1, y1, x2, y2);
    let u = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / (len*len);
    let closestX = x1 + (u * (x2 - x1));
    let closestY = y1 + (u * (y2 - y1));
    return dist(cx, cy, closestX, closestY);
}

function rotation(cx, cy, x, y, d, reverse = false) {
    // d is degree 
    let rx, ry;
    if(reverse) {
        rx = Math.cos(-Math.PI/180*d)*(x-cx) - Math.sin(-Math.PI/180*d)*(y-cy) + cx;
        ry = Math.sin(-Math.PI/180*d)*(x-cx) + Math.cos(-Math.PI/180*d)*(y-cy) + cy;
    } else {
        rx = Math.cos(Math.PI/180*d)*(x-cx) - Math.sin(Math.PI/180*d)*(y-cy) + cx;
        ry = Math.sin(Math.PI/180*d)*(x-cx) + Math.cos(Math.PI/180*d)*(y-cy) + cy;
    }
    return {x: rx, y: ry};
}