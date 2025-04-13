// backend/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';  // Add this import
import connectDB from './config/db.js'; // Correct ESM import
import authRoutes from './routes/authRoutes.js'; // Assuming you have auth routes
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

// ... other imports

const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());

// Connect to the database
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
// ... other routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});