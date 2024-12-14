import React, { useEffect, useRef } from 'react';
import { gameConfig } from '../game/config';
import Phaser from 'phaser';

export const Game = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        // Vérifier si le jeu n'est pas déjà initialisé
        if (!gameRef.current) {
            // Créer une nouvelle instance du jeu
            const game = new Phaser.Game({
                ...gameConfig,
                parent: 'game-container'
            });

            // Stocker l'instance du jeu
            gameRef.current = game;
        }

        // Nettoyage lors du démontage du composant
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="game-wrapper">
            <div id="game-container" className="game-container"></div>
        </div>
    );
};
