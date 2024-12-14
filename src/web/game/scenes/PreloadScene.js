import Phaser from 'phaser';
import mapJson from '../assets/tilemaps/map.json';
import tilesImage from '../assets/images/tiles.png';
import playerSprite from '../assets/sprites/player.png';
import ghostSprite from '../assets/sprites/ghost.png';
import pelletImage from '../assets/images/pellet.png';
import powerPelletImage from '../assets/images/power-pellet.png';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        try {
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

            // Load map data
            this.load.tilemapTiledJSON('mapData', mapJson);
            
            // Load images and sprites with error handling
            this.load.image('tiles', tilesImage);
            this.load.image('pellet', pelletImage);
            this.load.image('power-pellet', powerPelletImage);
            
            // Load sprite sheets
            this.load.spritesheet('player', playerSprite, {
                frameWidth: 32,
                frameHeight: 32
            });
            
            this.load.spritesheet('ghost', ghostSprite, {
                frameWidth: 32,
                frameHeight: 32
            });

            // Add loading error handler
            this.load.on('loaderror', (file) => {
                console.error('Error loading asset:', file.key);
                console.error('Source:', file.url);
                console.error('Type:', file.type);
            });

        } catch (error) {
            console.error('Error in preload:', error);
        }
    }

    create() {
        // Create animations
        this.anims.create({
            key: 'player_move',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'ghost_move',
            frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1
        });

        // Start the game scene
        this.scene.start('GameScene');
    }
}
