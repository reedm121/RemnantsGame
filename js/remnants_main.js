//main code for REMNANTS game

//just dropped my code in from HW3 for now to get started, we will have to change file names and such
var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

var content = ["You wake alone in a dark forest with no memory of your past…", "the stinging cold prompts you to quickly build a fire. Ahh the warmth… The wind quiets but the forest is still loud with noise. What is that rustling? There it is again. The RUSTLING. Louder now, it seems to be getting closer… and faster even. “Hello?” you yell. No answer… your fists tighten around the hatchet in your hands. Do you run? Or stand your ground?..."]

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 120;
var lineDelay = 400;

var text;

function preload() {
    //this.load.image('tiles', 'assets/tilemaps/tiles/cybernoid.png');
    //this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/cybernoid.json');
    /* this.load.image('tiles', 'assets/images/grass_biome.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map1_1.json');
    this.load.spritesheet('mantisplayer', 'assets/images/praying_mantis.png', { frameWidth: 128, frameHeight: 128 }); */
}

function create() {
    var title = this.add.text(100, 200, 'Static Text Object', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });
}

function moveToXY(gameObject, x, y, speed, maxTime) {
    if (speed === undefined) { speed = 60; }
    if (maxTime === undefined) { maxTime = 0; }

    var angle = Math.atan2(y - gameObject.y, x - gameObject.x);

    if (maxTime > 0) {
        //  We know how many pixels we need to move, but how fast?
        var dx = gameObject.x - x;
        var dy = gameObject.y - y;

        speed = Math.sqrt(dx * dx + dy * dy) / (maxTime / 1000);
    }

    gameObject.setVelocityX(Math.cos(angle) * speed);
    gameObject.setVelocityY(Math.sin(angle) * speed);

    // gameObject.rotation = angle;
}

function update(time, delta) {
    
}