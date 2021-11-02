const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

//sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.scr = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore = "sounds/comScore.mp3";
userScore.src + "sounds/userScore.mp3";

//user paddle
const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

//com paddle
const com = {
    x: canvas.width - 10,
    y: (canvas.height/2 - 100)/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

//the ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 6,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

//create the net
const net = {
    x: (canvas.width - 2)/2,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
}

//draw rect function

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

//draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//Circle
function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}


function drawText(text, x, y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text,x,y);
}

//control the users paddle 
canvas.addEventListener('mousemove', getMousePos);

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

//collision dectection
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width; 

    return p.left < b.right && p.top < b.buttom && p.right > b.left && p.bottom > b.top;
}

//reset ball
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 5;
}

//update
function update() {
        //update the score
        if(ball.x - ball.radius < 0) {
            //the com win
            com.score++;
            //comScore.play();
            resetBall();
        } else if(ball.x + ball.radius > canvas.width) {
            //the user win
            user.score++;
            //userScore.play();
            resetBall();
        } 

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    com.y += ((ball.y - (com.y + com.height/2)))*0.1;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        //wall.play();
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

    if(collision(ball, player)) {
        hit.play();
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);

        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }
 
}

//rendering the game
function render() {
    //clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    //draw the net
    drawNet();

    //draw the score
    drawText(user.score, canvas.width/4, canvas.height/5);
    drawText(com.score, 3*canvas.width/4, canvas.height/5);

    //draw the user and computer paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

//game init
function game() {
    update();
    render();
}

//loop
let framePerSecond = 50;

let loops = setInterval(game, 1000/framePerSecond);