require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { initializeGame } = require('./game/gameEngine');
const { setupCommands } = require('./bot/commands');
const { setupCallbacks } = require('./bot/callbacks');

// Initialisation du bot Telegram
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Initialisation du jeu
initializeGame(bot);

// Configuration des commandes du bot
setupCommands(bot);

// Configuration des callbacks
setupCallbacks(bot);

// Gestion des messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  if (msg.text === '/start') {
    await bot.sendMessage(chatId, 
      'Bienvenue dans MangaMaze! 🎮\n\n' +
      'Un jeu Pac-Man unique avec des personnages de manga!\n\n' +
      'Commandes disponibles:\n' +
      '/play - Commencer une nouvelle partie\n' +
      '/profile - Voir votre profil et vos NFTs\n' +
      '/shop - Accéder à la boutique\n' +
      '/ranking - Voir le classement'
    );
  }
});

console.log('MangaMaze Bot est démarré! 🎮');
