import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState('');
  const [isOpenToConnect, setIsOpenToConnect] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      userId: '662000123abcde1234567890', // TEMP: use a valid ID from your DB
      destination,
      startDate,
      endDate,
      interests: interests.split(',').map(interest => interest.trim()),
      isOpenToConnect
    };
    

    try {
      const response = await axios.post('http://localhost:5000/api/traveller-posts', postData);
      console.log('Post Created:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Interests (comma separated):</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            Open to Connect with Others?
            <input
              type="checkbox"
              checked={isOpenToConnect}
              onChange={() => setIsOpenToConnect(!isOpenToConnect)}
            />
          </label>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
