import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './SoloTraveller.css';
import { FaTrash } from 'react-icons/fa';

const SoloTraveller = () => {
    const [posts, setPosts] = useState([]);
    const [destination, setDestination] = useState('');
    const [description, setDescription] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPosts();
    }, [user, navigate]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/solo-traveller', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setPosts(response.data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/solo-traveller', 
                {
                    destination,
                    description,
                    travelDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            setDestination('');
            setDescription('');
            setTravelDate('');
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post');
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:5000/api/solo-traveller/${postId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="solo-container">
            <h1 className="solo-title">Create Travel Post</h1>
            {error && (
                <div className="solo-error">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="solo-form">
                <div className="solo-form-group">
                    <label>Destination</label>
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                </div>
                <div className="solo-form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="solo-form-group">
                    <label>Travel Date</label>
                    <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="solo-btn">Create Post</button>
            </form>
            <div className="solo-posts">
                <h2 className="solo-posts-title">Your Posts</h2>
                {posts.filter(post => post.user === user._id || post.user?._id === user._id).length > 0 ? (
                    posts
                        .filter(post => post.user === user._id || post.user?._id === user._id)
                        .map((post) => (
                            <div key={post._id} className="solo-post">
                                <div className="solo-post-header">
                                    <h3>{post.destination}</h3>
                                    <button className="delete-post-btn" onClick={() => handleDelete(post._id)} title="Delete Post">
                                        <FaTrash />
                                    </button>
                                </div>
                                <p>{post.description}</p>
                                <p className="solo-post-date">Travel Date: {new Date(post.travelDate).toLocaleDateString()}</p>
                            </div>
                    ))
                ) : (
                    <p>No posts yet</p>
                )}
            </div>
        </div>
    );
};

export default SoloTraveller; 