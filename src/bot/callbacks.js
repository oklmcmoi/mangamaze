const { GameEngine } = require('../game/gameEngine');

const activeGames = new Map();

function setupCallbacks(bot) {
    bot.on('callback_query', async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        if (data.startsWith('character_')) {
            const character = data.split('_')[1];
            const game = new GameEngine(bot, chatId, character);
            activeGames.set(chatId, game);
            await game.startGame();
            
            await bot.answerCallbackQuery(callbackQuery.id, {
                text: `Vous jouez avec ${character}!`
            });
        }
        else if (data.startsWith('move_')) {
            const direction = data.split('_')[1];
            const game = activeGames.get(chatId);
            
            if (game) {
                game.movePlayer(direction);
                await bot.answerCallbackQuery(callbackQuery.id);
            }
        }
        else if (data.startsWith('shop_')) {
            const itemId = data.split('_')[1];
            // TODO: Implémenter l'achat avec TON
            await bot.answerCallbackQuery(callbackQuery.id, {
                text: 'Fonctionnalité de paiement TON en cours de développement'
            });
        }
    });
}

module.exports = {
    setupCallbacks
};
