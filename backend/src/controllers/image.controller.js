import { FileStorageService } from '../services/fileStorage.service.js';
import { ImageProcessorService } from '../services/imageProcessor.service.js';
import { ColorMappingService } from '../services/colorMapping.service.js';
import models from '../models/index.js';
import sharp from 'sharp';

const { Image, CsvUpload } = models;
const fileStorage = new FileStorageService();
const imageProcessor = new ImageProcessorService();
const colorMapper = new ColorMappingService();

export const getAllImages = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      csvUploadId,
      sortBy = 'uploadDate',
      order = 'DESC',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (csvUploadId) {
      where.csvUploadId = csvUploadId;
    }

    const { count, rows } = await Image.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: CsvUpload,
          as: 'csvUpload',
          attributes: ['id', 'filename'],
        },
      ],
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id, {
      include: [
        {
          model: CsvUpload,
          as: 'csvUpload',
        },
      ],
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    next(error);
  }
};

export const getImagesByCsv = async (req, res, next) => {
  try {
    const { csvId } = req.params;

    const images = await Image.findAll({
      where: { csvUploadId: csvId },
      order: [['uploadDate', 'DESC']],
    });

    res.json({
      count: images.length,
      images,
    });
  } catch (error) {
    next(error);
  }
};

export const updateImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { metadata, csvUploadId } = req.body;

    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (metadata) image.metadata = { ...image.metadata, ...metadata };
    if (csvUploadId !== undefined) image.csvUploadId = csvUploadId;

    await image.save();

    res.json(image);
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Eliminar archivos físicos
    try {
      if (image.imagePath) {
        await fileStorage.deleteFile(image.imagePath).catch(() => {});
      }
      if (image.thumbnailPath) {
        await fileStorage.deleteFile(image.thumbnailPath).catch(() => {});
      }
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
    }

    await image.destroy();

    res.json({ message: 'Image deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

// Mantener endpoints existentes para compatibilidad
// MODIFICADO: Siempre aplica filtrado de negro automáticamente
export const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image) {
      const error = new Error('Image not found');
      error.statusCode = 404;
      return next(error);
    }

    console.log(`Getting image ${id} with automatic black background filtering`);
    const imageBuffer = await fileStorage.getFile(image.imagePath);
    
    // SIEMPRE aplicar filtrado de negro con un color neutro (grayscale con transparencia)
    // Esto asegura que el fondo negro NUNCA se vea
    const { data, info } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Aplicar filtrado automático de negro (percentil 25)
    const filteredBuffer = await applyAutoBlackFiltering(data, info.width, info.height);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(filteredBuffer);
  } catch (error) {
    console.error('Error in getImage:', error);
    next(error);
  }
};

// Método auxiliar para filtrar negro automáticamente
const applyAutoBlackFiltering = async (channelData, width, height) => {
  const rgbaBuffer = Buffer.alloc(channelData.length * 4); // RGBA
  
  // Calcular threshold dinámico (percentil 25)
  const sortedSample = [];
  const sampleSize = Math.min(10000, channelData.length);
  const step = Math.floor(channelData.length / sampleSize);
  for (let i = 0; i < channelData.length; i += step) {
    sortedSample.push(channelData[i]);
  }
  sortedSample.sort((a, b) => a - b);
  const BLACK_THRESHOLD = sortedSample[Math.floor(sortedSample.length * 0.25)];
  
  let transparentCount = 0;
  
  for (let i = 0; i < channelData.length; i++) {
    const value = channelData[i];
    
    // Filtrar fondo negro
    if (value <= BLACK_THRESHOLD) {
      rgbaBuffer[i * 4] = 0;
      rgbaBuffer[i * 4 + 1] = 0;
      rgbaBuffer[i * 4 + 2] = 0;
      rgbaBuffer[i * 4 + 3] = 0; // Transparente
      transparentCount++;
    } else {
      // Mantener en escala de grises
      rgbaBuffer[i * 4] = value;
      rgbaBuffer[i * 4 + 1] = value;
      rgbaBuffer[i * 4 + 2] = value;
      rgbaBuffer[i * 4 + 3] = 255; // Opaco
    }
  }
  
  console.log(`Auto black filtering: ${transparentCount} transparent pixels (value <= ${BLACK_THRESHOLD}) out of ${channelData.length}`);
  
  return await sharp(rgbaBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  }).png().toBuffer();
};

export const getThumbnail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image || !image.thumbnailPath) {
      const error = new Error('Thumbnail not found');
      error.statusCode = 404;
      return next(error);
    }

    const thumbnailBuffer = await fileStorage.getFile(image.thumbnailPath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(thumbnailBuffer);
  } catch (error) {
    next(error);
  }
};

