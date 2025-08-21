import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import MessageNotification from './MessageNotification';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logo} alt="Logo" className="navbar-logo-img" />
                <Link to="/" className="logo-text">TravelWise</Link>
            </div>
            <ul className="navbar-right">
                {user ? (
                    <>
                        <li><Link to="/solo-traveller">Create Post</Link></li>
                        <li><Link to="/search-posts">Search Posts</Link></li>
                        <li><Link to="/recommendations">Find Destinations</Link></li>
                        <li><span>Welcome, {user.name}</span></li>
                        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
            {user && <MessageNotification />}
        </nav>
    );
};

export default Navbar;
