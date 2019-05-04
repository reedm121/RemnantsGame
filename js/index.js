import Phaser from 'phaser';
import LoadScene from './scenes/LoadScene';
import MainGameScene from './scenes/MainGameScene';
import MainMenuScene from './scenes/MainMenuScene';

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