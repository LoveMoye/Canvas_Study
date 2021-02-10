let gameObjects = [];
function createWorld() {
    // for(let i=0; i<10; i++) {
    //     let x = getRandomNumberRange(100, 500);
    //     let y = getRandomNumberRange(100, 500);
    //     let w = getRandomNumberRange(30, 50);
    //     let h = getRandomNumberRange(30, 50);
    //     let dx = getRandomNumberRange(-50, 50);
    //     let dy = getRandomNumberRange(-50, 50);
    //     let speed = getRandomNumberRange(0.01, 0.05);
    //     gameObjects.push(new Square(ctx, x, y, w, h, dx, dy, speed));
    // }
    let colors = ['#FFEEE4', '#F17F42', '#CE6D39', '#000000'];
    let n = 50;
    for(let i=0; i<n; i++) {
        let color = colors[i%4];
        let radius = getRandomNumberRange(10,40);
        let x = getRandomNumberRange(radius*2, innerWidth-radius);
        let y = getRandomNumberRange(radius,innerHeight/3);
        let dx = 0;
        let dy = getRandomNumberRange(0, 0.1);
        let speed = 1;
        gameObjects.push(new Circle(ctx, x, y, radius, dx, dy, speed,color));
    }
}

function init() {
    gameObjects.forEach(obj => {
        obj.draw();
    });
}

let rafId;

function animate() {
    gameObjects.forEach(obj => {
        obj.update();
    })
    // detectCollisions();  // square detect collision
    // detectCollisionsCircle(); // circle detect collision
    fallingBalls();
    reactCollisionsCircle(); // react circle collision
    // stopBalls();
    clearCanvas();
    gameObjects.forEach(obj => {
        obj.draw();
    })
    rafId = window.requestAnimationFrame(animate);
}

function rectIntersect(x1,y1,w1,h1,x2,y2,w2,h2) {
    if(x1 + w1 < x2 || x1 > x2 + w2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}


function detectCollisions() {
    let obj1;
    let obj2;
    
    for(let i=0; i<gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    for(let i=0; i<gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for(let j=0; j<gameObjects.length; j++) {
            obj2 = gameObjects[j];

            if(rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height) && i!=j) {
                obj1.isColliding = true;
                obj2.isColliding = true;
            }

        }
    }
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
    let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
    return squareDistance <= ((r1+r2)*(r1+r2));
}


function detectCollisionsCircle() {
    let obj1;
    let obj2;
    
    for(let i=0; i<gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    for(let i=0; i<gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for(let j=0; j<gameObjects.length; j++) {
            obj2 = gameObjects[j];

            if(circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius) && i!=j) {
                obj1.isColliding = true;
                obj2.isColliding = true;
            }

        }
    }
}

function circleCollide(obj1, obj2) {
    let vCollision = {}, vCollisionNorm = {}, vRelativeVelocity = {};
    let distance, speed;

    obj1.isColliding = true;
    obj2.isColliding = true;
    vCollision = {x: obj2.x-obj1.x, y:obj2.y-obj1.y};
    distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
    vCollisionNorm = {x : vCollision.x/distance, y : vCollision.y/distance};
    vRelativeVelocity = {x : obj1.vx-obj2.vx, y: obj1.vy-obj2.vy};
    speed = vRelativeVelocity.x*vCollisionNorm.x+vRelativeVelocity.y*vCollisionNorm.y;
    speed *= 0.7;
    
    if(speed >= 0) {
        obj1.vx -= (speed*vCollisionNorm.x);
        if(obj1.y + obj1.radius < window.innerHeight) {
            obj1.vy -= (speed*vCollisionNorm.y);
        }
        obj2.vx += (speed*vCollisionNorm.x);
        if(obj2.y + obj2.radius < window.innerHeight) {
            obj2.vy += (speed*vCollisionNorm.y);
        }
    }
}


function circleCollideOverWall(obj) {
    let friction = 0.7;
    // 벽에 부딪히는 범위를 정할 때, 단순히 
    if(obj.y-obj.radius + obj.vy < 0) {
        obj.isColliding = true;
        obj.vx *= friction;
        obj.vy = -obj.vy*friction;
    } else if (obj.x-obj.radius+obj.vx < 0 || obj.x+obj.radius+obj.vx > window.innerWidth) {
        obj.isColliding = true;
        obj.vx = -obj.vx*friction;
        obj.vy *= friction;
    } 
}


function reactCollisionsCircle() {
    let obj1;
    let obj2;
    
    for(let i=0; i<gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }
    

    for(let i=0; i<gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for(let j=0; j<gameObjects.length; j++) {
            obj2 = gameObjects[j];

            if(circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius) && i!=j) {
                circleCollide(obj1, obj2);
            }            
        }
        circleCollideOverWall(obj1);
    }
}

function fallingBalls() {
    let friction = 0.7;
    let gravity = 1;
    gameObjects.forEach((obj, i) => {
        if(obj.y + obj.radius + obj.vy > window.innerHeight) {
            obj.vy = -obj.vy * friction;
            obj.vx *= friction;
        } else {
            obj.vy += gravity;
        } 
    })
}

function stopBalls() {
    gameObjects.forEach(obj => {
        if(obj.vx.toFixed(3) === '0.000' || obj.vx.toFixed(3) === '-0.000' ||obj.vy.toFixed(3) === '0.000' || obj.vy.toFixed(3) === '-0.000') {
            obj.vx = 0;
            obj.vy = 0;
        }
    })
}