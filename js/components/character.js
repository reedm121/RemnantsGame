class Character extends Phaser.GameObjects.Container{
    constructor(scene, x, y, children, { name, health, food }) {
        super(scene, x, y, children);
        const main = Object.assign(
          scene.add.sprite(0, -12, "atlas", "misa-front"),
          { name: "main"}
        );
        this.add(main);
        
        this.name = name;
        this.health = health;
        this.food = food;

        scene.add.existing(this);

        this.setSize(128, 128);
        scene.physics.add.existing(this, false);
        scene.physics.add.collider(this, scene.world);
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