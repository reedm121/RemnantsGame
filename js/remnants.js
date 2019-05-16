//import '../defs/phaser';

var Phaser = Phaser || {};

var game;

var map;
var tiles;

var player;
var cursors;
var camera;

var gameWidth = 4*128;
var gameHeight = 4*128;

var direction = 'right';

var fadetime;
var clock;
var day;

var overlay;

class RemnantsScene extends Phaser.Scene{

preload(){
    //load spritesheets
    this.load.spritesheet('Steve', 'assets/sprites/steve_spritesheet.png', {frameWidth: 18, frameHeight: 24}); //Steve is what im calling the player
    this.load.image('wood', 'assets/sprites/wood_log.png');

    //load tileset img
    this.load.image('remnants_Tileset', 'assets/maps/remnants_Tileset.png');
    //load overlay image for night cycle
    this.load.image('overlay','assets/images/blue_overlay.png');

    //tilemaps
    this.load.tilemapTiledJSON('map', 'assets/maps/RemnantsMap.json');

};

create(){
    //create tilemap object
    map = this.make.tilemap({key: 'map'});

    //create tileset
    tiles = map.addTilesetImage('remnants_Tileset', 'remnants_Tileset');
    const layer1 = map.createDynamicLayer('Tile Layer 1', tiles, 0, 0);
    const layer2 = map.createDynamicLayer('Tile Layer 2', tiles, 0, 0);

    layer1.setCollisionByProperty({walkable: false});
    layer2.setCollisionByProperty({walkable: false});


    //player
    player = this.physics.add.sprite(500, 500, 'Steve');
    player.setInteractive();

    this.physics.add.collider(player, layer1);
    this.physics.add.collider(player, layer2);
    player.setCollideWorldBounds(true);

    //wood
    wood_logs = []
    t = map.getTilesWithinWorldXY(0, 0, this.gameWidth, this.gameHeight, {walkable: true});
    t.array.forEach(element => {
        var r = Math.random();
        if (r<=0){
            this.physics.add.staticSprite(element.x, element.y, )
        }
    });
    this.physics.add.staticSprite()

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

    cursors = this.input.keyboard.createCursorKeys();

    camera = this.cameras.main;
    camera.width = 4*128;
    camera.height = 4*128;
    camera.setBounds(0, 0, 1024, 2048);
    camera.scrollX = 0; camera.scrollY = 0;
    camera.centerToSize();
    camera.startFollow(player, true, 0.09, 0.09);
    camera.setZoom(4);

    //add overlay
    overlay = this.add.image(camera.x, camera.y, 'overlay').disableInteractive();


    //delay 300000
    clock = this.time.addEvent({delay: 1000, loop: true, callback: this.changeDay});
    day = true;
}

update(){

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-40);
        player.anims.play('left', true);
        direction = 'left';
    }
    else if (cursors.right.isDown) {
        player.body.setVelocityX(40);
        player.anims.play('right', true);
        direction = 'right';
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-35);
        player.anims.play(direction, true);
    }
    else if (cursors.down.isDown) {
        player.body.setVelocityY(35);
        player.anims.play(direction, true);
    }


    if(day)
        overlay.alpha = 1-clock.getProgress();
    else{
        overlay.alpha = clock.getProgress();
    }

    

}

changeDay(){
    day = !day;
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


