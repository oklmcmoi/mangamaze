import React, { useEffect, useState } from 'react';
import { Game } from './Game';
import { Profile } from './Profile';
import { Shop } from './Shop';
import { Leaderboard } from './Leaderboard';

const App = () => {
    const [tg, setTg] = useState(null);
    const [currentView, setCurrentView] = useState('game');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const telegram = window.Telegram.WebApp;
        setTg(telegram);
        telegram.ready();
        
        // Récupérer les données de l'utilisateur Telegram
        setUserData(telegram.initDataUnsafe?.user);

        // Configurer le bouton principal
        telegram.MainButton.setText('JOUER');
        telegram.MainButton.show();
    }, []);

    const renderView = () => {
        switch(currentView) {
            case 'game':
                return <Game tg={tg} userData={userData} />;
            case 'profile':
                return <Profile tg={tg} userData={userData} />;
            case 'shop':
                return <Shop tg={tg} userData={userData} />;
            case 'leaderboard':
                return <Leaderboard />;
            default:
                return <Game tg={tg} userData={userData} />;
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <span className="navbar-brand">MangaMaze</span>
                    <div className="navbar-nav">
                        <button 
                            className={`nav-link btn ${currentView === 'game' ? 'active' : ''}`}
                            onClick={() => setCurrentView('game')}>
                            Jouer
                        </button>
                        <button 
                            className={`nav-link btn ${currentView === 'profile' ? 'active' : ''}`}
                            onClick={() => setCurrentView('profile')}>
                            Profil
                        </button>
                        <button 
                            className={`nav-link btn ${currentView === 'shop' ? 'active' : ''}`}
                            onClick={() => setCurrentView('shop')}>
                            Boutique
                        </button>
                        <button 
                            className={`nav-link btn ${currentView === 'leaderboard' ? 'active' : ''}`}
                            onClick={() => setCurrentView('leaderboard')}>
                            Classement
                        </button>
                    </div>
                </div>
            </nav>
            <main className="container mt-4">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
