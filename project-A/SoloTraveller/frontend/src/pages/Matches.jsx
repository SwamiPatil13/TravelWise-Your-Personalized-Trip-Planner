import React, { useState } from 'react';
import axios from 'axios';

const Matches = () => {
  const [posts, setPosts] = useState([]);
  const [destination, setDestination] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/traveller-posts/match', {
        params: { destination }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div>
      <h2>Find Matches by Destination</h2>
      
      <input
        type="text"
        placeholder="Enter a destination, e.g., Satara"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <h3>{post.destination}</h3>
              <p>Start Date: {new Date(post.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(post.endDate).toLocaleDateString()}</p>
              <p>Interests: {post.interests.join(', ')}</p>
              <p>{post.isOpenToConnect ? 'Open to Connect' : 'Not Open to Connect'}</p>
            </div>
          ))
        ) : (
          <p>No matches found</p>
        )}
      </div>
    </div>
  );
};

export default Matches;
