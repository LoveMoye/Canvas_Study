class GameObject {
    constructor(ctx, x, y, vx, vy, speed) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;

        this.isColliding = false;
    }
}

class Square extends GameObject {

    constructor (ctx, x , y, width, height, vx, vy, speed) {
        super(ctx, x, y, vx, vy, speed);
        this.width = width;
        this.height = height;
    }

    draw() {
        // Draw a simple square
        this.ctx.fillStyle = this.isColliding?'#ff8080':'#0099b0';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
    }
}

class Circle extends GameObject {

    constructor (ctx, x, y, radius, vx, vy, speed, color) {
        super(ctx, x, y, vx, vy, speed, color);
        this.radius = radius;
        this.color = color;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
    }
}