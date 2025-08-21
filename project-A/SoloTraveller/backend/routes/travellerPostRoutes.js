import express from 'express';
import { createPost, getMatchingPosts } from '../controllers/travellerPostController.js';

const router = express.Router();

router.post('/', createPost);           // POST /api/traveller-posts
router.get('/match', getMatchingPosts); // GET  /api/traveller-posts/match



export default router;
