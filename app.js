var http = require("http");
var express = require("express");
var WebSocketServer = require("websocket").server;
var Game = require("./game.js");
var app = express();

app.use(express.static("public"));

var httpServer = http.createServer(app).listen(3000);
var waiting;
var games = [];

var wsServer = new WebSocketServer({"httpServer" : httpServer});
wsServer.on("request", function(request) {
    var connection = request.accept(null, request.origin);
        
    connection.on("close", function() {
        if(waiting === connection) {
            waiting = undefined;
        }
    }); 

    if(waiting) {
        games.push(new Game(waiting, connection));
        waiting = undefined;
    } else {
        waiting = connection;
        waiting.sendUTF(JSON.stringify({"type": "message", "text" : "Waiting for an opponent..."}));
    }
});