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
        const tileset = map.addTilesetImage('tiles', 'tiles');
        
        // Création des couches
        this.groundLayer = map.createLayer('Ground', tileset);
        this.wallsLayer = map.createLayer('Walls', tileset);
        
        // Configuration des collisions
        this.wallsLayer.setCollisionByExclusion([-1]);
        
        // Création du joueur
        const spawnPoint = { x: 48, y: 48 };
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Configuration de la caméra
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Configuration des collisions entre le joueur et les murs
        this.physics.add.collider(this.player, this.wallsLayer);
        
        // Configuration des contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Création des pastilles
        this.createPellets();
        
        // Création des fantômes
        this.createGhosts();
        
        // Interface utilisateur
        this.createUI();
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
        
        // Mise à jour des fantômes
        this.updateGhosts();
    }

    createPellets() {
        this.pellets = this.physics.add.group();
        this.powerPellets = this.physics.add.group();

        // Création des pastilles
        for (let y = 1; y < 19; y++) {
            for (let x = 1; x < 19; x++) {
                if (this.canPlacePellet(x, y)) {
                    const pellet = this.pellets.create(x * 32 + 16, y * 32 + 16, 'pellet');
                    pellet.setScale(0.3);
                }
            }
        }

        // Ajout des power pellets aux coins
        const powerPositions = [
            {x: 1, y: 1}, {x: 18, y: 1},
            {x: 1, y: 18}, {x: 18, y: 18}
        ];

        powerPositions.forEach(pos => {
            const powerPellet = this.powerPellets.create(pos.x * 32 + 16, pos.y * 32 + 16, 'power-pellet');
            powerPellet.setScale(0.5);
        });

        // Configuration des collisions
        this.physics.add.overlap(this.player, this.pellets, this.collectPellet, null, this);
        this.physics.add.overlap(this.player, this.powerPellets, this.collectPowerPellet, null, this);
    }

    canPlacePellet(x, y) {
        const tile = this.wallsLayer.getTileAt(x, y);
        return !tile || tile.index === -1;
    }

    createGhosts() {
        const ghostColors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
        
        ghostColors.forEach((color, index) => {
            const ghost = this.physics.add.sprite(48 + index * 32, 48, 'ghost');
            ghost.setTint(color);
            ghost.setScale(0.8);
            
            this.physics.add.collider(ghost, this.wallsLayer);
            this.physics.add.overlap(this.player, ghost, this.handleGhostCollision, null, this);
            
            this.ghosts.push(ghost);
        });
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            font: 'bold 24px Arial',
            fill: '#ffffff'
        });
        this.scoreText.setScrollFactor(0);
    }

    updateGhosts() {
        this.ghosts.forEach(ghost => {
            if (!ghost.moveTimer || ghost.moveTimer.getProgress() === 1) {
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
            this.scene.restart();
        });
    }
}
