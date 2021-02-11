// x, y => the coordinate of the center of gravity
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

        this.coordinate = [
            {
                x: this.x,
                y: this.y
            },
            {
                x: this.x + this.w*Math.cos(Math.PI/180*this.a),
                y: this.y + this.w*Math.sin(Math.PI/180*this.a)
            },
            {
                x: this.x + this.w*Math.cos(Math.PI/180*this.a) - this.h*Math.sin(Math.PI/180*this.a),
                y: this.y + this.w*Math.sin(Math.PI/180*this.a) + this.h*Math.cos(Math.PI/180*this.a)
            },
            {
                x: this.x - this.h*Math.sin(Math.PI/180*this.a),
                y: this.y + this.h*Math.cos(Math.PI/180*this.a)
            }
        ]
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
        // console.log(this.coordinate);
        this.ctx.fillStyle = this.color;
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((Math.PI/180)*this.a);
        this.ctx.fillRect(0, 0, this.w, this.h); 
        this.ctx.restore();
    }

    vertexDraw() {
        let circle1 = new Circle(ctx, this.coordinate[0].x, this.coordinate[0].y, 5, 0, 0, 0);
        let circle2 = new Circle(ctx, this.coordinate[1].x, this.coordinate[1].y, 5, 0, 0, 0);
        let circle3 = new Circle(ctx, this.coordinate[2].x, this.coordinate[2].y, 5, 0, 0, 0);
        let circle4 = new Circle(ctx, this.coordinate[3].x, this.coordinate[3].y, 5, 0, 0, 0);
        circle1.draw();
        circle2.draw();
        circle3.draw();
        circle4.draw();
    }

    update() {
        this.x += this.dx; // dx만큼 이동
        this.y += this.dy; // dy만큼 이동
        this.a = this.a%360; // 각도 360도 내 범위로 변경

        this.coordinate[0].x = this.x;
        this.coordinate[0].y = this.y;
        this.coordinate[1].x = this.x + this.w*Math.cos(Math.PI/180*this.a);
        this.coordinate[1].y = this.y + this.w*Math.sin(Math.PI/180*this.a);
        this.coordinate[2].x = this.x + this.w*Math.cos(Math.PI/180*this.a) - this.h*Math.sin(Math.PI/180*this.a);
        this.coordinate[2].y = this.y + this.w*Math.sin(Math.PI/180*this.a) + this.h*Math.cos(Math.PI/180*this.a);
        this.coordinate[3].x = this.x - this.h*Math.sin(Math.PI/180*this.a);
        this.coordinate[3].y = this.y + this.h*Math.cos(Math.PI/180*this.a);
    }

    bounce() {
        if(this.getBottom()+this.dy+5 > window.innerHeight) {
            this.dx *= Square.restitution;
            this.dy = -this.dy*Square.restitution;
        } else {
            this.dy += Square.gravity;
            this.a += this.dx > 0 ? 0.1: this.dx === 0 ? 0 : -0.1;
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
 
    pointEdgeIntersect(x, y, x1, y1, x2, y2) {
        let dist1 = dist(x, y, x1, y1);
        let dist2 = dist(x, y, x2, y2);
        let distance = dist(x1, y1, x2, y2);
        // console.log(dist1+dist2, distance);
        if(dist1 + dist2 <= distance + 1 && dist1 + dist2 > distance-1) {
            return true;
        }
        return false;
    }

    circlePointIntersect(x,y, cx, cy, r) {
        let distance = dist(x, y, cx, cy);
        if(distance < r) {
            return true;
        }
        return false;

    }

    // circle inside the square?
    insideSquare(cx, cy) {
        let x1 = this.coordinate[0].x, y1 = this.coordinate[0].y,
            x2 = this.coordinate[1].x, y2 = this.coordinate[1].y,
            x3 = this.coordinate[2].x, y3 = this.coordinate[2].y,
            x4 = this.coordinate[3].x, y4 = this.coordinate[3].y;

        let dist1 = pointLineDist(x1, y1, x2, y2, cx, cy);
        let dist2 = pointLineDist(x2, y2, x3, y3, cx, cy);
        let dist3 = pointLineDist(x3, y3, x4, y4, cx, cy);
        let dist4 = pointLineDist(x4, y4, x1, y1, cx, cy);
        // console.log(dist1+dist2+dist3+dist4);
        if(dist1 + dist2 + dist3 + dist4 <= this.w + this.h + 0.1) {
            return true;
        }
        return false;
        
    }

    circleEdgeIntersect(obj) {
        let cx = obj.x, cy = obj.y, r=obj.radius;
        let x1, y1, x2, y2;
        
        for(let i=0; i<4; i++) {
            x1 = this.coordinate[i%4].x;
            y1 = this.coordinate[i%4].y;
            x2 = this.coordinate[(i+1)%4].x;
            y2 = this.coordinate[(i+1)%4].y;

            let insideSquare = this.insideSquare(cx, cy);
            if(insideSquare) return true;

            // on the point of square?
            let inside1 = this.circlePointIntersect(x1, y1, cx, cy, r);
            let inside2 = this.circlePointIntersect(x2, y2, cx, cy, r);
            if(inside1 || inside2){ 
                return true
            };
            // on the edge of square
            let onLine = this.pointEdgeIntersect(cx, cy, x1, y1, x2, y2);

            // the least distance of between center of circle and edge of square
            let len = dist(x1, y1, x2, y2);
            let u = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / (len*len);
            let closestX = x1 + (u * (x2 - x1));
            let closestY = y1 + (u * (y2 - y1));
            let distance = dist(cx, cy, closestX, closestY);

            
            if(distance < r && onLine) {
                return true
            };
        }

        return false;    
    }

    squareEdgeIntersect(obj) {
        let rx, ry; // obj.coordinate
        let x1, y1, x2, y2; // this.coordinate
        for(let i=0; i<4; i++) {
            rx = obj.coordinate[i].x;
            ry = obj.coordinate[i].y;
            for(let j=0; j<4; j++) {
                x1 = this.coordinate[j%4].x;
                y1 = this.coordinate[j%4].y;
                x2 = this.coordinate[(j+1)%4].x;
                y2 = this.coordinate[(j+1)%4].y;

                // the point inside square?
                let insideSquare = this.insideSquare(rx, ry);
                if(insideSquare) return true;

                // on the edge of square
                let onLine = this.pointEdgeIntersect(rx, ry, x1, y1, x2, y2);
                if(onLine) return true;
            }
        }
        return false;
    }

    collisionWithRect(obj) {
        
    }

    collisionWithCircle(obj) {
        let cx = obj.x, cy = obj.y;
        let rotate = 1;
        let g = 15;
        if(this.circleEdgeIntersect(obj)) {
            this.dx = (this.x + this.w/2 - cx) / (this.w/2);
            this.dy = -1;
            if(cx > this.x + this.w/2) {
                this.a -= rotate;
            } else {
                this.a += rotate;
            }
            rotate += g;
        }
    }

    collideOverWall() {
        let left = Math.min(this.coordinate[0].x,this.coordinate[1].x,this.coordinate[2].x,this.coordinate[3].x);
        let right = Math.max(this.coordinate[0].x,this.coordinate[1].x,this.coordinate[2].x,this.coordinate[3].x);
        let top = Math.min(this.coordinate[0].y,this.coordinate[1].y,this.coordinate[2].y,this.coordinate[3].y);

        if(left - 5 < 0 || right + 5 > window.innerWidth) {
            this.dx = -this.dx;
        } 

        if(top -5 < 0) {
            this.dy = -this.dy;
        }
    }
}