//import * as Phaser from './phaser.js';
import LoadScene from './scenes/LoadScene.js';
import MainGameScene from './scenes/MainGameScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        LoadScene,
        MainMenuScene,
        MainGameScene
    ]
};

const game = new Phaser.Game(config);