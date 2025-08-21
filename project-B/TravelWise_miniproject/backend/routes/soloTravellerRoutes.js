import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createTravellerPost,
    getTravellerPosts,
    getTravellerPostsByDestination,
    deleteTravellerPost
} from '../controllers/soloTravellerController.js';

const router = express.Router();

// Create a new travel post
router.post('/', protect, createTravellerPost);

// Get all travel posts
router.get('/', getTravellerPosts);

// Get travel posts by destination
router.get('/destination/:destination', getTravellerPostsByDestination);

// Delete a travel post by ID
router.delete('/:id', protect, deleteTravellerPost);

export default router; 