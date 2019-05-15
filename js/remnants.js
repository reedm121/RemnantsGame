//import '../defs/phaser';

var Phaser = Phaser || {};

var game;

var map;
var tiles;

var player;
var cursors;
var camera;

var gameWidth = 1920;
var gameHeight = 1080;

class RemnantsScene extends Phaser.Scene{

preload(){

    //load spritesheets
    this.load.spritesheet('Steve', 'assets/sprites/steve_spritesheet.png', {frameWidth: 18, frameHeight: 24}); //Steve is what im calling the player

    //load tileset img
    this.load.image('remnants_Tileset', 'assets/maps/remnants_Tileset.png');

    //tilemaps
    this.load.tilemapTiledJSON('map', 'assets/maps/RemnantsMap.json');

};

create(){

    //create tilemap object
    map = this.make.tilemap({key: 'map'});
    //map.createStaticLayer('Tile Layer 1', 'map');
    //map.createStaticLayer('Tile Layer 2', 'map');

    //create tileset
    tiles = map.addTilesetImage('remnants_Tileset', 'remnants_Tileset');
    map.createDynamicLayer('Tile Layer 1', tiles, 0, 0);
    map.createDynamicLayer('Tile Layer 2', tiles, 0, 0);

    //player
    player = this.physics.add.sprite(256, 256, 'Steve');

    //create player animations
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('Steve', {start: 0, end: 3}),
        frameRate: 16,
        repeat: 0
    })

    this.anims.create({
        key: 'right-idle',
        frames: this.anims.generateFrameNumbers('Steve', { start: 4, end: 5 }),
        frameRate: 16,
        repeat: 0
    })

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('Steve', { start: 6, end: 9 }),
        frameRate: 16,
        repeat: 0
    })

    this.anims.create({
        key: 'left-idle',
        frames: this.anims.generateFrameNumbers('Steve', { start: 10, end: 11 }),
        frameRate: 16,
        repeat: 0
    })

    cursors = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN
    });

    camera = this.cameras.main;
    camera.width = 128;
    camera.height = 128;
    camera.setBounds(player.x - 64, player.y - 64, camera.width, camera.height);
    camera.scrollX = 0; camera.scrollY = 0;
    camera.centerToSize();
    camera.startFollow(player);


}

update(){

}
}

window.onload = function(){
    var config = {
        type: Phaser.WEBGL,
        width: gameWidth,
        height: gameHeight,
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
        scene: new RemnantsScene()
    };
    game = new Phaser.Game(config);
}


