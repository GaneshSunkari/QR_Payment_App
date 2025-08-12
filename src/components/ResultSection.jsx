import React from 'react';

function ResultSection({ transactionResult, handleBackToHome }) {
    return (
        <div className="result-section transition-all duration-300 ease-in-out">
            <h2 className={`text-2xl font-semibold mb-4 ${transactionResult.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {transactionResult.title}
            </h2>
            <p className="text-md text-gray-700 mb-6 break-words" dangerouslySetInnerHTML={{ __html: transactionResult.message }}></p>
            <button
                id="backToHomeButton"
                className="w-full p-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                onClick={handleBackToHome}
            >
                Back to Home
            </button>
        </div>
    );
}

export default ResultSection;