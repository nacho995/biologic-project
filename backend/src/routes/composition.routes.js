import { Router } from 'express';
import {
  createComposition,
  getAllCompositions,
  getCompositionById,
  updateComposition,
  deleteComposition,
  renderComposition,
} from '../controllers/composition.controller.js';

const router = Router();

router.post('/', createComposition);
router.get('/', getAllCompositions);
router.get('/:id', getCompositionById);
router.put('/:id', updateComposition);
router.delete('/:id', deleteComposition);
router.post('/:id/render', renderComposition);

export default router;

