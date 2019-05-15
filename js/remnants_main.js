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

var content = "You wake alone in a dark forest with no memory of your past… the stinging cold prompts you to quickly build a fire. Ahh the warmth… The wind quiets but the forest is still loud with noise. What is that rustling? There it is again. The RUSTLING. Louder now, it seems to be getting closer… and faster even. “Hello?” you yell. No answer… your fists tighten around the hatchet in your hands. Do you run? Or stand your ground?...";

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 70;
var lineDelay = 400;

var text;

var timerEvent;
var testText = "This is a test string";

function preload() {
    //this.load.image('tiles', 'assets/tilemaps/tiles/cybernoid.png');
    //this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/cybernoid.json');
    /* this.load.image('tiles', 'assets/images/grass_biome.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map1_1.json');
    this.load.spritesheet('mantisplayer', 'assets/images/praying_mantis.png', { frameWidth: 128, frameHeight: 128 }); */
    //this.load.image('button', 'assets/images/button.png'); //Temp
}

function create() {
    //var title = this.add.text(100, 200, 'Static Text Object', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });
    testText = content;
    //timerEvent = this.time.addEvent({delay: wordDelay, callback: typeText, repeat: testText.length});
    //text = this.add.text(100, 400);

    //Use containers to make buttons. Put bg image + text into a container, then put containers into one big menu container
    //var buttonBG = this.add.image(0, 0, 'button');

    var testMenu = new Menu("Test Menu", this);
    testMenu.setOption(0, "Option 1", function() {
        if(testMenu.options[0].option.text === "Clicked")
            testMenu.options[0].option.setText("Option 1");
        else
            testMenu.options[0].option.setText("Clicked");
    });

    testMenu.setOption(1, "Option 2", function() {
        if(testMenu.options[1].option.text === "Clicked")
            testMenu.options[1].option.setText("Option 2");
        else
            testMenu.options[1].option.setText("Clicked");
    });

    testMenu.createMenu(100, 100);

    /*var buttonText = this.add.text(0, 0, 'Option 1');
    var buttonText2 = this.add.text(0, 200, 'Option 2');
    var fallButton = this.add.text(0, 400, 'Option 3');
    buttonText.setInteractive();
    buttonText2.setInteractive();
    fallButton.setInteractive();

    var menu = this.add.container(100, 100, [buttonText, buttonText2, fallButton]);

    buttonText.on('pointerover', function(){
        buttonText.setTint(0x00ff00);
    });

    buttonText.on('pointerout', function(){
        buttonText.clearTint();
    });

    buttonText.on('pointerup', function(){
        buttonText.setText("Clicked");
    });

    buttonText2.on('pointerover', function(){
        buttonText2.setTint(0x00ff00);
    });

    buttonText2.on('pointerout', function(){
        buttonText2.clearTint();
    });

    buttonText2.on('pointerup', function(){
        if(buttonText2.text == 'Clicked'){
            buttonText2.setText("Option 2");
        }
        else{
            buttonText2.setText("Clicked");
        }
    });

    fallButton.on('pointerup', function(){
        menu.destroy();
    });
    */
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


function typeText(){
    var currentText = testText.substring(0, testText.length - timerEvent.repeatCount);
    text.setText(currentText);
    text.setWordWrapWidth(600, true);
}