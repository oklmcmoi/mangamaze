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
        this.player.play('player-idle');
        
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
            this.player.setVelocityX(-160);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.flipX = false;
        }

        // Mouvement vertical
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }

        // Normalisation de la vitesse en diagonale
        this.player.body.velocity.normalize().scale(160);
        
        // Mise à jour des fantômes
        this.updateGhosts();
    }

    createPellets() {
        this.pellets = this.physics.add.group();
        this.powerPellets = this.physics.add.group();

        const tileWidth = 32;
        const tileHeight = 32;

        // Création des pastilles normales
        for (let y = 0; y < this.groundLayer.layer.height; y++) {
            for (let x = 0; x < this.groundLayer.layer.width; x++) {
                const tile = this.groundLayer.getTileAt(x, y);
                if (tile && tile.index === 0) { // Index 0 représente un espace vide
                    const pellet = this.pellets.create(x * tileWidth + tileWidth/2, y * tileHeight + tileHeight/2, 'pellet');
                    pellet.setScale(0.5);
                }
            }
        }

        // Ajout des power pellets aux coins accessibles
        const powerPositions = [
            {x: 1, y: 1}, {x: 18, y: 1},
            {x: 1, y: 18}, {x: 18, y: 18}
        ];

        powerPositions.forEach(pos => {
            if (!this.wallsLayer.getTileAt(pos.x, pos.y)) {
                const powerPellet = this.powerPellets.create(
                    pos.x * tileWidth + tileWidth/2,
                    pos.y * tileHeight + tileHeight/2,
                    'power-pellet'
                );
                powerPellet.setScale(0.8);
            }
        });

        // Configuration des collisions
        this.physics.add.overlap(this.player, this.pellets, this.collectPellet, null, this);
        this.physics.add.overlap(this.player, this.powerPellets, this.collectPowerPellet, null, this);
    }

    createGhosts() {
        const ghostColors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
        const ghostSpawns = [
            {x: 9, y: 9}, {x: 10, y: 9},
            {x: 9, y: 10}, {x: 10, y: 10}
        ];
        
        ghostSpawns.forEach((spawn, index) => {
            const ghost = this.physics.add.sprite(
                spawn.x * 32 + 16,
                spawn.y * 32 + 16,
                'ghost'
            );
            ghost.setTint(ghostColors[index]);
            ghost.play('ghost-move');
            
            this.physics.add.collider(ghost, this.wallsLayer);
            this.physics.add.overlap(this.player, ghost, this.handleGhostCollision, null, this);
            
            ghost.direction = Phaser.Math.Between(0, 3);
            ghost.moveTimer = 0;
            
            this.ghosts.push(ghost);
        });
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            font: '24px Arial',
            fill: '#ffffff'
        });
        this.scoreText.setScrollFactor(0);
    }

    updateGhosts() {
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
        ];

        this.ghosts.forEach(ghost => {
            if (ghost.moveTimer <= 0) {
                // Changer de direction
                const newDir = Phaser.Math.Between(0, 3);
                ghost.setVelocity(
                    directions[newDir].x * 100,
                    directions[newDir].y * 100
                );
                ghost.moveTimer = 60; // Changer de direction toutes les ~1 seconde
            } else {
                ghost.moveTimer--;
            }
        });
    }

    collectPellet(player, pellet) {
        pellet.destroy();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    collectPowerPellet(player, powerPellet) {
        powerPellet.destroy();
        this.score += 50;
        this.scoreText.setText(`Score: ${this.score}`);
        this.activatePowerUp();
    }

    activatePowerUp() {
        this.isPowerUp = true;
        this.ghosts.forEach(ghost => {
            ghost.setTint(0x0000ff);
        });

        if (this.powerUpTimer) {
            this.powerUpTimer.destroy();
        }

        this.powerUpTimer = this.time.delayedCall(8000, () => {
            this.isPowerUp = false;
            this.ghosts.forEach(ghost => {
                ghost.clearTint();
            });
        });
    }

    handleGhostCollision(player, ghost) {
        if (this.isPowerUp) {
            ghost.destroy();
            const index = this.ghosts.indexOf(ghost);
            if (index > -1) {
                this.ghosts.splice(index, 1);
            }
            this.score += 200;
            this.scoreText.setText(`Score: ${this.score}`);
        } else {
            this.gameOver();
        }
    }

    gameOver() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        
        this.add.text(400, 300, 'Game Over\nClick to restart', {
            fontSize: '48px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}
