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
            gravity: { y: 500 },
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

function preload() {
    //this.load.image('tiles', 'assets/tilemaps/tiles/cybernoid.png');
    //this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/cybernoid.json');
    this.load.image('tiles', 'assets/images/grass_biome.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map1_1.json');
    this.load.spritesheet('mantisplayer', 'assets/images/praying_mantis.png', { frameWidth: 128, frameHeight: 128 });
}

function create() {
    this.map = this.add.tilemap('map');

    //var tiles = map.addTilesetImage('cybernoid', 'tiles');
    var tiles = this.map.addTilesetImage('grass_biome', 'tiles');

    for (var i = 0; i < 10; i++) {
        this.layer1 = this.map.createStaticLayer(i, tiles, 0, 0);
    }

    this.player = this.physics.add.sprite(100, 0, 'mantisplayer');

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };

    controls = this.cameras.main.startFollow(this.player);

    this.game.input.mouse.capture = true;

    this.input.on('pointermove', function (pointer) {

        this.moveToXY(this.player, pointer.x, pointer.y);

    }, this);

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
    controls.update(delta);
}