import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'pms' });
});

// Auth routes (no auth required)
app.use('/api/auth', authRoutes);

// Protected routes (auth required)
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

// Root API route
app.get('/api', (req, res) => {
  res.json({
    message: 'PMS API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      tasks: '/api/tasks'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✓ PMS backend running on http://localhost:${PORT}`);
});
