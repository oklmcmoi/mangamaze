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
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
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
        this.load.setBaseURL(window.location.origin);
        
        // Images de base
        this.load.image('tiles', '/assets/images/tileset.png');
        this.load.image('pellet', '/assets/images/pellet.png');
        this.load.image('power-pellet', '/assets/images/power-pellet.png');
        
        // Spritesheets
        this.load.spritesheet('player', '/assets/images/player.png', { 
            frameWidth: 32, 
            frameHeight: 32,
            startFrame: 0,
            endFrame: 0
        });
        this.load.spritesheet('ghost', '/assets/images/ghost.png', { 
            frameWidth: 32, 
            frameHeight: 32,
            startFrame: 0,
            endFrame: 0
        });
        
        // Map
        this.load.tilemapTiledJSON('map', '/assets/maps/level1.json');
    }

    create() {
        // Transition vers la scène de jeu
        this.scene.start('GameScene');
    }
}
