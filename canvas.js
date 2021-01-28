var canvas = document.getElementById('wall');

// function drawRect(ctx) {
//     ctx.fillStyle = 'rgb(200, 0, 0)';
//     ctx.fillRect(0, 0, 50, 100);
// }

// function draw() {
//     // checking for support
//     if(canvas.getContext) {
//         // to obtain the rendering context and its drawing functions 
//         var ctx = canvas.getContext('2d');

//         setTimeout(drawRect, 1000, ctx);

//         ctx.fillStyle = 'rgba(0,0,200,0.5)';
//         ctx.fillRect(30, 30, 60, 50);
//     } else {
//         // canvas - unsupported code here;
//     }
// }

// draw();

// function draw() {
//     // checking for support
//     if(canvas.getContext) {
//         // to obtain the rendering context and its drawing functions 
//         let ctx = canvas.getContext('2d');
//         let width = ctx.canvas.clientWidth;
//         let height = ctx.canvas.clientHeight;
//         let isLarge = true;
//         let x = 30;
//         let y = 1;
//         ctx.beginPath();
//         while(x <= width) {
//             ctx.moveTo(x-10, 0); // move the starting point
//             while(y*10 <= height) {
//                 ctx.lineTo(x, y*10); // connects the last point in the current sub-path to the specified(x, y) coordintaes with a straight line;
//                 if(y%2 == 0) {
//                     if(isLarge) {
//                         x -= 10;
//                         isLarge = !isLarge;
//                     } else {
//                         x += 10;
//                         isLarge = !isLarge;
//                     }
//                 }
//                 y++;
//             }
//             ctx.stroke();
//             isLarge = true;
//             x += 50;
//             y = 1;
//         }
        
        
//     } else {
//         // canvas - unsupported code here;
//     }
// }

// draw();

function arcDraw() {
    // checking for support
    if(canvas.getContext) {
        // to obtain the rendering context and its drawing functions 
        let ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.moveTo(75, 75);
        ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
        ctx.stroke();
        
    } else {
        // canvas - unsupported code here;
    }
}

arcDraw();