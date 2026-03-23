const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { AppError, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const protect = require('./middleware/protect');
const restrictTo = require('./middleware/restrictTo');
const adminRoutes = require('./routes/admin.routes');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClipSphere API',
      version: '1.0.0',
      description: 'Backend API for the ClipSphere project'
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/app.js']
});




const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);



/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Public health check
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
// health route
app.get('/api/v1/health', (req, res) => {
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
    data: {
      user: req.user
    }
  });
});

app.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'Welcome admin'
    }
  });
});

// 404
app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

app.use(errorHandler);



module.exports = app;