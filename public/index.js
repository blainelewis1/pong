//TODO: Expand to fill window
//TODO: support mobile.

//TODO: Display "waiting" message
//TODO: Display "opponent left" message
//TODO: Endgame after score gets to 5?

/* global Globals */

var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext("2d");

var webSocket = new WebSocket("ws://localhost:3000");

window.innerWidth;
window.innerHeight;

canvas.width = Globals.Game.STAGE_WIDTH;
canvas.height = Globals.Game.STAGE_HEIGHT;

window.addEventListener("resize", sizeCanvas);

sizeCanvas();

function sizeCanvas() {

}

webSocket.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    
    if(msg.type === "update") {
        draw(msg);
    } else if(msg.type === "message") {
        drawMessage(msg.text);
    }
};

function drawMessage(msg) {
    context.clearRect(0, 0, Globals.Game.STAGE_WIDTH, Globals.Game.STAGE_HEIGHT);
    
    var size = 30;
    context.font = size + "px Arial";
    context.fillStyle = "#666666";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(msg, Globals.Game.STAGE_WIDTH / 2, Globals.Game.STAGE_HEIGHT / 2 - size / 2);
}

function draw(world) {
    context.clearRect(0, 0, Globals.Game.STAGE_WIDTH, Globals.Game.STAGE_HEIGHT);
    context.fillStyle = "#AAAAAA";

    context.beginPath();
    context.fillRect(world.player1.x, world.player1.y, Globals.Player.WIDTH, Globals.Player.HEIGHT);

    context.beginPath();
    context.fillRect(world.player2.x, world.player2.y, Globals.Player.WIDTH, Globals.Player.HEIGHT);

    context.beginPath();
    context.fillRect(world.ball.x, world.ball.y, Globals.Ball.SIZE, Globals.Ball.SIZE);

    context.strokeStyle = "#AAAAAA";
    context.lineWidth = 2;
    context.textBaseline = "top";
    
    context.beginPath();
    context.moveTo(Globals.Game.STAGE_WIDTH / 2, 0);
    context.lineTo(Globals.Game.STAGE_WIDTH / 2, Globals.Game.STAGE_HEIGHT);
    context.stroke();

    context.font = "20px Arial";

    context.textAlign = "right";
    context.fillText(world.player1.score, Globals.Game.STAGE_WIDTH / 2 - 5, 3);

    context.textAlign = "left";
    context.fillText(world.player2.score, Globals.Game.STAGE_WIDTH / 2 + 5, 3);
}


function sendKeys(e) {
    var msg = {};

    msg.state = e.type === "keydown" ? true : false;

    if(e.keyCode === 38 || e.keyCode === 87){
        msg.key = "up";
    } else if(e.keyCode === 40 || e.keyCode === 83) {
        msg.key = "down";
    }

    if(msg.key) {   
        webSocket.send(JSON.stringify(msg));
        e.preventDefault();
    } 
}

document.addEventListener("keyup", sendKeys);
document.addEventListener("keydown", sendKeys);