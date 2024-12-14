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
        // Création de la carte
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tiles');
        
        // Création des couches
        this.groundLayer = map.createLayer('Ground', tileset);
        this.wallsLayer = map.createLayer('Walls', tileset);
        
        // Configuration des collisions
        this.wallsLayer.setCollisionByExclusion([-1]);
        
        // Création du joueur
        const spawnPoint = { x: 48, y: 48 };
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        
        // Configuration de la caméra
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Configuration des collisions entre le joueur et les murs
        this.physics.add.collider(this.player, this.wallsLayer);
        
        // Configuration des contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Ajout des particules
        this.particles = this.add.particles('particles');
        this.emitter = this.particles.createEmitter({
            x: 0,
            y: 0,
            speed: { min: 20, max: 50 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            frequency: 50
        });
        this.emitter.startFollow(this.player);
    }

    update() {
        if (!this.player) return;

        // Réinitialisation de la vélocité
        this.player.setVelocity(0);

        // Mouvement horizontal
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        }

        // Mouvement vertical
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        }

        // Normalisation de la vitesse en diagonale
        this.player.body.velocity.normalize().scale(200);
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
