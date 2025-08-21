import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchList = () => {
  const [matches, setMatches] = useState([]);  // To store the list of matching posts
  const [loading, setLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);  // To handle errors

  // Fetch matching posts when component mounts
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/traveller-posts/match');
        setMatches(response.data);  // Set the fetched data to state
        setLoading(false);  // Turn off the loading indicator
      } catch (err) {
        console.error('Error fetching matching posts:', err);
        setError('Failed to load matching posts.');
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);  // Empty dependency array means this runs only once, when the component mounts

  // If data is still loading, show a loading indicator
  if (loading) {
    return <div>Loading matches...</div>;
  }

  // If there's an error, show an error message
  if (error) {
    return <div>{error}</div>;
  }

  // Render the list of matching posts
  return (
    <div>
      <h2>Matching Traveller Posts</h2>
      <ul>
        {matches.map((match) => (
          <li key={match._id}>
            <h3>{match.destination}</h3>
            <p>From: {new Date(match.startDate).toLocaleDateString()}</p>
            <p>To: {new Date(match.endDate).toLocaleDateString()}</p>
            <p>Interests: {match.interests.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
