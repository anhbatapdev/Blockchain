import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import contractAddressData from '../contracts/contract-address.json';
import contractABI from '../contracts/SupplyChain.json';

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [networkName, setNetworkName] = useState('');

  const resetState = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setNetworkName('');
    setError(null);
  }, []);

  const setupContract = useCallback(async (signerInstance) => {
    try {
      const contractInstance = new ethers.Contract(
        contractAddressData.address,
        contractABI,
        signerInstance
      );
      setContract(contractInstance);
      return contractInstance;
    } catch (err) {
      console.error('Error setting up contract:', err);
      setError('Không thể kết nối với smart contract');
      return null;
    }
  }, []);

  const HARDHAT_CHAIN_ID = '0x7A69'; // 31337 in hex

  const switchToHardhat = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
    } catch (switchError) {
      // Chain not added yet, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: HARDHAT_CHAIN_ID,
            chainName: 'Hardhat Local',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['http://127.0.0.1:8545'],
          }],
        });
      } else {
        throw switchError;
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    console.log('connectWallet called');
    if (!window.ethereum) {
      const msg = 'Vui lòng cài đặt MetaMask để sử dụng ứng dụng này';
      setError(msg);
      alert(msg);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Step 1: Switch to Hardhat Local network first
      console.log('Switching to Hardhat Local...');
      await switchToHardhat();

      // Step 2: Request accounts
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Accounts:', accounts);

      // Step 3: Setup provider and signer
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signerInstance = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();
      console.log('Connected to network:', network.name, 'chainId:', network.chainId.toString());

      setAccount(accounts[0]);
      setProvider(browserProvider);
      setSigner(signerInstance);
      setNetworkName(network.name);

      await setupContract(signerInstance);
      console.log('Wallet connected successfully!');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        setError('Bạn đã từ chối kết nối ví');
      } else {
        setError('Không thể kết nối ví: ' + err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [setupContract, switchToHardhat]);

  const disconnectWallet = useCallback(() => {
    resetState();
  }, [resetState]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });

          if (accounts.length > 0) {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signerInstance = await browserProvider.getSigner();
            const network = await browserProvider.getNetwork();

            setAccount(accounts[0]);
            setProvider(browserProvider);
            setSigner(signerInstance);
            setNetworkName(network.name);

            await setupContract(signerInstance);
          }
        } catch (err) {
          console.error('Error checking existing connection:', err);
        }
      }
    };

    checkConnection();
  }, [setupContract]);

  // Listen for MetaMask events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        resetState();
      } else {
        setAccount(accounts[0]);
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const signerInstance = await browserProvider.getSigner();
          setSigner(signerInstance);
          setProvider(browserProvider);
          await setupContract(signerInstance);
        } catch (err) {
          console.error('Error handling account change:', err);
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [resetState, setupContract]);

  const value = {
    account,
    provider,
    signer,
    contract,
    isConnecting,
    error,
    networkName,
    connectWallet,
    disconnectWallet,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
