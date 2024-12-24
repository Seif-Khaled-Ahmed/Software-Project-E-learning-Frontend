"use client";

import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import './chatBar.css';
import "../style/chatBar.css";
interface User {
  _id: string;
  name: string;
  role: "student" | "instructor";
  progress?: string; // For students
  department?: string; // For instructors
  coursesTaught?: string[]; // For instructors
}
interface Chats {
  _id: string; // Unique identifier for the chat
  sender: string; // The user ID of the sender (could be the User's _id)
  receiver: string []; // Array of user IDs for the receivers
  chatType: "direct" | "group"; // Type of chat (direct or group)
  messages: Message[]; // Array of messages in the chat
}
interface Message {
  _id: string; // Unique identifier for the message
  sender: string; // The user ID of the sender
  content: string; // Message content
  timestamp: string; // Time when the message was sent (could be a date string)
}

const ChatBar: React.FC = () => {
  const [chat, setChat] = useState<string>('');
  const [discussions, setDiscussions] = useState<Chats[]>([]); // State to store the fetched chats
  const [message, setMessage] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isVisibleText, setIsVisibleText] = useState(false);
    const [results, setResults] = useState<(User)[]>([]);
  

  const handleSearch = async (chat : string) => {
    if (!chat.trim()) {
      ("Please enter a query to search.");
      return;
    }

    setResults([]);

    try {
      const [studentsResponse, instructorsResponse] =
        await Promise.all([
          fetch(`http://localhost:3000/users/search/student?name=${chat}`),
          fetch(`http://localhost:3000/users/search/instructor?name=${chat}`),
        ]);

      if (
        !studentsResponse.ok ||
        !instructorsResponse.ok
      ) {
        throw new Error("Failed to fetch results");
      }

      const [ students, instructors] = await Promise.all([
        studentsResponse.json(),
        instructorsResponse.json(),
      ]);

      console.log("Students:", students);
      console.log("Instructors:", instructors);

      setResults([ ...students, ...instructors]);

      console.log("the first user is" ,results[0]._id)
    } catch (err: any) {
      console.log("error in fetching users")
    } finally {
    }
  };
  // Function to toggle the popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const createChat = async (email : string)=>{

    try {
      const session = localStorage.getItem('session');
    const userId = session ? JSON.parse(session)._id : null;

    if (!userId) {
      throw new Error('User ID not found in local storage');
    }
    const url = `http://localhost:3000/chat/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },body:JSON.stringify({
          "sender": userId, 
          "receiver": ["60d0fe4f5311236168a109cb"],
          "chatType": "direct"
        })

      });
    } catch (error) {
      console.error('Error getting chats:', error);
    }finally{
    }


  }
  useEffect(() => {
    console.log('Discussions state updated:', discussions);
  }, [discussions]); // This will run whenever discussions change
  useEffect(() => {
  const findAllchats = async ()=>{
      try {
        const session = localStorage.getItem('session');
      const userId = session ? JSON.parse(session)._id : null;
  
      if (!userId) {
        throw new Error('User ID not found in local storage');
      }
  
      // Construct the URL with the userId
      const url = `http://localhost:3000/chat/${userId}/chats`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },

      });
      const data = await response.json();
      if (Object.keys(data).length === 0) 
        {
          console.log(data)
          console.log("The JSON object is empty.");
        }else{
          setDiscussions(data)
          console.log("The JSON object is NOTTT empty.");
          setIsVisibleText (true);
        }
      if (!response.ok) throw new Error('Failed to send message');


      console.log(data);





      for (let index2 = 0; index2 < data.length; index2++) {
      for (let index = 0; index < data[0].receiver.length; index++) {
        console.log(" at reciever", data[0].receiver[index])
        const [studentsResponse, instructorsResponse] =
        await Promise.all([
          fetch(`http://localhost:3000/users/search?id=${data[index2].receiver[index]}`),
          fetch(`http://localhost:3000/users/search?id=${data[index2].receiver[index]}`),
        ]);
  
        if (
          !studentsResponse.ok ||
          !instructorsResponse.ok
        ) {
          throw new Error("Failed to fetch results");
        }
    
        const [ students, instructors] = await Promise.all([
          studentsResponse.json(),
          instructorsResponse.json(),
        ]);
        console.log("Students:", students);
    console.log("Instructors:", instructors);
    data[0].sender = ([ ...students, ...instructors]);
  }
      }
    

      
      const recievers = await data[0].sender
      console.log(recievers)

    } catch (error) {
      console.error('Error getting chats:', error);
    }finally{
      setIsLoading(false); // Set loading to false after fetching
    }
}
findAllchats();
  },[])

  const sendMessage = async (message: string) => {
    if (!message.trim()) return; // Prevent sending empty messages

    setIsSending(true); // Show loading state
    try {
      
      const response = await fetch('http://localhost:3000/chat/67549b50ea11accdcb7cc2e4/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "sender": "6754963cc21a1f7a224b3b89",
          "message": message,
          "attachments": ["file1.jpg", "file2.pdf"]
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      console.log('Message sent:', data);

      setMessage(''); // Clear the input after sending
    } catch (error) {
      console.error('Error sending message:', error);
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
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      togglePopup();
    }}
  >
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
        {!isVisibleText && (
          <div>
            Looks like you dont have chats
            <div>
              <label htmlFor="email">
                Enter one for direct or many for group:
              </label>
              <input
                placeholder="Please enter their name..."
                type="text"
                onChange={(e) => setChat(e.target.value)}
                value={chat}
                required
              />
              <ul>
                {results.map((user) => (
                  <li key={user._id}>{user.name}</li>
                ))}
              </ul>
            </div>
            <button onClick={() =>handleSearch(chat)} className="send-button">
              search
            </button>
            <button onClick={() => {createChat(results[0]._id)}} className="send-button">
              Create Chat
            </button>
          </div>
        )}
        {isVisibleText && (
          <div className="relative w-full">
            <ul>
        {discussions.map((discussions) => (
          <li key={discussions._id}>
            <ul>
              {discussions.receiver.map((receiver, index) => (
                <li key={index}>{receiver}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
            <input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input pr- -10" // Add padding-right to make space for the button
              // disabled={isSending} // Disable input while sending
            />
            <button
              onClick={() => sendMessage(message)}
              className="absolute top-2 right-2 transform -translate-y-1/2 send-button"
              disabled={isSending} // Disable button while sending
            >
              {isSending ? "..." : "Send"}
            </button>
          </div>
        )}

        <button onClick={togglePopup}>Close</button>
      </div>
    </div>
  )}
</div>

  );
};

export default ChatBar;
