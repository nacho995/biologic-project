import { Router } from 'express';
import {
  createCsvUpload,
  getAllCsvUploads,
  getCsvUploadById,
  updateCsvUpload,
  deleteCsvUpload,
} from '../controllers/csvUpload.controller.js';
import { uploadCSV as uploadCSVMiddleware } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/', (req, res, next) => {
  console.log('POST /api/csv-uploads route hit');
  console.log('Request Content-Type:', req.headers['content-type']);
  next();
}, uploadCSVMiddleware, createCsvUpload);
router.get('/', getAllCsvUploads);
router.get('/:id', getCsvUploadById);
router.put('/:id', updateCsvUpload);
router.patch('/:id', updateCsvUpload);
router.delete('/:id', deleteCsvUpload);

export default router;

