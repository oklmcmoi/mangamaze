const GAME_CONFIG = {
    GRID_SIZE: 15,
    GAME_SPEED: 500,
    POWER_UP_DURATION: 10000
};

const CHARACTERS = {
    NARUTO: {
        name: 'Naruto',
        power: 'Shadow Clone',
        sprite: '🦊'
    },
    LUFFY: {
        name: 'Luffy',
        power: 'Gear Second',
        sprite: '🏴‍☠️'
    },
    GOKU: {
        name: 'Goku',
        power: 'Kamehameha',
        sprite: '👱'
    }
};

class GameEngine {
    constructor(bot, chatId, character) {
        this.bot = bot;
        this.chatId = chatId;
        this.character = CHARACTERS[character];
        this.score = 0;
        this.gameState = null;
        this.powerUpActive = false;
    }

    async startGame() {
        this.gameState = this.initializeGameState();
        await this.renderGame();
        this.gameLoop = setInterval(() => this.update(), GAME_CONFIG.GAME_SPEED);
    }

    initializeGameState() {
        // Initialisation de la grille de jeu
        return {
            grid: Array(GAME_CONFIG.GRID_SIZE).fill().map(() => 
                Array(GAME_CONFIG.GRID_SIZE).fill('⚪')),
            playerPos: { x: 1, y: 1 },
            ghosts: [
                { x: 13, y: 13 },
                { x: 13, y: 1 },
                { x: 1, y: 13 }
            ]
        };
    }

    async renderGame() {
        let gameBoard = this.gameState.grid.map((row, y) => {
            return row.map((cell, x) => {
                if (x === this.gameState.playerPos.x && y === this.gameState.playerPos.y) {
                    return this.character.sprite;
                }
                if (this.gameState.ghosts.some(ghost => ghost.x === x && ghost.y === y)) {
                    return '👻';
                }
                return cell;
            }).join('');
        }).join('\n');

        const message = `
MangaMaze - ${this.character.name}
Score: ${this.score}
${this.powerUpActive ? '⭐ Power Up Active! ⭐\n' : ''}
${gameBoard}
`;

        await this.bot.sendMessage(this.chatId, message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '⬆️', callback_data: 'move_up' },
                    ],
                    [
                        { text: '⬅️', callback_data: 'move_left' },
                        { text: '➡️', callback_data: 'move_right' }
                    ],
                    [
                        { text: '⬇️', callback_data: 'move_down' }
                    ]
                ]
            }
        });
    }

    movePlayer(direction) {
        const newPos = { ...this.gameState.playerPos };
        
        switch (direction) {
            case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
            case 'down': newPos.y = Math.min(GAME_CONFIG.GRID_SIZE - 1, newPos.y + 1); break;
            case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
            case 'right': newPos.x = Math.min(GAME_CONFIG.GRID_SIZE - 1, newPos.x + 1); break;
        }

        this.gameState.playerPos = newPos;
        this.checkCollisions();
        this.renderGame();
    }

    checkCollisions() {
        // Vérification des collisions avec les fantômes
        if (this.gameState.ghosts.some(ghost => 
            ghost.x === this.gameState.playerPos.x && 
            ghost.y === this.gameState.playerPos.y)) {
            if (!this.powerUpActive) {
                this.endGame();
            } else {
                this.score += 100;
                // Réinitialiser la position des fantômes
                this.gameState.ghosts = this.gameState.ghosts.map(ghost => ({
                    x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
                    y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE)
                }));
            }
        }
    }

    endGame() {
        clearInterval(this.gameLoop);
        this.bot.sendMessage(this.chatId, 
            `🎮 Game Over!\nScore final: ${this.score}\n\nTapez /play pour rejouer!`);
    }
}

function initializeGame(bot) {
    return new GameEngine(bot);
}

module.exports = {
    initializeGame,
    GameEngine
};
