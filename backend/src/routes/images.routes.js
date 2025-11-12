import { Router } from 'express';
import {
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
  getImage,
  getThumbnail,
  adjustColor,
  getSlice,
  getQuantitativeAnalysis,
  performCellSegmentation,
  exportToOMETIFF,
  exportToHDF5,
} from '../controllers/image.controller.js';

const router = Router();

// Nuevos endpoints CRUD
router.get('/', getAllImages);
router.get('/:id/details', getImageById);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

// Endpoints existentes (compatibilidad)
router.get('/:id', getImage);
router.get('/:id/thumbnail', getThumbnail);
router.get('/:id/slices', getSlice);
router.post('/:id/color-adjust', adjustColor);

// Nuevos endpoints de análisis avanzado
router.get('/:id/quantitative-analysis', getQuantitativeAnalysis);
router.post('/:id/segment', performCellSegmentation);
router.post('/:id/export/ome-tiff', exportToOMETIFF);
router.post('/:id/export/hdf5', exportToHDF5);

export default router;

