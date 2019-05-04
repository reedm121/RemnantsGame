import Phaser from 'phaser';

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.LOAD });
    }
    
    init() {

    }
    preload() {

        this.add.text(this.cameras.main.centerX - 180, this.cameras.main.centerY - 200, "LOADİNG...", {
            fill: "#fff",
            font: "80px monospace",
        });

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        })

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })
    }
    create() {
        this.scene.start()
    }
}