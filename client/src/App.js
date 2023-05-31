import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';
import tokenABI from './contracts/LuniverseToken.json';
import nftABI from './contracts/LuniverseNFT.json';
import stakingABI from './contracts/StakingContract.json';


// Contract addresses
const tokenAddress = '0x6957F634E4B6EF91cAB4aA340fF298339d6c830D';
const nftAddress = '0xC78133e5B7D6F512c96D02ee6bE79a83A5598405';
const stakingAddress = '0xB2527bDbb4049A3FBFa0E521D440F1398ec9411d';

function App() {
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isStaked, setIsStaked] = useState(false);
  const [isNFTReceived, setIsNFTReceived] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
      const nftContract = new web3.eth.Contract(nftABI, nftAddress);
      const stakingContract = new web3.eth.Contract(stakingABI, stakingAddress);

      const tokenBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setTokenBalance(tokenBalance);

      const stakerInfo = await stakingContract.methods.stakers(accounts[0]).call();
      setIsStaked(stakerInfo.amount > 0);
      setIsNFTReceived(stakerInfo.isNFTReceived);
    } else {
      window.alert('No Ethereum browser detected! Please install MetaMask.');
    }
  }

  async function stakeTokens(amount) {
    if (amount <= 0) {
      window.alert('Please enter a valid amount');
      return;
    }

    const web3 = new Web3(window.ethereum);
    const stakingContract = new web3.eth.Contract(stakingABI, stakingAddress);

    try {
      await stakingContract.methods.stakeTokens(amount).send({ from: account });
      setIsStaked(true);
    } catch (error) {
      console.error('Failed to stake tokens:', error);
      window.alert('Failed to stake tokens. Please try again.');
    }
  }

  async function receiveNFT() {
    const web3 = new Web3(window.ethereum);
    const stakingContract = new web3.eth.Contract(stakingABI, stakingAddress);

    try {
      await stakingContract.methods.receiveNFT().send({ from: account });
      setIsNFTReceived(true);
    } catch (error) {
      console.error('Failed to receive NFT:', error);
      window.alert('Failed to receive NFT. Please try again.');
    }
  }

  return (
    <div className="App">
       
      <h1>Staking App</h1>
      <div className="account-info">
        <p>Account: {account}</p>
        <p>Token Balance: {tokenBalance}</p>
      </div>
      {!isStaked ? (
        <div className="staking-form">
          <h2>Stake Tokens</h2>
          <input type="number" min="0" placeholder="Enter amount" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={() => stakeTokens(amount)}>Stake</button>
        </div>
      ) : (
        <div className="staking-info">
          <p>Tokens Staked: Yes</p>
          {!isNFTReceived ? (
            <button onClick={receiveNFT}>Receive NFT</button>
          ) : (
            <p>NFT Received: Yes</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
