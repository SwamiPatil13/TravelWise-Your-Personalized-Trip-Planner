import React, { useState } from 'react';
import axios from 'axios';
import '../styles/DestinationRecommendations.css';
import { useAuth } from '../context/AuthContext';

const DestinationRecommendations = () => {
  const [formData, setFormData] = useState({
    destination: '',
    hobby: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/recommendations', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="destination-recommendations">
      <form onSubmit={handleSubmit} className="recommendation-form">
        <h1 className="recommendation-title">Find Your Perfect Destination</h1>
        <div className="form-group">
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            placeholder="Enter your destination"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hobby">Hobby:</label>
          <input
            type="text"
            id="hobby"
            name="hobby"
            value={formData.hobby}
            onChange={handleInputChange}
            placeholder="Enter your hobby"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Finding Recommendations...' : 'Get Recommendations'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {recommendations.length > 0 && (
        <div className="recommendations-list">
          <h2>Recommended Places</h2>
          {recommendations.map((place, index) => (
            <div key={index} className="recommendation-card">
              <h3>{place.name}</h3>
              <p>Location: {place.location}</p>
              <p>Distance: {place.distance} km</p>
              <p>Best Time to Visit: {place.bestTimeToVisit}</p>
              <div className="activities-section">
                <h4>Activities & Features:</h4>
                <ul>
                  {place.activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationRecommendations; 