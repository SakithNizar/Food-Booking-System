import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import path from 'path';
import { fileURLToPath } from 'url';


import transportationRoutes from './routes/transportationRoutes.js';
import transportationBookingRoutes from './routes/transportationBookingRoutes.js';

// Load environment variables
dotenv.config();

// App Config
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5000;

//connect to Mongodb
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// API Health Check
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));

// Routes
app.use('/api/transportation', transportationRoutes);
app.use('/api/transportationBooking', transportationBookingRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
  });
  
  // Route not found
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });