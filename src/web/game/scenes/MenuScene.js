import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Ajout du fond
        this.add.image(0, 0, 'menu-background')
            .setOrigin(0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Ajout du logo
        const logo = this.add.image(this.cameras.main.centerX, 200, 'logo')
            .setScale(0.5);

        // Création du bouton de démarrage
        const startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        // Animation du bouton au survol
        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1);
        });

        // Démarrage du jeu au clic
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Ajout d'un effet de particules
        const particles = this.add.particles('particles');
        particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: { min: 0, max: this.cameras.main.height },
            speed: { min: 20, max: 50 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 2000,
            frequency: 200
        });
    }
}
