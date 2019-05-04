import Phaser from 'phaser'

class Menu{
    constructor(scene, x, y, children, numOptions){
        super(scene, x, y, children);
        this.numOptions = numOptions;
        this.options = [];
    }

    setOption(index, opt, action){
        options[index] = {
            option: opt,
            callback: action
        };
    }

    createMenu(x, y){
        this.x = x;
        this.y = y;
        options.array.forEach(opt => {
            this.optionText = this.add.text(x, y, opt.option);
            this.optionText.setInteractive(opt.callback);
            y += 200;
        });
    }
}