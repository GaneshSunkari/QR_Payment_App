import React from 'react';

function ScanSection({
    readerRef,
    scannedWalletAddress,
    amountInput,
    setAmountInput,
    handleSendTransaction,
    isLoading,
    setCurrentSection
}) {
    return (
        <div className="scan-section">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Scan QR & Send ETH</h2>
            <div ref={readerRef} id="reader" className="w-full max-w-xs mx-auto mt-6"></div>
            <p id="scannedAddressDisplay" className="text-md text-gray-700 my-4 break-words">
                {scannedWalletAddress ? `Scanned Address: ${scannedWalletAddress}` : 'Scanning...'}
            </p>
            <input
                type="number"
                id="amountInput"
                placeholder="Amount in Wei (e.g., 1 ETH = 10^18 Wei)"
                className="w-full p-3 rounded-xl mb-4 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
            />
            <button
                id="sendTransactionButton"
                className="w-full p-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none mb-4"
                onClick={handleSendTransaction}
                disabled={isLoading}
            >
                {isLoading ? 'Sending...' : 'Send Transaction'}
            </button>
            {isLoading && (
                <div className="spinner border-4 border-gray-300 border-t-4 border-t-indigo-600 rounded-full w-8 h-8 animate-spin mx-auto my-4"></div>
            )}
            <button
                id="backToGenerateButton"
                className="w-full p-3 rounded-xl bg-gray-500 text-white font-medium shadow-md hover:bg-gray-600 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none mt-4"
                onClick={() => setCurrentSection('generate')}
            >
                Back
            </button>
        </div>
    );
}

export default ScanSection;