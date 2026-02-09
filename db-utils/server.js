const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Import routers
const trendSummariesRouter = require('./db_routers/trend-summaries_db');
const businessesRouter = require('./db_routers/business_db');

// Mount routers
app.use('/trend-summaries', trendSummariesRouter);
app.use('/businesses', businessesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Express API server running on port ${port}`);
});