//import '../defs/phaser';

var Phaser = Phaser || {};

var game;

var map;
var tiles;

var player;
var cursors;
var camera;

var gameWidth = 1024;
var gameHeight = 2048;

var direction = 'right';

var fadetime;
var clock;
var day;
var overlay;
var alpha;

var food;
var health;
var water;
var wood;
var starving;

var foodText, healthText, waterText, woodText, statsContainer;
var foodTimer, waterTimer, healthTimer;

var overlay;
var wood_logs;

var t;

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

    //wood generation
    const tile_list = layer1.getTilesWithin();
    for (var i=0; i<tile_list.length; i++){
        if (tile_list[i].properties.walkable){
            var r = Math.random();
            if (r<=0.1){
            this.physics.add.sprite(tile_list[i].x*32, tile_list[i].y*32, 'wood');
            }
        }
    }

    //player
    player = this.physics.add.sprite(500, 500, 'Steve');
    player.setInteractive();

    this.physics.add.collider(player, layer1);
    this.physics.add.collider(player, layer2);
    player.setCollideWorldBounds(true);

    //wood
    //map.forEachTile(generateWood(this));

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

    //delay 300000 (5 minutes), only 1000 for testing 
    clock = this.time.addEvent({delay: 300000, loop: true, callback: this.changeDay});
    day = true;

    //Initialize stats
    food = health = water = 100;
    wood = 0;
    starving = false;

    statsContainer = this.add.container(camera.worldView.x, camera.worldView.y);
    healthText = this.add.text(0, 0, "Health: " + health, {font: "4px pixel_font", fill:"#C11111"});
    foodText = this.add.text(0, 10, "Food: " + food, {font: "4px pixel_font", fill:"#C47E0D"});
    waterText = this.add.text(0, 20, "Water: " + water, {font: "4px pixel_font", fill:"#12ABBC"});
    woodText = this.add.text(0, 30, "Wood: " + wood, {font: "4px pixel_font", fill:"#725001"});

    statsContainer.add(healthText);
    statsContainer.add(foodText);
    statsContainer.add(waterText);
    statsContainer.add(woodText);
    statsContainer.removeInteractive();

    //5 minutes to fully empty
    foodTimer = this.time.addEvent({delay: 30000, loop: true, callback: () => {
        if(food > 0)
            food--;
        foodText.text = "Food: " + food;
    }});

    //2 minutes 30 seconds to fully empty
    waterTimer = this.time.addEvent({delay: 1, loop: true, callback: () => {
        if(water > 0)
            water--;
        waterText.text = "Water: " + water;
    }});
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

    //Day/night cycle
    if(day){
        alpha = clock.getProgress();
        overlay.alpha = (alpha <= 0.5) ? alpha : 0.5;
    }
    else{
        alpha = 1-clock.getProgress();
        overlay.alpha = (alpha <= 0.5) ? alpha : 0.5;
    }
    overlay.setPosition(player.body.x, player.body.y);
    statsContainer.setPosition(camera.worldView.x, camera.worldView.y);

    if((food === 0 || water === 0) && !starving){
        starving = true;
        healthTimer = this.time.addEvent({delay: 1000, loop: true, callback: () => {
            if(health > 0)
                health--;
            healthText.text = "Health: " + health;
            player.setTint(0xff0000);
            this.time.addEvent({delay: 500, callback: () => {
                player.clearTint();
            }})
        }});
    }

    if(starving && food > 0 && water > 0){
        healthTimer.remove();
        starving = false;
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

function generateWood(scene) {
    scene.physics.add.staticSprite(this.x, this.y, scene.textures.get('wood'));
}


