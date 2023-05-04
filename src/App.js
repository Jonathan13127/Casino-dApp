import logo from './logo.svg';
import './App.css';
import { LotteryGame } from './components/Lottery'
import { CoinFlipGame } from './components/CoinFlip'

import { Header } from './components/Header/Header';
import { Routes, Route } from 'react-router-dom';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, sepolia, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, localhost, hardhat } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Home } from './components/Home'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';


function App() {

  const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, arbitrum, localhost, sepolia, hardhat],
    [
      // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: 'Casino dApp IBC',
    projectId: '9954faf5fc0a281d557e104d296e05c0',
    chains
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  return (
    <div className="App h-100 w-100" id="App">
      {/* <WagmiConfig client={wagmiClient} >
        <RainbowKitProvider chains={chains} theme={darkTheme()} > */}
          <Header />
          {/* <div className='w-100 d-flex justify-content-center align-items-center my-4 mb-5'>
            <ConnectButton className="p-1" >Connect Wallet</ConnectButton>
          </div> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Lottery" element={<LotteryGame />} />
            <Route path="/CoinFlip" element={<CoinFlipGame />} />
          </Routes>
        {/* </RainbowKitProvider>
      </WagmiConfig> */}
    </div>

  );
}

export default App;
