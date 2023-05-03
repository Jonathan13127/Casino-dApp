import React, { useState } from 'react';
import { Button } from 'reactstrap';
import './Header.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [walletAddress, setWalletAddress] = useState("");

    // const connectWallet = async () => {
    //     try {
    //         // Vérifiez si MetaMask est installé
    //         if (window.ethereum) {
    //             // Demande à l'utilisateur de se connecter à son portefeuille MetaMask
    //             const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    //             // Stocke l'adresse du portefeuille dans l'état de l'application
    //             setWalletAddress(accounts[0]);
    //         } else {
    //             console.log("MetaMask n'est pas installé");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     console.log(walletAddress);
    // };
    

    return (
        <div className="m-0">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-between align-items-center">
                <div className="container-fluid d-flex justify-content-center align-items-center">
                    <a className="navbar-brand" href="/">
                        <h1 className='m-0 h-auto'>
                            Casino dApp
                        </h1>
                    </a>

                    <button className="navbar-toggler" type="button" onClick={toggle}>
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={"collapse navbar-collapse " + (isOpen ? 'show' : '')}>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/Lottery">Lottery</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/CoinFlip">CoinFlip</a>
                            </li>
                        </ul>
                    </div>

                    {/* <div id="btnHeader" className='mr-5 d-flex justify-content-around align-items-center w-auto'>
                        <Button className="p-1" onClick={connectWallet}>Connect Wallet</Button>
                    </div> */}
                </div>
            </nav>
        </div>
    )
}