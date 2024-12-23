// src/app/components/ChatBar.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';

import "../style/chatBar.css";

const ChatBar: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to toggle the popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="chat-bar">
      <a href="#" onClick={(e) => {
        e.preventDefault();
        togglePopup();
      }}>
        <Image 
          src="/images/chat.png" // Replace with the path to your icon file
          alt="Chat Icon" 
          className="chat-icon" 
          width={50} 
          height={50} 
        />
      </a>
      {isPopupOpen && (
        <div className="chat-popup">
          <div className="popup-content">
            <h2>Chat Popup</h2>
            <p>This is a chat popup content. You can add your chat functionality here.</p>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBar;

