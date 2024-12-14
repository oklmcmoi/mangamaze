import React, { useState, useEffect } from 'react';

export const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeframe, setTimeframe] = useState('all'); // 'all', 'weekly', 'daily'

    useEffect(() => {
        fetchLeaderboard();
    }, [timeframe]);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
            const data = await response.json();
            if (data.success) {
                setLeaderboard(data.rankings);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du classement:', error);
        }
    };

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>Classement</h2>
                <div className="timeframe-selector">
                    <button 
                        className={timeframe === 'all' ? 'active' : ''}
                        onClick={() => setTimeframe('all')}>
                        Tout
                    </button>
                    <button 
                        className={timeframe === 'weekly' ? 'active' : ''}
                        onClick={() => setTimeframe('weekly')}>
                        Hebdo
                    </button>
                    <button 
                        className={timeframe === 'daily' ? 'active' : ''}
                        onClick={() => setTimeframe('daily')}>
                        Jour
                    </button>
                </div>
            </div>

            <div className="rankings-list">
                {leaderboard.map((player, index) => (
                    <div key={player.id} className={`ranking-item ${index < 3 ? 'top-3' : ''}`}>
                        <div className="rank">#{index + 1}</div>
                        <div className="player-info">
                            <img 
                                src={player.avatar || '/assets/default-avatar.png'} 
                                alt={player.username} 
                                className="avatar"
                            />
                            <span className="username">{player.username}</span>
                        </div>
                        <div className="score">{player.score}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
