import 'phaser';
import Menu from '../components/menu.js'
import CST from '../CST'

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.MAIN_MENU });
    }

    create(){
        const menu = new Menu(this);
        testMenu.setOption(0, "PLAY", function () {
            this.scene.start(CST.SCENES.MAIN_GAME);
        });
    }

    

}