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

/* Aspect ratio needs to be 16 : 9, it's the most rectangular mobile config */
/* might need to change to 320px wide */
Object.defineProperty(Globals.Game, "STAGE_WIDTH", {value: 800, writable: false});
Object.defineProperty(Globals.Game, "STAGE_HEIGHT", {value: 450, writable: false});
Object.defineProperty(Globals.Game, "ASPECT_RATIO", {value: 16/9, writable: false});
Object.defineProperty(Globals.Game, "MAX_SCORE", {value: 5, writable: false});



if(typeof module !== "undefined") {
    module.exports = Globals;
}