import TravellerPost from '../models/TravellerPost.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const post = await TravellerPost.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get matching posts based only on destination
export const getMatchingPosts = async (req, res) => {
  const { destination } = req.query;

  try {
    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const posts = await TravellerPost.find({
      destination: destination.trim(),
      isOpenToConnect: true,
    });

    res.json(posts); // Return the matching posts
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
