import Phaser from 'phaser';

class Character extends Phaser.GameObjects.Container{
    constructor(scene, x, y, children, { charName, health, food }) {
        super(scene, x, y, children);
        const main = Object.assign(
          scene.add.sprite(0, -12, "atlas", "misa-front"),
          { name: "main"}
        );
        this.add(main);
        
        this.name = charName;
        this.health = health;
        this.food = food;

        scene.add.existing(this);

        this.setSize(CST.PLAYER.WIDTH, CST.PLAYER.HEIGHT);
        scene.physics.add.existing(this, false);
        scene.physics.add.collider(this, scene.world);
        this.id = id;
        this.food = food;
      }

      static createAnimations(scene){
        const { anims } = scene;
        anims.create({
            key: "test",
            frames: anims.generateFrameNames("atlas", { prefix: "p", start: 0, end: 5, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });
      }

      updateFood(newFood){
        this.food = newFood;
      }

      updateHealth(newHealth){
          this.health = newHealth;
      }
      
}