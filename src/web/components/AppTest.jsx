import React, { useEffect } from 'react';
import { Game } from '../game/config';

function App() {
    useEffect(() => {
        const game = new Game();
        
        // Cleanup on unmount
        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <div id="game-container" style={{ width: '100vw', height: '100vh' }}></div>
    );
}

export default App;
