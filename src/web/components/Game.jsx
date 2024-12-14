import React, { useEffect, useRef } from 'react';
import { TonConnect } from './TonConnect';
import { gameConfig } from '../game/config';
import Phaser from 'phaser';

export const Game = ({ tg, userData }) => {
    const gameRef = useRef(null);

    useEffect(() => {
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game({
                ...gameConfig,
                parent: 'game-container'
            });
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="game-wrapper">
            <div className="game-header">
                <TonConnect />
            </div>
            <div id="game-container" className="game-container"></div>
        </div>
    );
};
