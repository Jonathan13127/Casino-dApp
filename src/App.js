import logo from './logo.svg';
import './App.css';
import { LotteryGame } from './components/Lottery'
import { Header } from './components/Header/Header';
import { Routes, Route } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, sepolia, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, localhost } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Home } from './components/Home'


function App() {

  const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, arbitrum, localhost, sepolia],
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
    <div className="App h-100 w-100">
      {/* <WagmiConfig client={wagmiClient} >
        <RainbowKitProvider chains={chains} theme={darkTheme()}> */}
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Lottery" element={<LotteryGame />} />
            <Route path="/CoinFlip" element={<LotteryGame />} />
          </Routes>
        {/* </RainbowKitProvider>
      </WagmiConfig> */}
    </div>

  );
}

export default App;
