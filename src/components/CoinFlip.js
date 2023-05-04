import { useEffect, useState } from 'react';
import CoinFlip from '../artifacts/contracts/CoinFlip.sol/CoinFlip.json';
import { Button } from 'reactstrap';
import { FaEthereum } from 'react-icons/fa';
import '../App.css';

const ethers = require("ethers")

let CoinFlipAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"


export const CoinFlipGame = () => {

    const [balance, setBalance] = useState(0);
    const [isOwner, setOwner] = useState(false);
    const [Amount, setAmount] = useState(0);
    const [side, setSide] = useState("undefined");


    useEffect(() => {
        getBalance();
        getOwner();
    })

    /*
      Récupére la balance du contract
    */
    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(CoinFlipAddress, CoinFlip.abi, provider);
            try {
                let overrides = {
                    from: accounts[0]
                }
                const data = await contract.getBalance(overrides)
                setBalance(String(data));
            } catch (err) {
                console.log(err);
            }
        }
    }

    async function getOwner() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CoinFlipAddress, CoinFlip.abi, signer);

            try {
                const transaction = await contract.getOwner();
                // console.log("Recu: ",transaction);
                // console.log("Conn: ",accounts[0]);
                if (transaction.toUpperCase() == accounts[0].toUpperCase()) {
                    setOwner(true);
                    // console.log(transaction);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    async function addFunds() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CoinFlipAddress, CoinFlip.abi, signer);

            try {
                const transaction = await contract.addFunds({ from: accounts[0], value: ethers.utils.parseEther(Amount.toString()) });
                await transaction.wait();
                getBalance();
                // console.log("Recu: ",transaction);
                // console.log("Conn: ",accounts[0]);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    async function withDrawEther() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CoinFlipAddress, CoinFlip.abi, signer);

            try {
                const transaction = await contract.withDrawEther({ from: accounts[0] });
                await transaction.wait();
                getBalance();
                // console.log("Recu: ",transaction);
                // console.log("Conn: ",accounts[0]);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    async function Bet(e) {
        if(side < 0 || side > 1){
            return
        }
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CoinFlipAddress, CoinFlip.abi, signer);

            try {
                const transaction = await contract.bet(side,{ from: accounts[0],value:ethers.utils.parseEther("1.0") });
                await transaction.wait();
                getBalance();
                // console.log("Recu: ",transaction);
                // console.log("Conn: ",accounts[0]);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const handleChange = (e) => {
        setAmount(e.target.value)
    }

    const handleChangeChoice = (e) =>{
        var side = parseInt(e.target.value);
        console.log(side)
        setSide(side)
    }

    return (
        <main className='h-100 w-100 d-flex justify-content-center align-items-center'>

            <div className='mb-2 p-1 d-flex justify-content-center align-items-center'>
                <h1 className='mt-0'>{balance / 10 ** 18} </h1>
                <FaEthereum size={40} />
            </div>

            <div className='d-flex-column justify-content-center align-items-center'>
                    <input type="radio" value="0" name="side" onChange={handleChangeChoice} /> Pile
                    <input type="radio" value="1" name="side" onChange={handleChangeChoice} /> Face
                    <button onClick={Bet}>Bet</button>
                {isOwner && 
                <div>
                    <input type='number' onChange={handleChange} />
                    <Button color='success' className='m-1' onClick={addFunds}>Add funds</Button>
                    <Button color='success' className='m-1' onClick={withDrawEther}>Withdraw All</Button>
                </div>}
            </div>

        </main>
    )
}