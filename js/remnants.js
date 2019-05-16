//import '../defs/phaser';

var Phaser = Phaser || {};

var game;

var map;
var tiles;

var player;
var cursors;
var camera;

var gameWidth = 1024;
var gameHeight = 1024;

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
var temp;
var starving;

var foodText, healthText, waterText, woodText, tempText, statsContainer;
var foodTimer, waterTimer, healthTimer, coldTimer, fireTimer;

var overlay;
var wood_logs;
var shrooms;
var fire;
var heatRange;
var heatSources = [];
var numFires;
var nearFire;
var freezing;
var fireTimerActive;

var t;
var BKey;

class RemnantsScene extends Phaser.Scene{

preload(){
    //load spritesheets
    this.load.spritesheet('Steve', 'assets/sprites/steve_spritesheet.png', {frameWidth: 18, frameHeight: 24}); //Steve is what im calling the player
    this.load.spritesheet('fire', 'assets/sprites/fire.png', {frameWidth: 11, frameHeight: 16});
    
    //load images
    this.load.image('wood', 'assets/sprites/wood_log.png');
    this.load.image('shroom', 'assets/sprites/shroom.png');

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
    wood_logs = this.physics.add.group();
    shrooms = this.physics.add.group();
    for (var i=0; i<tile_list.length; i++){
        if (tile_list[i].properties.walkable){
            var r = Math.random();
            if (r<=0.03){
                wood_logs.add(this.physics.add.sprite(tile_list[i].x*32, tile_list[i].y*32, 'wood'));
            }
            if (r>0.03 && r<=0.06){
                shrooms.add(this.physics.add.sprite(tile_list[i].x*32, tile_list[i].y*32, 'shroom'));
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
    //fire animations
    this.anims.create({
        key: 'fire_burn',
        frames: this.anims.generateFrameNames('fire', {start: 0, end: 2}),
        frameRate: 8,
        repeat: -1
    })

    cursors = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN
    });

    cursors = this.input.keyboard.createCursorKeys();

    BKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

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
    wood = 5;
    temp = 60;
    starving = false;
    nearFire = false;
    freezing = false;
    numFires = 0;
    fireTimerActive = false;

    statsContainer = this.add.container(camera.worldView.x, camera.worldView.y);
    healthText = this.add.text(0, 0, "Health: " + health, {font: "4px pixel_font", fill:"#C11111"}).setResolution(5);
    foodText = this.add.text(0, 10, "Food: " + food, {font: "4px pixel_font", fill:"#C47E0D"}).setResolution(5);
    waterText = this.add.text(0, 20, "Water: " + water, {font: "4px pixel_font", fill:"#12ABBC"}).setResolution(5);
    woodText = this.add.text(0, 30, "Wood: " + wood, {font: "4px pixel_font", fill:"#725001"}).setResolution(5);
    tempText = this.add.text(0, 40, "Temperature: " + temp + "F", {font: "4px pixel_font", fill:"#3331AA"}).setResolution(5);

    statsContainer.add(healthText);
    statsContainer.add(foodText);
    statsContainer.add(waterText);
    statsContainer.add(woodText);
    statsContainer.add(tempText);
    statsContainer.removeInteractive();

    //5 minutes to fully empty
    foodTimer = this.time.addEvent({delay: 30000, loop: true, callback: () => {
        if(food > 0)
            food--;
        foodText.text = "Food: " + food;
    }});

    //2 minutes 30 seconds to fully empty
    waterTimer = this.time.addEvent({delay: 15000, loop: true, callback: () => {
        if(water > 0)
            water--;
        waterText.text = "Water: " + water;
    }});

    //Collecting things
    this.physics.add.overlap(player, wood_logs, this.collectWood, null, this);
    this.physics.add.overlap(player, shrooms, this.collectShroom, null, this);
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

    //fire placement
    if(Phaser.Input.Keyboard.JustDown(BKey)){
        if(wood >= 5){
            fire = this.physics.add.sprite(Math.floor(player.x+32), Math.floor(player.y), 'fire');
            fire.anims.play('fire_burn', true);
            //var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0x0000aa } });
            var heatRange = new Phaser.Geom.Rectangle(fire.x-2*32, fire.y-2*32, 4*32, 4*32) //5x5 range
            heatSources.push(heatRange);
            numFires++;
            //graphics.strokeRectShape(heatRange);
            wood -= 5;
            woodText.text = "Wood: " + wood;
        }
        else{
            //text display
            var helpText = this.add.text(camera.worldView.x, camera.worldView.y+60, "Need more wood to build fire!", {font: "3px pixel_font"}).setResolution(5);
            this.time.addEvent({delay: 2000, callback: () => {
                helpText.destroy();
            }});
        }
        
    }

    for(var i = 0; i < numFires; i++){
        if(heatSources[i].contains(player.x, player.y)){
            nearFire = true;
            break;
        }
        else{
            nearFire = false;
        }
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

    //Temperature
    if(!nearFire){
        if(day)
            temp = Math.ceil(60 - 40*clock.getProgress());
        else
            temp = Math.ceil(20 + 40*clock.getProgress());
        if(fireTimerActive){
            fireTimer.remove();
            fireTimerActive = false;
        }
    }
    else if(!fireTimerActive){
        fireTimerActive = true;
        fireTimer = this.time.addEvent({delay: 2000, loop: true, callback: () => {
            if(temp < 60)
                temp++;
        }});
    }
        
    tempText.text = "Temperature: " + temp + "F";

    if(temp < 32 && !freezing){
        freezing = true;
        player.setTint(0x2ba4bf);
        coldTimer = this.time.addEvent({delay: 1000, loop: true, callback: () => {
            health--;
            healthText.text = "Health: " + health;
        }})
    }
    else if(freezing && temp >= 32){
        freezing = false;
        player.clearTint();
        coldTimer.remove();
    }

    //Food/water
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

collectWood(player, log){
    log.disableBody(true, true);
    wood++;
    woodText.text = "Wood: " + wood;
}

collectShroom(player, shroom){
    shroom.disableBody(true, true);
    food += 5;
    if(food > 100)
        food = 100;
    foodText.text = "Food: " + food;
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


