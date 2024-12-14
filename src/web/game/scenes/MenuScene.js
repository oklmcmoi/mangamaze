import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.particles = null;
        this.titleParticles = null;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fond animé avec effet de parallaxe
        this.backgroundParallax = this.add.tileSprite(0, 0, width, height, 'menu-background')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        // Système de particules pour l'ambiance
        this.particles = this.add.particles('particles');
        
        // Particules d'ambiance
        this.particles.createEmitter({
            frame: 'blue',
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            lifespan: 2000,
            speed: { min: 20, max: 50 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            frequency: 200
        });

        // Ajout du logo avec animation
        const logo = this.add.image(width / 2, height / 4, 'logo');
        logo.setScale(0);
        
        // Animation d'entrée du logo
        this.tweens.add({
            targets: logo,
            scale: 0.5,
            duration: 1000,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Particules autour du logo
                this.titleParticles = this.particles.createEmitter({
                    frame: 'yellow',
                    x: logo.x,
                    y: logo.y,
                    speed: 100,
                    scale: { start: 0.2, end: 0 },
                    blendMode: 'ADD',
                    lifespan: 1000,
                    frequency: 50
                });
            }
        });

        // Création des boutons de personnages avec effets avancés
        const characters = ['naruto', 'luffy', 'goku'];
        const buttonSpacing = 200;
        const startX = width / 2 - ((characters.length - 1) * buttonSpacing) / 2;

        characters.forEach((char, index) => {
            const x = startX + index * buttonSpacing;
            const y = height / 2;

            // Conteneur avec effet de flottement
            const container = this.add.container(x, y);
            
            // Effet de lueur derrière le personnage
            const glow = this.add.sprite(0, -50, 'glow-effect');
            glow.setBlendMode('ADD');
            glow.setAlpha(0.5);
            glow.setScale(0);

            // Sprite du personnage avec animation d'idle
            const sprite = this.add.sprite(0, -50, char);
            sprite.setScale(2);
            sprite.play(`${char}-idle`);

            // Fond du bouton avec effet de brillance
            const button = this.add.image(0, 0, 'button-hd');
            button.setScale(1.5);
            
            // Effet de brillance
            const shine = this.add.sprite(0, 0, 'shine-effect');
            shine.setBlendMode('ADD');
            shine.setAlpha(0);

            // Texte stylisé
            const text = this.add.text(0, 50, char.charAt(0).toUpperCase() + char.slice(1), {
                font: 'bold 28px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                shadow: { blur: 2, color: '#000000', fill: true }
            });
            text.setOrigin(0.5);

            // Animation de flottement
            this.tweens.add({
                targets: container,
                y: y - 10,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Ajout des éléments au conteneur
            container.add([glow, button, shine, sprite, text]);
            container.setSize(button.width * 1.5, button.height * 1.5);
            container.setInteractive();

            // Effets de survol améliorés
            container.on('pointerover', () => {
                // Animation de mise à l'échelle
                this.tweens.add({
                    targets: container,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 200,
                    ease: 'Back.easeOut'
                });

                // Animation de la lueur
                this.tweens.add({
                    targets: glow,
                    scale: 1.5,
                    alpha: 0.8,
                    duration: 200
                });

                // Effet de brillance
                this.tweens.add({
                    targets: shine,
                    alpha: 1,
                    x: button.width/2,
                    duration: 500,
                    onComplete: () => {
                        shine.alpha = 0;
                        shine.x = -button.width/2;
                    }
                });

                button.setTint(0x44ff44);
                sprite.play(`${char}-walk`);
            });

            container.on('pointerout', () => {
                this.tweens.add({
                    targets: container,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Back.easeOut'
                });

                this.tweens.add({
                    targets: glow,
                    scale: 0,
                    alpha: 0.5,
                    duration: 200
                });

                button.clearTint();
                sprite.play(`${char}-idle`);
            });

            // Sélection du personnage avec effet
            container.on('pointerdown', () => {
                this.selectCharacter(char);
            });

            // Animation d'entrée des personnages
            container.setAlpha(0);
            container.y += 100;
            this.tweens.add({
                targets: container,
                alpha: 1,
                y: y,
                delay: index * 200,
                duration: 800,
                ease: 'Back.easeOut'
            });
        });

        // Musique de fond avec fade in
        if (!this.sound.get('menu-music')) {
            const music = this.sound.add('menu-music', {
                volume: 0,
                loop: true
            });
            music.play();
            this.tweens.add({
                targets: music,
                volume: 0.5,
                duration: 2000
            });
        }
    }

    selectCharacter(character) {
        // Effet de flash
        this.cameras.main.flash(500);
        
        // Son de sélection
        this.sound.play('character-select', { volume: 0.5 });
        
        // Stocker le personnage sélectionné
        this.registry.set('selectedCharacter', character);

        // Transition avec effet de particules
        const particles = this.add.particles('particles');
        particles.createEmitter({
            frame: 'white',
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 50
        });

        // Transition vers la scène de jeu
        this.cameras.main.fadeOut(1000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }

    update() {
        // Animation du fond en parallaxe
        this.backgroundParallax.tilePositionX += 0.5;
        this.backgroundParallax.tilePositionY += 0.2;
    }
}
