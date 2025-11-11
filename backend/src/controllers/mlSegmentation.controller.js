import { MLSegmentationService } from '../services/mlSegmentation.service.js';
import { FileStorageService } from '../services/fileStorage.service.js';
import models from '../models/index.js';

const { Image } = models;
const mlSegmentation = new MLSegmentationService();
const fileStorage = new FileStorageService();

/**
 * POST /api/ml/segment
 * Realiza segmentación celular usando modelos ML
 */
export const segmentCells = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { modelType = 'cellpose', options = {} } = req.body;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Leer imagen
    const imageBuffer = await fileStorage.getFile(image.imagePath);

    // Realizar segmentación
    const result = await mlSegmentation.segmentCells(imageBuffer, modelType, options);

    // Enviar máscara de visualización
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('X-Segmentation-Metadata', JSON.stringify({
      totalCells: result.metadata.totalCells,
      model: result.metadata.model,
      timestamp: result.metadata.timestamp
    }));

    res.send(result.masks);

    // Opcional: Guardar métricas en base de datos para análisis posterior
    // await saveSegmentationResults(id, result);
  } catch (error) {
    console.error('Error in segmentCells:', error);
    next(error);
  }
};

/**
 * GET /api/ml/segment/:id/metrics
 * Obtiene métricas de segmentación
 */
export const getSegmentationMetrics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { modelType = 'cellpose', options = {} } = req.query;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    const result = await mlSegmentation.segmentCells(imageBuffer, modelType, options);

    res.json({
      status: 'success',
      imageId: id,
      metrics: result.cells,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error in getSegmentationMetrics:', error);
    next(error);
  }
};

/**
 * GET /api/ml/models
 * Obtiene lista de modelos ML disponibles
 */
export const getAvailableModels = async (req, res, next) => {
  try {
    const models = mlSegmentation.getAvailableModels();
    res.json({
      status: 'success',
      models
    });
  } catch (error) {
    console.error('Error in getAvailableModels:', error);
    next(error);
  }
};

