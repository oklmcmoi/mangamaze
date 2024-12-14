const { Telegraf } = require('telegraf');

// Initialisation du bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Configuration des commandes
bot.command('start', async (ctx) => {
    try {
        const siteUrl = process.env.URL || 'https://mangamaze.netlify.app';
        await ctx.reply(
            '🎮 Bienvenue dans MangaMaze! \n\n' +
            'Choisissez votre personnage et commencez à jouer :\n' +
            '1. Naruto 🍜\n' +
            '2. Luffy 🏴‍☠️\n' +
            '3. Goku 🔥\n\n' +
            `Cliquez sur le lien pour jouer : ${siteUrl}`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Jouer maintenant! 🎮', url: siteUrl }
                        ]
                    ]
                }
            }
        );
    } catch (error) {
        console.error('Error in start command:', error);
        ctx.reply('Désolé, une erreur est survenue. Veuillez réessayer.');
    }
});

// Handler pour les webhooks Netlify
exports.handler = async (event) => {
    try {
        // Vérifier si c'est une requête POST
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        // Traiter la mise à jour Telegram
        const update = JSON.parse(event.body);
        await bot.handleUpdate(update);

        return { statusCode: 200, body: 'OK' };
    } catch (error) {
        console.error('Webhook error:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
