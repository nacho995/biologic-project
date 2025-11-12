import { Router } from 'express';
import { processImage, getImageHistogram } from '../controllers/imageProcess.controller.js';

const router = Router();

// Endpoint principal de procesamiento de imagen
router.post('/process', processImage);

// Endpoint de histograma
router.get('/:id/histogram', getImageHistogram);

export default router;




