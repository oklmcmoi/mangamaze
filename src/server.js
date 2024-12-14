const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// Configuration du bot Telegram
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Route principale pour servir l'application web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// API endpoints pour le jeu
app.post('/api/start-game', (req, res) => {
    const { userId, character } = req.body;
    // Logique pour démarrer une nouvelle partie
    res.json({ success: true, gameId: Date.now() });
});

app.post('/api/save-score', (req, res) => {
    const { userId, score } = req.body;
    // Logique pour sauvegarder le score
    res.json({ success: true });
});

// Commandes du bot Telegram
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const gameUrl = `https://t.me/${bot.options.username}`;
    
    bot.sendMessage(chatId, 
        'Bienvenue dans MangaMaze! 🎮\n\n' +
        'Jouez à Pac-Man avec vos personnages de manga préférés!\n\n' +
        'Cliquez sur le bouton ci-dessous pour commencer:',
        {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: '🎮 Jouer maintenant!',
                        web_app: { url: gameUrl }
                    }
                ]]
            }
        }
    );
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
