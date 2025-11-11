import { Router } from 'express';
import {
  segmentCells,
  getSegmentationMetrics,
  getAvailableModels,
} from '../controllers/mlSegmentation.controller.js';

const router = Router();

router.get('/models', getAvailableModels);
router.post('/segment/:id', segmentCells);
router.get('/segment/:id/metrics', getSegmentationMetrics);

export default router;

