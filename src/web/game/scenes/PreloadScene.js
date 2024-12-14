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

        // Debug handler pour les erreurs de chargement
        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.src);
        });

        // Chargement des assets
        const assetPath = window.location.href.includes('localhost') ? '' : '/mangamaze';
        this.load.setPath(assetPath);
        
        // Images
        this.load.image('tiles', 'assets/images/tileset.png');
        this.load.image('pellet', 'assets/images/pellet.png');
        this.load.image('power-pellet', 'assets/images/power-pellet.png');
        
        // Spritesheets
        this.load.spritesheet('player', 'assets/images/player.png', { 
            frameWidth: 64, 
            frameHeight: 32
        });
        this.load.spritesheet('ghost', 'assets/images/ghost.png', { 
            frameWidth: 64, 
            frameHeight: 32
        });
        
        // Map
        this.load.tilemapTiledJSON('map', 'assets/maps/level1.json');
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
