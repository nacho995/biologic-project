import sharp from 'sharp';
import { ColorMappingService } from '../services/colorMapping.service.js';
import { FileStorageService } from '../services/fileStorage.service.js';
import models from '../models/index.js';

const { Image } = models;
const colorMapper = new ColorMappingService();
const fileStorage = new FileStorageService();

/**
 * POST /api/image/process
 * Procesa imagen con contraste, brillo y colormap según especificaciones
 * 
 * Body:
 * {
 *   imageId: string,
 *   contrast: number (0.5-3.0),
 *   brightness: number (-100 to +100),
 *   colormap_type: 'he' | 'fluorescent' | 'segment' | 'region',
 *   colorId: number (1-12, solo para modo fluorescent)
 * }
 */
export const processImage = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { 
      imageId, 
      contrast = 1.0, 
      brightness = 0, 
      colormap_type = 'fluorescent',
      colorId = 2 
    } = req.body;

    // Validaciones
    if (!imageId) {
      return res.status(400).json({ 
        status: 'error',
        code: 400,
        message: 'imageId is required' 
      });
    }

    if (contrast < 0.5 || contrast > 3.0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Contrast must be between 0.5 and 3.0'
      });
    }

    if (brightness < -100 || brightness > 100) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Brightness must be between -100 and +100'
      });
    }

    // Buscar imagen en base de datos
    const image = await Image.findByPk(imageId);
    if (!image) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Image not found'
      });
    }

    // Leer archivo
    const imageBuffer = await fileStorage.getFile(image.imagePath);

    // Procesar según modo
    const processedBuffer = await colorMapper.processImage(imageBuffer, {
      mode: colormap_type,
      brightness,
      contrast,
      colorId
    });

    // Convertir a base64
    const base64Image = processedBuffer.toString('base64');
    const processingTime = Date.now() - startTime;

    console.log(`Image processed in ${processingTime}ms`);

    // Respuesta según especificación con datos cuantitativos
    res.json({
      status: 'success',
      image_base64: `data:image/png;base64,${base64Image}`,
      dimensions: {
        width: image.dimensions?.width || 0,
        height: image.dimensions?.height || 0
      },
      applied_contrast: contrast,
      applied_brightness: brightness,
      applied_colormap: colormap_type,
      processing_time_ms: processingTime,
      quantitative_data: processedBuffer.quantitativeData || null
    });

  } catch (error) {
    console.error('Error in processImage:', error);
    next(error);
  }
};

/**
 * GET /api/image/:id/histogram
 * Genera histograma de distribución de valores de píxeles
 */
export const getImageHistogram = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    const { data, info } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Crear histograma (256 bins para valores 0-255)
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i++) {
      histogram[data[i]]++;
    }

    res.json({
      imageId: id,
      histogram,
      width: info.width,
      height: info.height,
      totalPixels: data.length
    });

  } catch (error) {
    console.error('Error generating histogram:', error);
    next(error);
  }
};

