import React, { useState, useEffect } from 'react';
import TonWeb from 'tonweb';

export const TonConnect = () => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        initTonWeb();
    }, []);

    const initTonWeb = async () => {
        const tonweb = new TonWeb(new TonWeb.HttpProvider('https://go.getblock.io/c2637ba037f1406884ad728be2e1047e'));
        
        try {
            // Vérifier si TonWeb est disponible dans le navigateur
            if (window.ton) {
                const provider = window.ton;
                const accounts = await provider.send('ton_requestAccounts');
                
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    const balance = await tonweb.getBalance(accounts[0]);
                    setBalance(TonWeb.utils.fromNano(balance));
                }
            }
        } catch (error) {
            console.error('Erreur lors de la connexion à TON:', error);
        }
    };

    const connectWallet = async () => {
        try {
            if (window.ton) {
                const accounts = await window.ton.send('ton_requestAccounts');
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                }
            } else {
                alert("Veuillez installer l'extension TON Wallet");
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
        }
    };

    return (
        <div className="ton-connect">
            {wallet ? (
                <div className="wallet-info">
                    <p>Wallet: {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}</p>
                    <p>Balance: {balance} TON</p>
                </div>
            ) : (
                <button className="connect-button" onClick={connectWallet}>
                    Connecter Wallet TON
                </button>
            )}
        </div>
    );
};
