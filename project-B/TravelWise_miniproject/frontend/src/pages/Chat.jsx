import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!userId) {
            setError('Invalid user ID');
            return;
        }
        fetchMessages();
        // Refresh messages every 30 seconds
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, [userId, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/messages/conversation/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setMessages(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('http://localhost:5000/api/messages/send', 
                {
                    receiverId: userId,
                    message: newMessage
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="chat-container">
            {loading ? (
                <div className="chat-loading">Loading messages...</div>
            ) : (
                <>
                    <div className="chat-messages">
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`message ${msg.senderId === user._id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">{msg.message}</div>
                                    <div className="message-timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-messages">No messages yet. Start the conversation!</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {error && <div className="chat-error">{error}</div>}

                    <form onSubmit={sendMessage} className="chat-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="chat-input"
                        />
                        <button type="submit" className="chat-send-btn">
                            Send
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Chat; 