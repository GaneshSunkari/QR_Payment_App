import React, { useState, useEffect, useRef, useCallback } from 'react';
import MessageBox from './components/MessageBox';
import GenerateSection from './components/GenerateSection';
import ScanSection from './components/ScanSection';
import ResultSection from './components/ResultSection';
import './App.css';

function App() {
    const [currentSection, setCurrentSection] = useState('generate');
    const [walletAddressInput, setWalletAddressInput] = useState('');
    const [scannedWalletAddress, setScannedWalletAddress] = useState('');
    const [amountInput, setAmountInput] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionResult, setTransactionResult] = useState({ title: '', message: '', type: '' });
    const [accountBalance, setAccountBalance] = useState('0.00');
    const [connectedAccount, setConnectedAccount] = useState('');
    const qrCodeContainerRef = useRef(null);
    const readerRef = useRef(null);
    const html5QrCodeScannerRef = useRef(null);

    const showMessage = (text, type = 'warning') => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 5000);
    };

    const connectMetaMask = useCallback(async () => {
        if (typeof window.ethereum === 'undefined') {
            showMessage('MetaMask is not installed. Please install it to proceed.', 'error');
            return null;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
                showMessage('No MetaMask accounts found or connected.', 'error');
                return null;
            }
            const account = accounts[0];
            setConnectedAccount(account);
            showMessage(`Connected to MetaMask: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`, 'success');
            return account;
        } catch (error) {
            console.error('MetaMask connection error:', error);
            let errorMessage = 'Failed to connect to MetaMask.';
            if (error.code === 4001) {
                errorMessage = 'MetaMask connection rejected by user.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            showMessage(errorMessage, 'error');
            return null;
        }
    }, [showMessage]);

    const fetchAccountBalance = useCallback(async (account) => {
        if (!account || typeof window.ethereum === 'undefined') {
            setAccountBalance('0.00');
            return;
        }
        try {
            const balanceWei = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            });
            const balanceBigInt = BigInt(balanceWei);
            const ethValue = Number(balanceBigInt) / (10 ** 18);
            setAccountBalance(ethValue.toFixed(4));
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            showMessage('Failed to fetch account balance.', 'error');
            setAccountBalance('N/A');
        }
    }, [showMessage]);

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                setConnectedAccount('');
                setAccountBalance('0.00');
                showMessage('MetaMask account disconnected.', 'warning');
            } else {
                setConnectedAccount(accounts[0]);
                fetchAccountBalance(accounts[0]);
                showMessage(`MetaMask account changed to: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`, 'success');
            }
        };

        const handleChainChanged = (chainId) => {
            showMessage(`MetaMask network changed to Chain ID: ${parseInt(chainId, 16)}`, 'warning');
            if (connectedAccount) {
                fetchAccountBalance(connectedAccount);
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [fetchAccountBalance, connectedAccount, showMessage]);

    const generateQrCodeForAddress = (addressToEncode) => {
        if (!addressToEncode) {
            showMessage('No address provided to generate QR code.', 'error');
            return;
        }
        if (!addressToEncode.startsWith('0x') || addressToEncode.length !== 42) {
            showMessage('Invalid Ethereum address format for QR code generation.', 'error');
            return;
        }

        if (qrCodeContainerRef.current) {
            qrCodeContainerRef.current.innerHTML = '';
        }

        try {
            if (window.QRCode) {
                new window.QRCode(qrCodeContainerRef.current, {
                    text: addressToEncode,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: window.QRCode.CorrectLevel.H
                });
                showMessage('QR code generated successfully!', 'success');
            } else {
                showMessage('QR Code library (qrcode.min.js) not found. Please check your public/index.html.', 'error');
            }
        } catch (error) {
            showMessage('Failed to generate QR code. Please check the address.', 'error');
            console.error('QR code generation error:', error);
        }
    };

    const stopScanner = useCallback(() => {
        if (html5QrCodeScannerRef.current) {
            console.log("Stopping QR scanner...");
            html5QrCodeScannerRef.current.clear().then(() => {
                console.log("QR scanner cleared.");
            }).catch((err) => {
                console.warn("Could not clear QR scanner cleanly:", err);
            }).finally(() => {
                html5QrCodeScannerRef.current = null;
            });
        }
    }, []);

    const handleSendClick = () => {
        stopScanner();
        setCurrentSection('scan');
        setScannedWalletAddress('');
        setAmountInput('');
        showMessage('Ready to scan QR code for sending.', 'info');
    };

    const handleReceiveClick = async () => {
        stopScanner();
        if (!connectedAccount) {
            const account = await connectMetaMask();
            if (account) {
                setWalletAddressInput(account);
                generateQrCodeForAddress(account);
            } else {
                showMessage('Please connect MetaMask to generate your receive QR code.', 'warning');
            }
        } else {
            setWalletAddressInput(connectedAccount);
            generateQrCodeForAddress(connectedAccount);
        }
        setCurrentSection('generate');
    };

    const onScanSuccess = useCallback((decodedText) => {
        if (decodedText) {
            setScannedWalletAddress(decodedText);
            showMessage(`QR code scanned successfully! Address: ${decodedText}`, 'success');
            stopScanner();
        }
    }, [showMessage, stopScanner]);

    const onScanFailure = useCallback(() => {}, []);

    // MODIFIED: This useEffect hook is now more robust
    useEffect(() => {
        // Only initialize if we are on the scan section and the readerRef is available
        if (currentSection === 'scan' && readerRef.current && window.Html5QrcodeScanner) {
            console.log("Initializing Html5QrcodeScanner...");
            const scanner = new window.Html5QrcodeScanner(
                readerRef.current.id,
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
            html5QrCodeScannerRef.current = scanner;
            scanner.render(onScanSuccess, onScanFailure);
        }

        // The cleanup function is called when the component unmounts OR when 'currentSection' changes.
        // This ensures the scanner is always properly closed before a new one might be opened.
        return () => {
            stopScanner();
        };
    }, [currentSection, readerRef, onScanSuccess, onScanFailure, stopScanner]);

    const handleSendTransaction = async () => {
        if (!scannedWalletAddress) {
            showMessage('Please scan a QR code first to get the recipient address.', 'error');
            return;
        }

        const amountWei = amountInput.trim();
        if (!amountWei || isNaN(amountWei) || parseFloat(amountWei) <= 0) {
            showMessage('Please enter a valid amount in Wei.', 'error');
            return;
        }

        if (typeof window.ethereum === 'undefined') {
            showMessage('MetaMask is not installed. Please install it to proceed.', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const currentSenderAccount = connectedAccount || await connectMetaMask();
            if (!currentSenderAccount) {
                setIsLoading(false);
                return;
            }

            const valueHex = '0x' + BigInt(amountWei).toString(16);
            const gasLimit = '0x5208';

            const transactionParameters = {
                from: currentSenderAccount,
                to: scannedWalletAddress,
                value: valueHex,
                gas: gasLimit,
            };

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            setTransactionResult({
                title: 'Transaction Successful!',
                message: `Transaction Hash: <a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank" class="text-blue-500 hover:underline break-all">${txHash}</a>`,
                type: 'success'
            });
            setCurrentSection('result');
            showMessage('Transaction sent successfully!', 'success');
            fetchAccountBalance(currentSenderAccount);
        } catch (error) {
            console.error('MetaMask transaction error:', error);
            let errorMessage = 'An unknown error occurred.';
            if (error.code === 4001) {
                errorMessage = 'Transaction rejected by user.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            setTransactionResult({
                title: 'Transaction Failed!',
                message: `Error: ${errorMessage}`,
                type: 'error'
            });
            setCurrentSection('result');
            showMessage(`Transaction failed: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToHome = () => {
        stopScanner();
        setCurrentSection('generate');
        setWalletAddressInput('');
        setScannedWalletAddress('');
        setAmountInput('');
        setTransactionResult({ title: '', message: '', type: '' });
        if (connectedAccount) {
            fetchAccountBalance(connectedAccount);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 font-inter">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm text-center relative overflow-hidden">
                <MessageBox message={message} />
                {currentSection === 'generate' && (
                    <GenerateSection
                        connectedAccount={connectedAccount}
                        accountBalance={accountBalance}
                        fetchAccountBalance={fetchAccountBalance}
                        handleSendClick={handleSendClick}
                        handleReceiveClick={handleReceiveClick}
                        walletAddressInput={walletAddressInput}
                        qrCodeContainerRef={qrCodeContainerRef}
                    />
                )}
                {currentSection === 'scan' && (
                    <ScanSection
                        readerRef={readerRef}
                        scannedWalletAddress={scannedWalletAddress}
                        amountInput={amountInput}
                        setAmountInput={setAmountInput}
                        handleSendTransaction={handleSendTransaction}
                        isLoading={isLoading}
                        setCurrentSection={setCurrentSection}
                    />
                )}
                {currentSection === 'result' && (
                    <ResultSection
                        transactionResult={transactionResult}
                        handleBackToHome={handleBackToHome}
                    />
                )}
            </div>
        </div>
    );
}

export default App;