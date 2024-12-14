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
        
        // Images
        this.load.image('tiles', '/assets/images/tileset.png');
        this.load.image('pellet', '/assets/images/pellet.png');
        this.load.image('power-pellet', '/assets/images/power-pellet.png');
        this.load.image('menu-background', '/assets/images/menu-background.png');
        this.load.image('logo', '/assets/images/logo.png');
        this.load.image('particles', '/assets/images/particles.png');
        
        // Spritesheets
        this.load.spritesheet('player', '/assets/images/player.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        this.load.spritesheet('ghost', '/assets/images/ghost.png', { 
            frameWidth: 32, 
            frameHeight: 32 
        });
        
        // Map
        this.load.tilemapTiledJSON('map', '/assets/maps/level1.json');

        // Chargement des sons
        this.load.audio('eat', '/assets/sounds/eat.mp3');
        this.load.audio('power-up', '/assets/sounds/power-up.mp3');
        this.load.audio('death', '/assets/sounds/death.mp3');
        this.load.audio('background-music', '/assets/sounds/background-music.mp3');
    }

    create() {
        // Création des animations du joueur
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        // Transition vers la scène de jeu
        this.scene.start('GameScene');
    }
}
