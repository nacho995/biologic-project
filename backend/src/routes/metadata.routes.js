import { Router } from 'express';
import { getMetadata, getAllMetadata } from '../controllers/metadata.controller.js';

const router = Router();

router.get('/', getAllMetadata);
router.get('/:imageId', getMetadata);

export default router;

