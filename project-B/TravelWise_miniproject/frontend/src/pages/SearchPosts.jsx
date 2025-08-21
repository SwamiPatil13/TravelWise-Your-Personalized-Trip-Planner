import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './SearchPosts.css';

const SearchPosts = () => {
    const [searchDestination, setSearchDestination] = useState('');
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/solo-traveller/destination/${searchDestination}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setPosts(response.data || []);
        } catch (error) {
            console.error('Error searching posts:', error);
            setError('Failed to search posts');
        }
    };

    const handleMessageClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="search-container">
            <h1 className="search-title">Search Travel Posts</h1>
            {error && (
                <div className="search-error">{error}</div>
            )}
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-form-group">
                    <label>Destination</label>
                    <input
                        type="text"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                        placeholder="Enter destination"
                    />
                </div>
                <button type="submit" className="search-btn">Search</button>
            </form>
            <div className="search-results">
                <h2 className="search-results-title">Search Results</h2>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="search-post">
                            <div className="search-post-header">
                                <h3>{post.destination}</h3>
                                {post.user && post.user._id !== user._id && (
                                    <button 
                                        className="message-btn"
                                        onClick={() => handleMessageClick(post.user._id)}
                                    >
                                        Message
                                    </button>
                                )}
                            </div>
                            <p>{post.description}</p>
                            <p className="search-post-date">Travel Date: {new Date(post.travelDate).toLocaleDateString()}</p>
                            <p className="search-post-user">Posted by: {post.user?.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>
        </div>
    );
};

export default SearchPosts; 