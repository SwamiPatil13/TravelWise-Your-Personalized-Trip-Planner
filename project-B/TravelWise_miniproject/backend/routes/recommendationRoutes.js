import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/recommendations', auth, getRecommendations);

export default router; 