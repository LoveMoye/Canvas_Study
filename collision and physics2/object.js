class CanvasObject {
    constructor(ctx, x, y, dx, dy, speed) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;

        this.isColliding = false;
    }

    distance(x, y) {

    }
}

class Square extends CanvasObject {

    static colors = ['#FFEEE4', '#F17F42', '#CE6D39', '#101010'];
    static opacity = 'FF';
    static restitution = 0.1;
    static gravity = 0.1; 

    constructor(ctx, x, y, w, h, a, dx, dy, speed) {
        super(ctx, x, y, dx, dy, speed);
        this.w = w;
        this.h = h;
        if(a < 0) {
            this.a = (360-a)%360;
        } else {
            this.a = a%360;
        }

        this.coordinate = {
            x1: this.x,
            y1: this.y,
            x2: this.x + this.w*Math.cos(Math.PI/180*this.a),
            y2: this.y + this.w*Math.sin(Math.PI/180*this.a),
            x3: this.x + this.w*Math.cos(Math.PI/180*this.a) - this.h*Math.sin(Math.PI/180*this.a),
            y3: this.y + this.w*Math.cos(Math.PI/180*this.a) + this.h*Math.sin(Math.PI/180*this.a),
            x4: this.x - this.h*Math.sin(Math.PI/180*this.a),
            y4: this.y + this.h*Math.cos(Math.PI/180*this.a)
        }
        this.color = Square.colors[parseInt(getRandomNumberRange(0,3))]+Square.opacity;
    }

    getBottom() {
        if(this.a >= 180 && this.a <= 270) {
            return this.y;
        } else if (this.a >= 0 && this.a < 90) {
            return this.y + this.h * Math.cos(Math.PI/180*this.a) + this.w * Math.sin((Math.PI/180)*this.a);
        } else if (this.a >= 90 && this.a < 180) {
            return this.y + this.w*Math.sin(Math.PI/180*this.a);
        } else {
            return this.y + this.h*Math.cos(Math.PI/180*this.a);
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((Math.PI/180)*this.a);
        this.ctx.fillRect(0, 0, this.w, this.h); 
        this.ctx.restore();
    }

    update() {
        this.x += this.dx; // dx만큼 이동
        this.y += this.dy; // dy만큼 이동
        this.a = this.a%360; // 각도 360도 내 범위로 변경

        this.coordinate.x1 = this.x;
        this.coordinate.y1 = this.y;
        this.coordinate.x2 = this.x + this.w*Math.cos(Math.PI/180*this.a);
        this.coordinate.y2 = this.y + this.w*Math.sin(Math.PI/180*this.a);
        this.coordinate.y3 = this.y + this.w*Math.cos(Math.PI/180*this.a) + this.h*Math.sin(Math.PI/180*this.a);
        this.coordinate.x3 = this.x + this.w*Math.cos(Math.PI/180*this.a) - this.h*Math.sin(Math.PI/180*this.a);
        this.coordinate.x4 = this.x - this.h*Math.sin(Math.PI/180*this.a);
        this.coordinate.y4 = this.y + this.w*Math.sin(Math.PI/180*this.a);
    }

    bounce() {
        if(this.getBottom()+this.dy+5 > window.innerHeight) {
            this.dx *= Square.restitution;
            this.dy = -this.dy*Square.restitution;
        } else {
            this.dy += Square.gravity;
        }
    }

    nonBounce() {
        if(this.getBottom()+this.dy+5> window.innerHeight) {
            this.dx *= Square.restitution;
            this.dy = 0;
        } else {
            this.dy += Square.gravity;
        }
    }

    circleIntersect(obj) {
        let cx = obj.x, cy = obj.y;
        let testX = cx, testY = cy;
        let distX, distY, distance;
        if(cx < this.x) {
            // left edge
            testX = this.x;
        } else if (cx > this.x+this.w) {
            // right edge
            testX = this.x+this.w;
        }

        if(cy < this.y) {
            // top edge
            testY = this.y;
        } else if (cy > this.y+this.h) {
            // bottom edge
            testY = this.y + this.h;
        }

        distX = cx - testX;
        distY = cy - testY;
        distance = Math.sqrt(distX*distX + distY*distY);

        if(distance < obj.radius + 5) {
            return true;
        }
        return false;
    }

    collisionWithCircle(obj) {
        let cx = obj.x, cy = obj.y;
        let rotate = 3;
        if(this.circleIntersect(obj)) {
            this.dx = (this.x + this.w/2 - cx) / (this.w/2);
            this.dy = -2;
            if(cx > this.x + this.w/2) {
                this.a -= rotate;
            } else {
                this.a += rotate;
            }
        }
    }
}

class Circle extends CanvasObject {
    constructor(ctx, x, y, radius, dx, dy, speed) {
        super(ctx, x, y, dx, dy, speed);
        this.radius = radius;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.fill();
    }

    mouseMove() {
        canvas.addEventListener("mousemove", e => {
            this.x = e.clientX;
            this.y = e.clientY;
        });
    }
}

let s = new Square(ctx, 200, 10, 90, 35, 0, 0, 0, 1);
// let t = new Square(ctx, 100, 120, 90, 35, 0, 0, 0,1);
let circle = new Circle(ctx, 0, 0, 5, 0, 0, 0);
let rafId = 0;

function animate() {
    s.update();
    // t.update();
    s.bounce();
    // t.bounce();
    circle.mouseMove();
    s.collisionWithCircle(circle);
    // s.nonBounce();
    // t.nonBounce();
    // s.tilt();
    clearCanvas();
    circle.draw();
    s.draw();
    // t.draw();
    rafId = window.requestAnimationFrame(animate);
}
animate();

let stopButton = document.getElementById("stop");
let play = true;
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