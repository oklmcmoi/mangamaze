import Phaser from 'phaser';

export class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // Création d'une barre de chargement
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        // Texte de chargement
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Chargement...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // Événements de progression
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Chargement des assets
        this.loadAssets();
    }

    loadAssets() {
        // Sprites des personnages
        this.load.spritesheet('naruto', 'assets/characters/naruto_sprite.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.spritesheet('luffy', 'assets/characters/luffy_sprite.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.spritesheet('goku', 'assets/characters/goku_sprite.png', {
            frameWidth: 32,
            frameHeight: 48
        });

        // Éléments du jeu
        this.load.image('pellet', 'assets/items/pellet.png');
        this.load.image('power-pellet', 'assets/items/power_pellet.png');
        this.load.image('ghost', 'assets/characters/ghost.png');

        // Tiles pour le labyrinthe
        this.load.image('tiles', 'assets/map/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');

        // Interface utilisateur
        this.load.image('logo', 'assets/ui/logo.png');
        this.load.image('button', 'assets/ui/button.png');

        // Sons
        this.load.audio('eat', 'assets/sounds/eat.mp3');
        this.load.audio('power-up', 'assets/sounds/power_up.mp3');
        this.load.audio('death', 'assets/sounds/death.mp3');
        this.load.audio('background-music', 'assets/sounds/background.mp3');
    }

    create() {
        // Création des animations
        this.createAnimations();
        
        // Passage à la scène du menu
        this.scene.start('MenuScene');
    }

    createAnimations() {
        // Animations pour Naruto
        this.anims.create({
            key: 'naruto-walk-down',
            frames: this.anims.generateFrameNumbers('naruto', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        // ... autres animations pour Naruto

        // Animations pour Luffy
        this.anims.create({
            key: 'luffy-walk-down',
            frames: this.anims.generateFrameNumbers('luffy', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        // ... autres animations pour Luffy

        // Animations pour Goku
        this.anims.create({
            key: 'goku-walk-down',
            frames: this.anims.generateFrameNumbers('goku', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        // ... autres animations pour Goku
    }
}
