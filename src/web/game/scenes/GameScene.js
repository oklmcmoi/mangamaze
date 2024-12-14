import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.player = null;
        this.ghosts = [];
        this.pellets = null;
        this.powerPellets = null;
        this.isPowerUp = false;
    }

    create() {
        // Configuration du rendu graphique
        this.cameras.main.setBackgroundColor('#000000');
        this.lights.enable();
        this.lights.setAmbientColor(0x555555);

        // Création de la carte avec effets de profondeur
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset', 'tiles');
        
        // Effet de parallaxe pour le fond
        this.backgroundParallax = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'game-background')
            .setOrigin(0, 0)
            .setScrollFactor(0.3, 0.3)
            .setDepth(-1);

        // Couches de la carte avec effets de profondeur
        this.groundLayer = map.createLayer('Ground', tileset).setDepth(0);
        this.decorLayer = map.createLayer('Decorations', tileset).setDepth(1);
        this.wallsLayer = map.createLayer('Walls', tileset).setDepth(2);
        
        // Ajout d'effets d'éclairage dynamique
        this.wallsLayer.setPipeline('Light2D');
        this.decorLayer.setPipeline('Light2D');

        // Système de particules pour les effets ambiants
        this.particlesAmbient = this.add.particles('particles');
        this.particlesAmbient.createEmitter({
            frame: 'blue',
            x: { min: 0, max: this.cameras.main.width },
            y: { min: 0, max: this.cameras.main.height },
            lifespan: 2000,
            speed: { min: 20, max: 50 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            frequency: 200
        });

        // Configuration des collisions avec effets visuels
        this.wallsLayer.setCollisionByProperty({ collides: true });
        
        // Création du joueur avec animations améliorées
        const character = this.registry.get('selectedCharacter') || 'naruto';
        this.player = this.physics.add.sprite(48, 48, character);
        this.player.setCollideWorldBounds(true);
        this.player.setSize(28, 28);
        
        // Lumière suivant le joueur
        this.playerLight = this.lights.addLight(this.player.x, this.player.y, 200, 0xffffff, 1);

        // Effets de particules pour le mouvement du joueur
        this.playerParticles = this.add.particles('particles');
        this.playerTrail = this.playerParticles.createEmitter({
            frame: 'blue',
            follow: this.player,
            frequency: 100,
            speed: { min: 50, max: 100 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 500
        });
        this.playerTrail.stop();

        // Animations du joueur
        this.createPlayerAnimations(character);

        // Création des pastilles avec effets visuels
        this.createEnhancedPellets();

        // Création des fantômes avec effets visuels améliorés
        this.createEnhancedGhosts();

        // Interface utilisateur améliorée
        this.createEnhancedUI();

        // Configuration de la caméra avec effets
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5);
        this.cameras.main.fadeIn(1000);

        // Post-processing effects
        this.postFX = this.cameras.main.postFX.addBloom(0.5, 0.5, 0.5);
    }

    createPlayerAnimations(character) {
        // Animations fluides pour le joueur
        const frameRate = 12;
        const directions = ['left', 'right', 'up', 'down'];
        
        directions.forEach(dir => {
            this.anims.create({
                key: `${character}-walk-${dir}`,
                frames: this.anims.generateFrameNumbers(character, {
                    start: dir === 'left' ? 0 : dir === 'right' ? 3 : dir === 'up' ? 6 : 9,
                    end: dir === 'left' ? 2 : dir === 'right' ? 5 : dir === 'up' ? 8 : 11
                }),
                frameRate,
                repeat: -1
            });
        });

        // Animation de power-up
        this.anims.create({
            key: `${character}-power`,
            frames: this.anims.generateFrameNumbers(`${character}-power`, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    }

    createEnhancedPellets() {
        this.pellets = this.physics.add.group();
        this.powerPellets = this.physics.add.group();

        // Effet de brillance pour les pastilles
        const pelletGlow = this.lights.addLight(0, 0, 32, 0x7777ff, 0.5);

        // Création des pastilles avec animation
        for (let y = 0; y < this.map.height; y++) {
            for (let x = 0; x < this.map.width; x++) {
                if (this.isPelletPosition(x, y)) {
                    const pellet = this.pellets.create(x * 32 + 16, y * 32 + 16, 'pellet');
                    pellet.setScale(0.3);
                    
                    // Animation de flottement
                    this.tweens.add({
                        targets: pellet,
                        y: pellet.y - 2,
                        duration: 1500,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            }
        }

        // Power pellets avec effets spéciaux
        const powerPositions = this.getPowerPelletPositions();
        powerPositions.forEach(pos => {
            const powerPellet = this.powerPellets.create(pos.x * 32 + 16, pos.y * 32 + 16, 'power-pellet');
            powerPellet.setScale(0.5);
            
            // Animation de pulsation
            this.tweens.add({
                targets: powerPellet,
                scale: 0.7,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Particules autour du power pellet
            const particles = this.add.particles('particles');
            particles.createEmitter({
                frame: 'yellow',
                follow: powerPellet,
                quantity: 1,
                speed: { min: 50, max: 100 },
                scale: { start: 0.2, end: 0 },
                alpha: { start: 0.5, end: 0 },
                blendMode: 'ADD',
                lifespan: 1000
            });
        });
    }

    createEnhancedGhosts() {
        this.ghosts = [];
        const ghostColors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
        
        ghostColors.forEach((color, index) => {
            const ghost = this.physics.add.sprite(48 + index * 32, 48, 'ghost');
            ghost.setTint(color);
            ghost.setScale(0.8);
            
            // Effet de flottement
            this.tweens.add({
                targets: ghost,
                y: ghost.y - 5,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Particules de traînée
            const particles = this.add.particles('particles');
            particles.createEmitter({
                frame: 'white',
                follow: ghost,
                quantity: 1,
                speed: { min: 20, max: 50 },
                scale: { start: 0.1, end: 0 },
                alpha: { start: 0.3, end: 0 },
                blendMode: 'ADD',
                lifespan: 500
            });

            this.ghosts.push(ghost);
            this.physics.add.collider(ghost, this.wallsLayer);
        });
    }

    createEnhancedUI() {
        // Interface utilisateur moderne
        const padding = 20;
        
        // Score avec effet de brillance
        this.scoreText = this.add.text(padding, padding, 'Score: 0', {
            font: 'bold 24px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: { blur: 2, color: '#000000', fill: true }
        });
        this.scoreText.setScrollFactor(0);
        
        // Animation lors du changement de score
        this.registry.events.on('changedata-score', (_, value) => {
            this.tweens.add({
                targets: this.scoreText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true
            });
            this.scoreText.setText(`Score: ${value}`);
        });
    }

    update() {
        if (!this.player) return;

        // Mise à jour des effets visuels
        this.backgroundParallax.tilePositionX += 0.5;
        this.backgroundParallax.tilePositionY += 0.2;
        
        // Mise à jour de la lumière du joueur
        this.playerLight.x = this.player.x;
        this.playerLight.y = this.player.y;

        // Mouvement du joueur avec effets de particules
        const speed = 160;
        let velocityX = 0;
        let velocityY = 0;
        let isMoving = false;

        if (this.cursors.left.isDown) {
            velocityX = -speed;
            this.player.play('walk-left', true);
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
            this.player.play('walk-right', true);
            isMoving = true;
        }

        if (this.cursors.up.isDown) {
            velocityY = -speed;
            this.player.play('walk-up', true);
            isMoving = true;
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
            this.player.play('walk-down', true);
            isMoving = true;
        }

        // Activation/désactivation des particules de mouvement
        if (isMoving) {
            this.playerTrail.start();
        } else {
            this.playerTrail.stop();
            this.player.stop();
        }

        this.player.setVelocity(velocityX, velocityY);

        // Mise à jour des fantômes avec IA améliorée
        this.updateGhosts();
    }

    updateGhosts() {
        this.ghosts.forEach(ghost => {
            if (!ghost.moveTimer) {
                this.setNewGhostDirection(ghost);
            }
        });
    }

    setNewGhostDirection(ghost) {
        const directions = ['up', 'down', 'left', 'right'];
        const direction = directions[Phaser.Math.Between(0, 3)];
        const speed = 100;

        switch(direction) {
            case 'up':
                ghost.setVelocity(0, -speed);
                break;
            case 'down':
                ghost.setVelocity(0, speed);
                break;
            case 'left':
                ghost.setVelocity(-speed, 0);
                break;
            case 'right':
                ghost.setVelocity(speed, 0);
                break;
        }

        ghost.moveTimer = this.time.addEvent({
            delay: 2000,
            callback: () => {
                ghost.moveTimer = null;
            }
        });
    }

    collectPellet(player, pellet) {
        pellet.destroy();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        this.sound.play('eat');
    }

    collectPowerPellet(player, powerPellet) {
        powerPellet.destroy();
        this.score += 50;
        this.scoreText.setText(`Score: ${this.score}`);
        this.sound.play('power-up');
        this.activatePowerUp();
    }

    activatePowerUp() {
        this.isPowerUp = true;
        this.ghosts.forEach(ghost => {
            ghost.setTint(0x0000ff);
        });

        this.time.delayedCall(10000, () => {
            this.isPowerUp = false;
            this.ghosts.forEach(ghost => {
                ghost.clearTint();
            });
        });
    }

    handleGhostCollision(player, ghost) {
        if (this.isPowerUp) {
            ghost.destroy();
            this.score += 200;
            this.scoreText.setText(`Score: ${this.score}`);
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.sound.play('death');

        this.time.delayedCall(2000, () => {
            this.scene.start('MenuScene');
        });
    }
}
