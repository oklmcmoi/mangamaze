const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialisation du bot avec le token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Gestionnaire de la commande /start
bot.command('start', async (ctx) => {
    try {
        // Envoyer un message de bienvenue avec le lien vers le jeu
        await ctx.reply(
            '🎮 Bienvenue dans MangaMaze! \n\n' +
            'Choisissez votre personnage et commencez à jouer :\n' +
            '1. Naruto 🍜\n' +
            '2. Luffy 🏴‍☠️\n' +
            '3. Goku 🔥\n\n' +
            'Cliquez sur le lien pour jouer : http://localhost:3000',
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Jouer maintenant! 🎮', url: 'http://localhost:3000' }
                        ]
                    ]
                }
            }
        );

        // Log de démarrage
        console.log(`User ${ctx.from.id} started the bot`);
    } catch (error) {
        console.error('Error in start command:', error);
        ctx.reply('Désolé, une erreur est survenue. Veuillez réessayer.');
    }
});

// Gestionnaire d'erreurs
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('Une erreur est survenue. Veuillez réessayer plus tard.');
});

// Démarrage du bot
bot.launch()
    .then(() => {
        console.log('Bot is running');
    })
    .catch((err) => {
        console.error('Error starting bot:', err);
    });

// Gestion de l'arrêt gracieux
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
