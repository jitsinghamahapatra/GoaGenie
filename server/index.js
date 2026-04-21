require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const itineraryRoute = require('./routes/itinerary');
const weatherRoute = require('./routes/weather');
const spotsRoute = require('./routes/spots');
const chatRoute = require('./routes/chat');
const analyticsRoute = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://goa-genie.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/itinerary', itineraryRoute);
app.use('/api/weather', weatherRoute);
app.use('/api/spots', spotsRoute);
app.use('/api/chat', chatRoute);
app.use('/api/analytics', analyticsRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GoaGenie API is running 🌴' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
