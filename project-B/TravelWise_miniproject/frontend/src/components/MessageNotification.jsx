import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MessageNotification.css';
import chatIcon from '../assets/chat.png';

const MessageNotification = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentMessages, setRecentMessages] = useState([]);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/messages/unread-count', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchRecentMessages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/messages/recent', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setRecentMessages(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching recent messages:', error);
            setError('Failed to load recent messages');
        }
    };

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            fetchRecentMessages();
            const interval = setInterval(() => {
                fetchUnreadCount();
                fetchRecentMessages();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleMessageClick = (message) => {
        const otherUserId = message.senderId._id === user._id 
            ? message.receiverId._id 
            : message.senderId._id;
        navigate(`/chat/${otherUserId}`);
        setShowDropdown(false);
    };

    if (!user) return null;

    return (
        <div className="message-notification-container">
            <div className="message-notification" onClick={handleClick}>
                <img src={chatIcon} alt="Chat" className="chat-icon-img" style={{ width: 24, height: 24 }} />
                {unreadCount > 0 && (
                    <span className="message-badge">{unreadCount}</span>
                )}
            </div>
            
            {showDropdown && (
                <div className="message-dropdown">
                    <div className="message-dropdown-header">
                        <h3>Recent Messages</h3>
                    </div>
                    {error ? (
                        <div className="message-error">{error}</div>
                    ) : recentMessages.length > 0 ? (
                        recentMessages.map((msg) => (
                            <div 
                                key={msg._id} 
                                className="message-dropdown-item"
                                onClick={() => handleMessageClick(msg)}
                            >
                                <div className="message-dropdown-content">
                                    <span className="message-sender">
                                        {msg.senderId._id === user._id ? 'You' : msg.senderId.name}
                                    </span>
                                    <p className="message-preview">{msg.message}</p>
                                </div>
                                {!msg.isRead && msg.receiverId._id === user._id && (
                                    <span className="unread-indicator"></span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-messages">No recent messages</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MessageNotification; 