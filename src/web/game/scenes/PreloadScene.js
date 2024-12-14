import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Barre de chargement
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        // Texte de chargement
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading MangaMaze...', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        // Event handlers pour la progression
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        // Chargement des assets
        this.load.setPath('/assets');
        
        // Images
        this.load.image('tiles', 'images/tileset.png');
        this.load.image('pellet', 'images/pellet.png');
        this.load.image('power-pellet', 'images/power-pellet.png');
        
        // Spritesheets
        this.load.spritesheet('player', 'images/player.png', { 
            frameWidth: 64, 
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('ghost', 'images/ghost.png', { 
            frameWidth: 64, 
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        });
        
        // Map
        this.load.tilemapTiledJSON('map', 'maps/level1.json');
    }

    create() {
        // Création des animations
        this.createAnimations();
        
        // Transition vers la scène de jeu
        this.scene.start('GameScene');
    }

    createAnimations() {
        // Animation du joueur
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        // Animation des fantômes
        this.anims.create({
            key: 'ghost-move',
            frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
    }
}
