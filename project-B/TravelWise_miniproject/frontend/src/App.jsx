// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SoloTraveller from './pages/SoloTraveller';
import SearchPosts from './pages/SearchPosts';
import PrivateRoute from './components/PrivateRoute';
import Chat from './pages/Chat';
import DestinationRecommendations from './pages/DestinationRecommendations';
import './styles/Home.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/solo-traveller" 
              element={
                <PrivateRoute>
                  <SoloTraveller />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/search-posts" 
              element={
                <PrivateRoute>
                  <SearchPosts />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/chat/:userId" 
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/recommendations" 
              element={
                <PrivateRoute>
                  <DestinationRecommendations />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
