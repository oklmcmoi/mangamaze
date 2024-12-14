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

        // Chargement des assets HD
        this.load.image('background', 'assets/images/background-hd.png');
        this.load.image('tiles', 'assets/images/tileset-hd.png');
        this.load.tilemapTiledJSON('map', 'assets/maps/level1-hd.json');
        
        // Sprites des personnages en HD
        this.load.spritesheet('naruto', 'assets/sprites/naruto-hd.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('naruto-power', 'assets/sprites/naruto-power-hd.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('naruto-attack', 'assets/sprites/naruto-attack-hd.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        // Effets visuels
        this.load.image('particles', 'assets/effects/particles-hd.png');
        this.load.image('powerup-effect', 'assets/effects/powerup-hd.png');
        this.load.image('light', 'assets/effects/light-hd.png');

        // Sons HD
        this.load.audio('background-music', 'assets/audio/background-music-hd.mp3');
        this.load.audio('powerup-sound', 'assets/audio/powerup-hd.mp3');
        this.load.audio('collect-sound', 'assets/audio/collect-hd.mp3');
    }

    create() {
        // Transition vers la scène de menu
        this.scene.start('MenuScene');
    }
}
