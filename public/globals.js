var Globals = {};
Globals.Ball = {};
Globals.Player = {};
Globals.Game = {};

Object.defineProperty(Globals.Ball, "SIZE", {value: 5, writable: false});
Object.defineProperty(Globals.Ball, "VELOCITY", {value: 0.15, writable: false});

Object.defineProperty(Globals.Player, "WIDTH", {value: 10, writable: false});
Object.defineProperty(Globals.Player, "HEIGHT", {value: 50, writable: false});
Object.defineProperty(Globals.Player, "PADDING", {value: 10, writable: false});
Object.defineProperty(Globals.Player, "VELOCITY", {value: 0.1, writable: false});

Object.defineProperty(Globals.Game, "STAGE_WIDTH", {value: 800, writable: false});
Object.defineProperty(Globals.Game, "STAGE_HEIGHT", {value: 500, writable: false});
Object.defineProperty(Globals.Game, "MAX_SCORE", {value: 5, writable: false});


if(typeof module !== "undefined") {
    module.exports = Globals;
}