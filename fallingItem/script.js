let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "#EEE6ED";
let ctx = canvas.getContext('2d');

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

var mouse = {
    x:innerWidth/2,
    y:innerHeight/2
}

let colorArray = ['#F6C5C0','#B1A692','#B4BABA','#F2F2F2', '#C1A29B'];
function Ball(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
}

let gravity = 1;
let friction = 0.70;

Ball.prototype.update = function() {
    console.log(this.dy);
    if(this.y + this.radius + this.dy > canvas.height) {
        this.dy = -this.dy*friction;
    } else {
        this.dy += gravity;
    }
    
    if(this.x+this.radius>innerWidth || this.x-this.radius < 0) {
        this.dx = -this.dx;
    }
    this.y += this.dy;

    if(this.dy.toFixed(3) === '0.000' || this.dy.toFixed(3) ==='-0.000') {
        this.dx = 0;
    }
    this.x += this.dx;
}

function getRandomIntRange(min, max) {
    return Math.random() * (max - min) + min;
}

let ballArray = [];
let ball;
function init() {
    for(let i=0; i<50; i++) {
        let radius = getRandomIntRange(10, 30);
        let x = getRandomIntRange(radius*2, innerWidth);
        let y = getRandomIntRange(radius,innerHeight/3);
        let dx = getRandomIntRange(-2, 2);
        let dy = getRandomIntRange(0,10);
        ball = new Ball(x,y,dx,dy,radius);
        if(i==39) ball.color = "gold";
        ballArray.push(ball);
    }
}

let rafId = 0;

function animate() {
    requestAnimationFrame(animate);
    rafId++;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    ballArray.forEach(ball => {
        ball.draw();
        ball.update();
    })
}

let play = document.getElementById("play");
play.addEventListener("click", () => {
    cancelAnimationFrame(rafId);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    ballArray = [];
    init();
    animate();
})

let pause = document.getElementById("pause");
pause.addEventListener("click", () => {
    if(pause.innerHTML === "Pause!") {
        pause.innerHTML = "Restart!";
        cancelAnimationFrame(rafId);
    } else {
        pause.innerHTML = "Pause!";
        cancelAnimationFrame(rafId);
        animate();
    }
})
