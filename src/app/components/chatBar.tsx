"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import './chatBar.css';
import "../style/chatBar.css";

const ChatBar: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Function to toggle the popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return; // Prevent sending empty messages

    setIsSending(true); // Show loading state
    try {
      const response = await fetch('http://localhost:3000/chat/67549b50ea11accdcb7cc2e4/messages', {
        method: 'PUT',
        headers: {
        },
        body: JSON.stringify({
          "sender": "6754963cc21a1f7a224b3b89",
          "message": "Hello, this is a test message!",
          "attachments": ["file1.jpg", "file2.pdf"]
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      console.log('Message sent:', data);

      setMessage(''); // Clear the input after sending
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false); // Reset loading state
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending) {
      sendMessage(message);
    }
  };

  return (
    <div className="chat-bar">
      <a href="#" onClick={(e) => {
        e.preventDefault();
        togglePopup();
      }}>
        <Image 
          src="/images/chat.png"
          alt="Chat Icon" 
          className="chat-icon" 
          width={50} 
          height={50} 
        />
      </a>
      {isPopupOpen && (
        <div className="chat-popup">
          <div className="popup-content">
            <h2>Chat</h2>

            <input 
              type="text" 
              placeholder="Type your message here..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="message-input"
              disabled={isSending} // Disable input while sending
            />
            
            <button 
              onClick={() => sendMessage(message)}
              className="send-button"
              disabled={isSending} // Disable button while sending
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
            
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBar;
