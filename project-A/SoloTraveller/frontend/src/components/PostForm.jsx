import { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
  const [formData, setFormData] = useState({
    userId: '662000123abcde1234567890', // static for now
    destination: '',
    startDate: '',
    endDate: '',
    interests: '',
    isOpenToConnect: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      interests: formData.interests.split(',').map((item) => item.trim()),
    };

    try {
      const res = await axios.post('http://localhost:5000/api/traveller-posts/create', payload);
      alert('Post created successfully!');
      console.log(res.data);
    } catch (err) {
      alert('Error creating post');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Create a Solo Travel Post</h2>

      <input
        type="text"
        name="destination"
        placeholder="Destination"
        value={formData.destination}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="interests"
        placeholder="Interests (comma separated)"
        value={formData.interests}
        onChange={handleChange}
      />

      <label>
        <input
          type="checkbox"
          name="isOpenToConnect"
          checked={formData.isOpenToConnect}
          onChange={handleChange}
        />
        Open to connect with others
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
