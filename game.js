//BUG: sometimes it jumps when a ball collides with a paddle. 

var Globals = require("./public/globals.js");

function Game(player1Connection, player2Connection) {   
    this.player1 = new Player(1);
    this.player2 = new Player(2);
    this.ball = new Ball();
    this.type = "update";

    player1Connection.on("message", this.player1.updateKeys.bind(this.player1));
    player2Connection.on("message", this.player2.updateKeys.bind(this.player2));

    player1Connection.on("close", forfeit(player2Connection));
    player2Connection.on("close", forfeit(player1Connection));

    function forfeit(connectionRemaining) {
        return function() {           
            clearTimeout(timeout);

            connectionRemaining.sendUTF(JSON.stringify({type : "message", text : "Your opponent forfeits, you win!"}));
            connectionRemaining.close();
        };
    }

    var that = this;
    var prevTime = 0;
    var timeout;

    var tick = function() {
        var deltaTime = 0;
        var currentTime = Date.now();

        if (prevTime) {
            deltaTime = currentTime - prevTime;
        } 

        prevTime = currentTime;

        that.ball.move(deltaTime, that.player1, that.player2);
        that.player1.move(deltaTime);
        that.player2.move(deltaTime);

        detectScore();

        player1Connection.sendUTF(JSON.stringify(that));
        player2Connection.sendUTF(JSON.stringify(that));
        timeout = setTimeout(tick, 20);
    };

    var detectScore = function() {
        if(that.ball.x - Globals.Ball.SIZE < 0) {
            that.player1.score += 1;
            reset();
        } else if(that.ball.x > Globals.Game.STAGE_WIDTH) {
            that.player2.score += 1;
            reset();  
        }

        if(that.player1.score >= Globals.Game.MAX_SCORE) {
            win(player1Connection, player2Connection);
        } else if(that.player2.score >= Globals.Game.MAX_SCORE) {
            win(player2Connection, player1Connection);
        } 
    };

    function win(winner, loser) {
        winner.sendUTF(JSON.stringify({type:"message", text : "Congratulations you win!"}));
        loser.sendUTF(JSON.stringify({type:"message", text : "You've lost the match."}));
        
        winner.close();
        loser.close();
        clearTimeout(timeout);
    }

    var reset = function () {
        that.ball = new Ball();
        that.player1.reset();
        that.player2.reset();
    };

    tick();
}

function Player(id) {    
    if(id === 1) {
        this.x = Globals.Player.PADDING;
    }

    if(id === 2) { 
        this.x = Globals.Game.STAGE_WIDTH - Globals.Player.WIDTH;
    }

    this.score = 0;

    var keys = {};
    var that = this;

    this.reset = function() {
        this.y = Globals.Game.STAGE_HEIGHT / 2 - Globals.Player.HEIGHT / 2;
        this.keys = {};
    };

    this.move = function(deltaTime) {
        var amount = Globals.Player.VELOCITY * deltaTime;

        if(keys.up) {
            if(this.y - amount > 0) {
                this.y -= amount;
            } else {
                this.y = 0;
            }
        }

        if(keys.down) {
            if(this.y + Globals.Player.HEIGHT + amount < Globals.Game.STAGE_HEIGHT) {
                this.y += amount;
            } else {
                this.y = Globals.Game.STAGE_HEIGHT - Globals.Player.HEIGHT ;
            }
        }
    };

    this.updateKeys = function(e) {        
        var msg = JSON.parse(e.utf8Data);
        keys[msg.key] = msg.state;
    };

    this.collides = function(ball) {
        return contains(ball.x, ball.y) || contains(ball.x + Globals.Ball.SIZE, ball.y) ||
            contains(ball.x + Globals.Ball.SIZE, ball.y + Globals.Ball.SIZE) || contains(ball.x, ball.y + Globals.Ball.SIZE);
    };

    function contains(x, y) {
        return x > that.x && 
               x < that.x + Globals.Player.WIDTH && 
               y > that.y && 
               y < that.y + Globals.Player.HEIGHT;
    }

    this.reset();
}

function Ball() {
    this.x = Globals.Game.STAGE_WIDTH / 2 - Globals.Ball.SIZE / 2;
    this.y = Globals.Game.STAGE_HEIGHT / 2 - Globals.Ball.SIZE / 2;

    var xVelocity = Globals.Ball.VELOCITY;
    var yVelocity = 0;

    if(Math.random() > 0.5) {
        xVelocity *= -1;
    } 

    this.move = function(deltaTime, player1, player2) {
        this.x += xVelocity * deltaTime;
        this.y += yVelocity * deltaTime;

        if(this.y < 0 || this.y > Globals.Game.STAGE_HEIGHT - Globals.Ball.SIZE) {
            yVelocity *= -1;
        }

        var collides;

        if(player1.collides(this)) {
            collides = player1;
        }

        if(player2.collides(this)) {
            collides = player2;
        }

        if(collides) {          
            var yRel = this.y;
            yRel -= collides.y + Globals.Player.HEIGHT / 2 - Globals.Ball.SIZE / 2;
            yRel /= Globals.Player.HEIGHT / 2;
            yRel /= 2;

            xVelocity = -xVelocity / Math.abs(xVelocity) * (1 - Math.abs(yRel)) * Globals.Ball.VELOCITY;
            yVelocity = yRel * Globals.Ball.VELOCITY;
        }   
    };
}

module.exports = Game;
