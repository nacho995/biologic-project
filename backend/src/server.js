import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import imageRoutes from './routes/images.routes.js';
import imageProcessRoutes from './routes/imageProcess.routes.js';
import metadataRoutes from './routes/metadata.routes.js';
import compositionRoutes from './routes/composition.routes.js';
import mlSegmentationRoutes from './routes/mlSegmentation.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';
import sequelize from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Inicializar base de datos
import('./scripts/init-db.js')
  .then((module) => module.initDatabase())
  .then(() => {
    console.log('Database initialized successfully.');
  })
  .catch((err) => {
    console.error('Unable to initialize database:', err);
  });

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:80',
  'http://localhost:3000',
  'http://127.0.0.1:80',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches localhost pattern
    if (allowedOrigins.includes(origin) || 
        origin.startsWith('http://localhost:') || 
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('https://') && origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', {
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length'],
  });
  next();
});

// Increase body parser limits to match multer limits (100MB)
// Note: express.json and express.urlencoded automatically skip multipart/form-data
// so multer can handle it properly
app.use((req, res, next) => {
  // Skip body parsing for multipart/form-data (multer will handle it)
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.json({ limit: '100mb' })(req, res, next);
});

app.use((req, res, next) => {
  // Skip body parsing for multipart/form-data
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '100mb' })(req, res, next);
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/image', imageProcessRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/compositions', compositionRoutes);
app.use('/api/ml', mlSegmentationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit immediately, let the process manager handle it
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit immediately, let the process manager handle it
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    sequelize.close()
      .then(() => {
        console.log('Database connection closed');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error closing database connection:', err);
        process.exit(1);
      });
  });
});

