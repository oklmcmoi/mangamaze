const { GameEngine } = require('../game/gameEngine');

function setupCommands(bot) {
    bot.onText(/\/play/, async (msg) => {
        const chatId = msg.chat.id;
        
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Naruto 🦊', callback_data: 'character_NARUTO' },
                        { text: 'Luffy 🏴‍☠️', callback_data: 'character_LUFFY' },
                        { text: 'Goku 👱', callback_data: 'character_GOKU' }
                    ]
                ]
            }
        };

        await bot.sendMessage(
            chatId,
            '🎮 Choisissez votre personnage:',
            opts
        );
    });

    bot.onText(/\/profile/, async (msg) => {
        const chatId = msg.chat.id;
        // TODO: Implémenter la récupération du profil depuis la base de données
        await bot.sendMessage(
            chatId,
            '👤 Votre Profil:\n' +
            'Meilleur score: 0\n' +
            'NFTs collectés: 0\n' +
            'Niveau: 1'
        );
    });

    bot.onText(/\/shop/, async (msg) => {
        const chatId = msg.chat.id;
        const shopItems = [
            { name: 'Power Up x3', price: '10 TON', id: 'powerup_3' },
            { name: 'Skin Rare', price: '50 TON', id: 'skin_rare' },
            { name: 'NFT Exclusif', price: '100 TON', id: 'nft_exclusive' }
        ];

        const keyboard = shopItems.map(item => [{
            text: `${item.name} - ${item.price}`,
            callback_data: `shop_${item.id}`
        }]);

        await bot.sendMessage(
            chatId,
            '🛍️ Boutique MangaMaze:\n' +
            'Utilisez TON pour acheter des items exclusifs!',
            {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            }
        );
    });

    bot.onText(/\/ranking/, async (msg) => {
        const chatId = msg.chat.id;
        // TODO: Implémenter la récupération du classement depuis la base de données
        await bot.sendMessage(
            chatId,
            '🏆 Classement Global:\n' +
            '1. Joueur1 - 1000 pts\n' +
            '2. Joueur2 - 800 pts\n' +
            '3. Joueur3 - 600 pts'
        );
    });
}

module.exports = {
    setupCommands
};
