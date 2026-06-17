import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'pms' });
});

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

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
