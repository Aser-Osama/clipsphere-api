const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const protect = require('./middleware/protect');
const restrictTo = require('./middleware/restrictTo');
const adminRoutes = require('./routes/admin.routes');




const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);



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

app.get('/error', (req, res) => {  //for test
  throw new Error('Test error');
});

app.get('/protected', protect, (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  });
});

app.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome admin'
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use(errorHandler);



module.exports = app;