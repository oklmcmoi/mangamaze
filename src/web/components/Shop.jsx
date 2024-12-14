import React, { useState } from 'react';
import { TonConnect } from './TonConnect';

export const Shop = ({ tg, userData }) => {
    const [items] = useState([
        {
            id: 'naruto_skin',
            name: 'Skin Naruto',
            price: 10,
            image: '/assets/shop/naruto.png',
            type: 'skin'
        },
        {
            id: 'luffy_skin',
            name: 'Skin Luffy',
            price: 10,
            image: '/assets/shop/luffy.png',
            type: 'skin'
        },
        {
            id: 'power_boost',
            name: 'Power Boost',
            price: 5,
            image: '/assets/shop/power.png',
            type: 'powerup'
        }
    ]);

    const handlePurchase = async (item) => {
        try {
            // Vérifier si le wallet est connecté
            if (!window.ton) {
                alert("Veuillez connecter votre wallet TON");
                return;
            }

            // Créer la transaction
            const transaction = {
                to: process.env.SHOP_WALLET_ADDRESS,
                value: item.price * 1000000000, // Conversion en nanotons
                data: "Purchase: " + item.id
            };

            // Envoyer la transaction
            const result = await window.ton.send('ton_sendTransaction', [transaction]);
            
            if (result) {
                alert("Achat réussi !");
                // Mettre à jour l'inventaire du joueur
                updateInventory(item);
            }
        } catch (error) {
            console.error('Erreur lors de l\'achat:', error);
            alert("Erreur lors de l'achat. Veuillez réessayer.");
        }
    };

    const updateInventory = async (item) => {
        try {
            const response = await fetch('/api/inventory/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData?.id,
                    itemId: item.id
                })
            });
            
            const data = await response.json();
            if (!data.success) {
                throw new Error('Erreur lors de la mise à jour de l\'inventaire');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div className="shop-container">
            <div className="shop-header">
                <h2>Boutique</h2>
                <TonConnect />
            </div>

            <div className="items-grid">
                {items.map(item => (
                    <div key={item.id} className="shop-item">
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p>{item.price} TON</p>
                        <button 
                            className="purchase-btn"
                            onClick={() => handlePurchase(item)}>
                            Acheter
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
