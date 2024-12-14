# MangaMaze - Pac-Man Manga Edition

Un jeu Pac-Man innovant combinant l'univers des mangas avec la blockchain TON, disponible via Telegram.

## Fonctionnalités

- Gameplay Pac-Man avec des personnages de manga
- Intégration blockchain TON pour les NFTs et récompenses
- Bot Telegram pour jouer directement dans l'application
- Système de classement et compétitions
- Boutique virtuelle avec items cosmétiques
- Événements spéciaux et tournois

## Déploiement sur Netlify

1. Créez un compte sur [Netlify](https://www.netlify.com/) si ce n'est pas déjà fait

2. Connectez votre compte GitHub à Netlify

3. Cliquez sur "New site from Git" et sélectionnez votre dépôt

4. Configurez les variables d'environnement dans Netlify :
   - `TELEGRAM_BOT_TOKEN`: Votre token de bot Telegram
   - `URL`: L'URL de votre site Netlify (à configurer après le premier déploiement)

5. Déployez !

## Configuration du Bot Telegram

1. Allez sur [@BotFather](https://t.me/botfather) sur Telegram
2. Créez un nouveau bot avec la commande `/newbot`
3. Copiez le token fourni et ajoutez-le dans les variables d'environnement de Netlify
4. Une fois le site déployé, configurez le webhook :
   ```
   https://api.telegram.org/bot<VOTRE_TOKEN>/setWebhook?url=https://votre-site.netlify.app/.netlify/functions/bot
   ```

## Développement local

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Créez un fichier `.env` avec les variables nécessaires :
   ```
   TELEGRAM_BOT_TOKEN=votre_token_telegram
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Le jeu sera disponible sur `http://localhost:3000`

## Technologies utilisées

- React
- Phaser 3
- Telegraf (Bot Telegram)
- Netlify Functions
- TON Blockchain

## Configuration requise

- Node.js v16+
- MongoDB
- Compte Telegram Bot
- Wallet TON

## Installation

1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Configurer les variables d'environnement
4. Lancer le serveur : `npm start`

## Structure du projet

```
mangamaze/
├── src/
│   ├── bot/           # Logic du bot Telegram
│   ├── game/          # Core gameplay
│   ├── blockchain/    # Intégration TON
│   ├── database/      # Models et connexion DB
│   └── web/          # Interface web React
├── contracts/         # Smart contracts TON
└── config/           # Fichiers de configuration
```
