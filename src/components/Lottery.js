import { useEffect,useState } from 'react';
import Lottery from '../artifacts/contracts/Lottery.sol/Lottery.json';
import { Button } from 'reactstrap';
import {FaEthereum} from 'react-icons/fa';
import '../App.css';


const ethers = require("ethers")

let LotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const LotteryGame = () =>{

    const [balance, setBalance] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isOwner, setOwner] = useState(false);
    const [players, setPlayers] = useState([]);
  
    useEffect(() => {
      getBalance();
      getPlayers();
      getOwner();
    })
  
    /*
      Récupére la balance du contract
    */
    async function getBalance() {
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider);
        try{
          let overrides = {
            from: accounts[0]
          }
          const data = await contract.getBalance(overrides)
          setBalance(String(data));
        }catch(err){
          console.log(err);
          setError("Une erreur est survenue.")
        }
      }
    }

    async function checkIfPlayerPlayed(){
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider);
        var played = false;
        try{
          played = await contract.checkIfPlayerPlayed(accounts[0]);
        }catch(err){
          console.log(err);
          setError("Une erreur est survenue.")
        }
        return played;
      }
    }

    async function playLottery(){
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer);

        try{
          const tx = {
            from: accounts[0],
            // to: LotteryAddress,
            value: ethers.utils.parseEther("0.0001")
          }
          const played = await checkIfPlayerPlayed();
          console.log(played);
          if(!played){
            if(tx.value != 0){
              const transaction = await contract.enter(tx);
              await transaction.wait();
              getBalance();
              setSuccess('Votre argent a bien été transféré sur le portefeuille');
              getPlayers();
            }else{
              setError("Impossible d'envoyer 0 ETH")
              return
            }
          }
        }
        catch(err){
          console.log(err);
          setError('Une erreur est survenue.');
        }
      }
    }

    async function getOwner(){
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer);

        try{
          const transaction = await contract.getOwner();
          // console.log("Recu: ",transaction);
          // console.log("Conn: ",accounts[0]);
          if(transaction.toUpperCase() == accounts[0].toUpperCase()){
            setOwner(true);
            // console.log(transaction);
          }
        }
        catch(err){
          console.log(err);
          setError('Une erreur est survenue.');
        }
      } 
    }

    async function getPlayers(){
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer);

        try{
          const transaction = await contract.getPlayers();
          setPlayers(transaction);
        }
        catch(err){
          console.log(err);
          setError('Une erreur est survenue.');
        }
      }
    }

    async function pickWinner(){
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer);

        try{
          const transaction = await contract.pickWinner({from: accounts[0]});
          getBalance();
          setError('');
          setSuccess('Le gagnant a bien été tiré au sort');
          getPlayers();
        }
        catch(err){
          console.log(err);
          setError('Une erreur est survenue.');
        }
      }
    }

    return(
        <main className='h-100 w-100 d-flex justify-content-center align-items-center'>

          <div className='w-25 h-25 border rounded d-flex justify-content-center align-items-center'>

            <div className='d-flex-column justify-content-center align-items-center p-2'>

              <div className='mb-2 p-1 d-flex justify-content-center align-items-center'>
                <h1 className='mt-0'>{balance/10**18} </h1>
                <FaEthereum size={40}/>
              </div>
            
              <Button className='w-100' color='primary' onClick={playLottery}>Play</Button>
              {isOwner && <Button color='success' onClick={pickWinner}>Tirer au sort</Button>}
              {error && <p className='error'>{error}</p>}
              {success && <p className='success'>{success}</p>}
            </div>
          </div>

          <div className='w-25 p-1 h-50 border rounded d-flex-column justify-content-center align-items-center'>
            <h2 className="text-center">Liste des joueurs</h2>
            <ul className='p-1 text-center'>
              {players.map((player)=><li key={player} className='p-1'>{player}</li>)}
            </ul>
          </div>

        </main>
    );
}