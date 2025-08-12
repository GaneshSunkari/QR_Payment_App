import React from 'react';

function MessageBox({ message }) {
    if (!message.text) {
        return null;
    }

    return (
        <div className={`
            message-box absolute top-4 left-1/2 -translate-x-1/2 w-[90%] p-4 rounded-xl text-sm z-10
            ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-800' :
              message.type === 'error' ? 'bg-red-100 border border-red-400 text-red-800' :
              'bg-yellow-100 border border-yellow-400 text-yellow-800'}
        `}>
            {message.text}
        </div>
    );
}

export default MessageBox;