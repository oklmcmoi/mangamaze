import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Créer un rectangle simple pour le joueur
        this.player = this.add.rectangle(400, 300, 32, 32, 0x00ff00);
        this.physics.add.existing(this.player);
        
        // Créer quelques murs
        this.walls = this.physics.add.staticGroup();
        this.createWalls();
        
        // Ajouter les collisions
        this.physics.add.collider(this.player, this.walls);
        
        // Initialiser les contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createWalls() {
        // Murs horizontaux
        for (let x = 0; x < 800; x += 32) {
            this.walls.create(x, 0, 'wall');
            this.walls.create(x, 568, 'wall');
        }
        
        // Murs verticaux
        for (let y = 0; y < 600; y += 32) {
            this.walls.create(0, y, 'wall');
            this.walls.create(768, y, 'wall');
        }
    }

    update() {
        // Vitesse du joueur
        const speed = 200;
        
        // Mouvement horizontal
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        } else {
            this.player.body.setVelocityX(0);
        }
        
        // Mouvement vertical
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
        } else {
            this.player.body.setVelocityY(0);
        }
    }
}
