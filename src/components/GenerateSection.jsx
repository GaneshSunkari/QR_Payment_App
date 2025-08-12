import React from 'react';

function GenerateSection({
    connectedAccount,
    accountBalance,
    fetchAccountBalance,
    handleSendClick,
    handleReceiveClick,
    walletAddressInput,
    qrCodeContainerRef
}) {
    return (
        <div className="generate-section transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Wallet</h2>
            <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <p className="text-sm text-gray-600">Connected Account:</p>
                <p className="font-mono text-xs text-gray-700 break-all mb-2">
                    {connectedAccount ? `${connectedAccount.substring(0, 10)}...${connectedAccount.substring(connectedAccount.length - 8)}` : 'Not Connected'}
                </p>
                <p className="text-4xl font-bold text-indigo-700">
                    {accountBalance} ETH
                </p>
                <button
                    className="mt-3 text-sm text-indigo-600 hover:underline"
                    onClick={() => fetchAccountBalance(connectedAccount)}
                    disabled={!connectedAccount}
                >
                    Refresh Balance
                </button>
            </div>
            <div className="flex justify-around gap-4 mb-6">
                <button
                    className="flex-1 p-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                    onClick={handleSendClick}
                >
                    Send
                </button>
                <button
                    className="flex-1 p-3 rounded-xl bg-purple-600 text-white font-medium shadow-md hover:bg-purple-700 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                    onClick={handleReceiveClick}
                >
                    Receive
                </button>
            </div>
            {walletAddressInput && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Receive QR Code</h3>
                    <div ref={qrCodeContainerRef} id="qrCodeContainer" className="flex justify-center items-center min-h-[200px] p-4 border border-gray-200 rounded-xl bg-gray-50"></div>
                    <p className="text-sm text-gray-600 mt-2 break-all">Scan this QR to send funds to:</p>
                    <p className="font-mono text-xs text-gray-700 break-all">{walletAddressInput}</p>
                </div>
            )}
        </div>
    );
}

export default GenerateSection;