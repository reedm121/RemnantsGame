import 'phaser';
import Menu from '../components/menu.js'
import CST from '../CST'

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.MAIN_MENU });
        this.state = {};
    }

    create(){
        const menu = new Menu(this);
        testMenu.setOption(0, "PLAY", function () {
            this.scene.start(CST.SCENES.MAIN_GAME);
        });
    }

    create() {
        var testMenu = new Menu("Test Menu", this);
        testMenu.setOption(0, "Start Game", function() {
            this.scene.scene.start(CST.SCENES.MAIN_GAME);
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