import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import caseRoutes from './routes/cases.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Open CORS for Vercel
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Mystery Room API',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory mode',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/cases', caseRoutes);
app.use(errorHandler);

const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI && !MONGODB_URI.includes('your_mongodb')) {
  mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB Atlas.');
  }).catch(err => {
    console.warn('MongoDB Atlas connection failed:', err.message);
  });
}

app.listen(PORT, () => {
  console.log('AI Mystery Room Server running on port ' + PORT);
});

