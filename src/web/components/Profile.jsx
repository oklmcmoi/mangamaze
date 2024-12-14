import React, { useState, useEffect } from 'react';

export const Profile = ({ tg, userData }) => {
    const [profile, setProfile] = useState({
        username: userData?.username || 'Joueur',
        highScore: 0,
        nfts: [],
        level: 1
    });

    useEffect(() => {
        // Charger les données du profil depuis le serveur
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userData?.id })
            });
            const data = await response.json();
            if (data.success) {
                setProfile(data.profile);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du profil:', error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profil de {profile.username}</h2>
            </div>
            
            <div className="profile-stats">
                <div className="stat-item">
                    <h3>Meilleur Score</h3>
                    <p>{profile.highScore}</p>
                </div>
                
                <div className="stat-item">
                    <h3>Niveau</h3>
                    <p>{profile.level}</p>
                </div>
            </div>

            <div className="nft-collection">
                <h3>Collection NFT</h3>
                <div className="nft-grid">
                    {profile.nfts.map((nft, index) => (
                        <div key={index} className="nft-item">
                            <img src={nft.image} alt={nft.name} />
                            <p>{nft.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
