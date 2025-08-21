// routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js'; // Import loginUser

const router = express.Router();

// POST request for registering a user
router.post('/register', registerUser);

// POST request for logging in a user
router.post('/login', loginUser);

export default router;
