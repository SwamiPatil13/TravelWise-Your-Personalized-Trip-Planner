import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import travellerPostRoutes from './routes/travellerPostRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();  // Initialize express app

// Enable CORS after app initialization
app.use(cors());  

app.use(express.json());  // Now we can use express.json()

// Use routes
app.use('/api/traveller-posts', travellerPostRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello world');
});

// Start server
app.listen(5000, () => {
  connectDB();
  console.log('Server is running on port 5000 http://localhost:5000');
});
