class Wall {
    // 시작할 위치와 벽돌의 갯수
    constructor(x, y, sizeX, sizeY) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.width = 40 * this.sizeX + ((this.sizeX+1) * 5) - 1;
        this.height = 15 * this.sizeY + ((this.sizeY+1) * 5);
    }

    drawBrick(ctx) {
        let x = this.x + 5, y = this.y + 5;
        // first layer
        while(y < this.y + this.height) {
            while(x < this.x + this.width) {
                ctx.fillStyle = "#723838";
                ctx.fillRect(x, y, 40, 15);
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
                ctx.fillRect(x, y, 40, 15);
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

    removeBrick(canvas, ctx) {
        canvas.addEventListener("click", e => {
            let { x, y } = this.getBrickCoordinate(canvas, e);
            ctx.clearRect(x, y, 40.5, 15); 
        })        
    }

    draw(ctx) {
        ctx.fillStyle = "#D2D1CD";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.drawBrick(ctx);
    }
}

export { Wall };

