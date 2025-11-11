import { Router } from 'express';
import { uploadImages } from '../controllers/upload.controller.js';
import { uploadImages as uploadImagesMiddleware } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/images', (req, res, next) => {
  console.log('POST /api/upload/images route hit');
  console.log('Content-Type:', req.headers['content-type']);
  next();
}, uploadImagesMiddleware, uploadImages);

export default router;

