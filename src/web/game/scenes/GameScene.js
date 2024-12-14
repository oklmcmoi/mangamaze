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
        // Récupération des données de la map
        const mapData = this.cache.json.get('mapData');
        
        // Création de la map
        this.map = this.make.tilemap({ data: mapData.layers[0].data, tileWidth: 32, tileHeight: 32, width: 20, height: 20 });
        const tileset = this.map.addTilesetImage('tileset', 'tiles');
        this.groundLayer = this.map.createLayer(0, tileset, 0, 0);

        // Création du joueur
        this.player = this.physics.add.sprite(48, 48, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.play('player-idle');
        
        // Création des fantômes
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
            ghost.setTint(0xff0000);
            ghost.play('ghost-move');
            
            this.physics.add.collider(ghost, this.groundLayer);
            this.physics.add.overlap(this.player, ghost, this.handleGhostCollision, null, this);
            
            ghost.direction = Phaser.Math.Between(0, 3);
            ghost.moveTimer = 0;
            
            this.ghosts.push(ghost);
        });

        // Création des pastilles
        this.createPellets();

        // Configuration des collisions
        this.groundLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, this.groundLayer);
        this.physics.add.collider(this.ghosts, this.groundLayer);

        // Configuration des contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Interface utilisateur
        this.createUI();
    }

    createPellets() {
        this.pellets = this.physics.add.group();
        this.powerPellets = this.physics.add.group();

        // Placement des pastilles en fonction de la map
        const mapData = this.cache.json.get('mapData');
        const layer = mapData.layers[0];
        
        for (let y = 0; y < layer.height; y++) {
            for (let x = 0; x < layer.width; x++) {
                const tile = layer.data[y * layer.width + x];
                if (tile === 0) { // Si c'est un espace vide
                    if (Math.random() < 0.8) { // 80% de chance d'avoir une pastille normale
                        const pellet = this.pellets.create(x * 32 + 16, y * 32 + 16, 'pellet');
                        pellet.setScale(0.5);
                    } else if (Math.random() < 0.2) { // 20% de chance d'avoir une super pastille
                        const powerPellet = this.powerPellets.create(x * 32 + 16, y * 32 + 16, 'power-pellet');
                        powerPellet.setScale(0.8);
                    }
                }
            }
        }

        // Collision avec les pastilles
        this.physics.add.overlap(this.player, this.pellets, this.collectPellet, null, this);
        this.physics.add.overlap(this.player, this.powerPellets, this.collectPowerPellet, null, this);
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            font: '24px Arial',
            fill: '#ffffff'
        });
        this.scoreText.setScrollFactor(0);
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
