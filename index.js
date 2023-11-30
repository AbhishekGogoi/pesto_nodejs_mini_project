const express = require('express');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/url', require('./src/routes/urlRoutes'));
app.use('/', require('./src/routes/redirectRoutes'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });


  module.exports = { app, server };

