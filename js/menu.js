class Menu{
    constructor(scene){
        this.options = [];
        this.scene = scene;
    }

    setOption(index, opt, onClick){
        this.options[index] = {
            option: this.scene.add.text(0, 50*index, opt, {font: "12px pixel_font", fill:"#00FF00"}),
            callback: onClick
        }
    }

    createMenu(x, y){
        var container = this.scene.add.container(x, y);
        var i = 0;
        this.options.forEach(opt => {
            opt.option.setInteractive();
            opt.option.on('pointerover', function(){
                opt.option.setTint(0xff0000);
            });
            opt.option.on('pointerout', function(){
                opt.option.setTint(0x00ff00);
            });
            opt.option.on('pointerup', opt.callback);
            container.add(opt.option);
        });
    }
}