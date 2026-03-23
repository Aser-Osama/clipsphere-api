const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());

// health route
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    data: {
      status: 'ok',
      timestamp: new Date()
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

module.exports = app;