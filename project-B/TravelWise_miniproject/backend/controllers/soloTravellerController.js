import TravellerPost from '../models/travellerPostModel.js';

// @desc    Create a new travel post
// @route   POST /api/solo-traveller
// @access  Private
const createTravellerPost = async (req, res) => {
    try {
        const { destination, description, travelDate } = req.body;
        
        const post = await TravellerPost.create({
            user: req.user._id,
            destination,
            description,
            travelDate
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all travel posts
// @route   GET /api/solo-traveller
// @access  Public
const getTravellerPosts = async (req, res) => {
    try {
        const posts = await TravellerPost.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get travel posts by destination
// @route   GET /api/solo-traveller/destination/:destination
// @access  Public
const getTravellerPostsByDestination = async (req, res) => {
    try {
        const { destination } = req.params;
        const posts = await TravellerPost.find({
            destination: { $regex: destination, $options: 'i' }
        })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a travel post
// @route   DELETE /api/solo-traveller/:id
// @access  Private
const deleteTravellerPost = async (req, res) => {
    try {
        const post = await TravellerPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Only allow the owner to delete
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createTravellerPost,
    getTravellerPosts,
    getTravellerPostsByDestination,
    deleteTravellerPost
}; 