export const adjustColor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustments } = req.body;
    const image = await Image.findByPk(id);

    if (!image) {
      const error = new Error('Image not found');
      error.statusCode = 404;
      return next(error);
    }

    console.log(`Adjusting color for image ${id}, adjustments:`, JSON.stringify(adjustments, null, 2));
    
    // Leer la imagen original
    const imageBuffer = await fileStorage.getFile(image.imagePath);
    
    // Aplicar colormaps usando el servicio de mapeo de colores
    const processedBuffer = await colorMapper.combineChannels(
      imageBuffer,
      adjustments
    );

    // Always return as PNG for consistent browser compatibility
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(processedBuffer);
  } catch (error) {
    console.error('Error in adjustColor:', error);
    next(error);
  }
};

export const getSlice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { axis, index } = req.query;
    const image = await Image.findByPk(id);

    if (!image) {
      const error = new Error('Image not found');
      error.statusCode = 404;
      return next(error);
    }

    const sliceBuffer = await imageProcessor.getImageSlice(
      image.imagePath,
      axis,
      Number(index)
    );

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(sliceBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /images/:id/quantitative-analysis
 * Obtiene análisis cuantitativo completo de la imagen
 */
export const getQuantitativeAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    const metadata = await sharp(imageBuffer).metadata();

    // Obtener ajustes activos desde query params o usar defaults
    const adjustments = req.query.adjustments 
      ? JSON.parse(req.query.adjustments)
      : [{ channel: 0, colorId: 2, contrast: 100, enabled: true }];

    // Realizar análisis cuantitativo
    const analysis = await colorMapper.performQuantitativeAnalysis(
      imageBuffer,
      adjustments
    );

    // Agregar metadatos de imagen
    analysis.imageMetadata = {
      width: metadata.width || 0,
      height: metadata.height || 0,
      channels: metadata.channels || 1,
      format: metadata.format || 'unknown',
      depth: metadata.pages || 1,
    };

    res.json({
      status: 'success',
      imageId: id,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in getQuantitativeAnalysis:', error);
    next(error);
  }
};

/**
 * POST /images/:id/segment
 * Realiza segmentación celular básica
 */
export const performCellSegmentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { method = 'threshold', options = {} } = req.body;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    
    // Segmentación básica usando threshold
    // En producción usarías modelos de ML avanzados
    const segmentedBuffer = await colorMapper.performBasicSegmentation(
      imageBuffer,
      method,
      options
    );

    res.setHeader('Content-Type', 'image/png');
    res.send(segmentedBuffer);
  } catch (error) {
    console.error('Error in performCellSegmentation:', error);
    next(error);
  }
};

/**
 * POST /images/:id/export/ome-tiff
 * Exporta imagen a formato OME-TIFF
 */
export const exportToOMETIFF = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustments = [] } = req.body;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageBuffer = await fileStorage.getFile(image.imagePath);
    
    // Procesar imagen con ajustes si se proporcionan
    let processedBuffer = imageBuffer;
    if (adjustments.length > 0) {
      processedBuffer = await colorMapper.combineChannels(imageBuffer, adjustments);
    }

    // Convertir a TIFF (simplificado - en producción usarías biblioteca OME-TIFF completa)
    const tiffBuffer = await sharp(processedBuffer)
      .tiff()
      .toBuffer();

    res.setHeader('Content-Type', 'image/tiff');
    res.setHeader('Content-Disposition', `attachment; filename="image_${id}.ome.tiff"`);
    res.send(tiffBuffer);
  } catch (error) {
    console.error('Error in exportToOMETIFF:', error);
    next(error);
  }
};

/**
 * POST /images/:id/export/hdf5
 * Exporta imagen a formato HDF5 (simplificado)
 */
export const exportToHDF5 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Nota: HDF5 requiere biblioteca especializada (h5py en Python)
    // Esta es una implementación simplificada que devuelve JSON
    // En producción, usarías un servicio Python o biblioteca Node.js para HDF5
    
    const imageBuffer = await fileStorage.getFile(image.imagePath);
    const metadata = await sharp(imageBuffer).metadata();

    res.json({
      status: 'info',
      message: 'HDF5 export requires specialized library. Returning metadata structure.',
      imageId: id,
      structure: {
        '/image/data': {
          shape: [metadata.height, metadata.width, metadata.channels || 1],
          dtype: 'uint8',
        },
        '/image/metadata': {
          width: metadata.width,
          height: metadata.height,
          channels: metadata.channels || 1,
          format: metadata.format,
        },
      },
      note: 'For full HDF5 export, implement using h5py (Python) or hdf5-js (Node.js)',
    });
  } catch (error) {
    console.error('Error in exportToHDF5:', error);
    next(error);
  }
};
