let canvas = document.getElementById('wall');
let ctx = canvas.getContext('2d');
let save = document.getElementById('save');
let restore = document.getElementById('restore');
let brick = new Image();
brick.src = './pic/벽돌.jpg';
        
class Wall {
    // 시작할 위치와 벽돌의 갯수
    constructor(x, y, sizeX, sizeY) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.width = 40 * this.sizeX + ((this.sizeX+1) * 5) - 1;
        this.height = 15 * this.sizeY + ((this.sizeY+1) * 5);

        this.rafId;
    }

    drawBricks(ctx) {
        let x = this.x + 5, y = this.y + 5;
        // first layer
        while(y < this.y + this.height) {
            while(x < this.x + this.width) {
                ctx.fillStyle = "#723838";
                ctx.drawImage(brick, x, y, 40, 15);
                x += 45;
            }
            x = this.x + 5;
            y += 40;
        }

        x = this.x - 17.5;
        y = this.y + 25;
        while(y < this.y + this.height) {
            while(x < this.x + this.width) {
                ctx.fillStyle = "#723838";
                ctx.drawImage(brick, x, y, 40, 15);
                if(x == (this.x - 17.5)) {
                    ctx.clearRect(x, y, 17.5, 15);
                }
                x += 45;
            }
            ctx.clearRect(x-23.5, y, 20, 15);
            x = this.x - 17.5;
            y += 40;
        }
    }
    
    drawOneBrick(x, y, ctx) {
        ctx.drawImage(brick, x, y, 40, 15);
    }

    // return left top corner coordinates of a brick
    getBrickCoordinate(canvas, e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left - this.x;
        let y = Math.floor((e.clientY - rect.top - this.y) / 20);
        if(y%2 == 1) {
            if(x <= 17.5) {
                x = this.x-17.5; 
                y = this.y+y*20+5;
            } else {
                x = Math.floor((x-17.5)/45)+1;
                x = this.x + (x-1)*45 + 27.5;
                y = this.y+ y*20+5;
            }
        } else {
            x = Math.floor(x/45);
            x = this.x + x*45 + 5;
            y = this. y+ y*20+5;
        } 

        return { x, y };
    }

    gravity(x, y, ctx) {
        let speed = 1;
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.draw(ctx);
        ctx.save();
        y += speed;
        this.drawOneBrick(x, y, ctx);
        this.rafId = window.requestAnimationFrame(() => {this.gravity(x,y,ctx)});
        if(y >= this.height) {
            window.cancelAnimationFrame(this.rafId);
        }
    }

    destroyBrick(canvas, ctx) {
        let speed = 5;
        canvas.addEventListener("click", e => {
            let { x, y } = this.getBrickCoordinate(canvas, e);
            this.gravity(x, y, ctx);
        })    
    }

    removeBrick(canvas, ctx) {
        canvas.addEventListener("click", e => {
            let { x, y } = this.getBrickCoordinate(canvas, e);
            ctx.clearRect(x, y, 40.5, 15); 
        })        
    }

    draw(ctx) {
        ctx.fillStyle = "#D2D1CD";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.drawBricks(ctx);
    }
}

let wall = new Wall(20,20,10,10);
wall.draw(ctx);
// wall.removeBrick(canvas, ctx);
wall.destroyBrick(canvas, ctx);

save.addEventListener("click", e => {
    console.log("save");
    ctx.save();
});

restore.addEventListener("click", e => {
    console.log("restore");
    ctx.restore();
})