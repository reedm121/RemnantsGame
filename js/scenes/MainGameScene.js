//import * as Phaser from '../phaser.js';
import CST from "../CST.js";

export default class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.MAIN_GAME });
        this.state = {};
    }

    init() {
        this.load.tilemapTiledJSON("Name", "path");
        this.load.image('tiles', 'path');
        this.load.spritesheet('character', 'path');
    }

    create() {
        var map = this.make.tilemap( {key: "Name"});
        var tileset = map.addTilesetImage("tile name", "tiles");

        //Needs to be done for each layer
        var layer = map.createDynamicLayer("Layer name", tileset, 0, 0);

        var charater = new Character(this, 20, 20, null, {name: "Test", health: 100, food: 100});

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
    }

}