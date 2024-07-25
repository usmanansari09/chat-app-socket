import { useEffect, useRef, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";

function App() {
  const socket = useRef();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  useEffect(() => {
    socket.current = io("ws://localhost:3001");

    socket.current.on("connnection", () => {
      console.log("connected to server");
    });
    console.log("aaaa",chat);
  }, [chat]);

  const handleClick = () => {
    socket.current.emit("message", message);
    setMessage('')
  };
  useEffect(() => {
    // Listen for incoming messages
    socket.current.on('receiveMessage', (message) => {
      console.log("work");
      setChat((prevChat) => [...prevChat, message]);
    });
    
    // Cleanup on component unmount
    return () => {
      socket.current.off('receiveMessage');
      socket.current.disconnect();
    };
   
  }, []);
  return (
    <div>
      <h1>Chat Application</h1>
      <div>
        {chat.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleClick}>Send</button>
    </div>
  );
}

export default App;
