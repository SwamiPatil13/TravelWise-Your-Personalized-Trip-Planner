import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js'; // ✅ Import your user routes
import soloTravellerRoutes from './routes/soloTravellerRoutes.js';
import messageRoutes from './routes/messages.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

// ✅ CORS middleware configuration
app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // You can adjust allowed methods if needed
}));

app.use(express.json()); // ✅ Middleware to parse incoming JSON

app.get('/', (req, res) => {
  res.send('Server is Ready');
});

// ✅ Use your real /api/users route
app.use('/api/users', userRoutes);
app.use('/api/solo-traveller', soloTravellerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', recommendationRoutes);

// ✅ Ensure DB is connected before starting the server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('Server started on port 5000 http://localhost:5000');
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
});
