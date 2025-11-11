/**
 * MLSegmentationService - Servicio para segmentación celular usando modelos ML
 * 
 * Nota: Esta es una implementación base que simula la integración con modelos ML.
 * En producción, este servicio se comunicaría con un microservicio Python que ejecuta
 * los modelos reales (CellPose, StarDist, U-Net, Mask R-CNN).
 */

import sharp from 'sharp';
import { ColorMappingService } from './colorMapping.service.js';

export class MLSegmentationService {
  constructor() {
    this.colorMapper = new ColorMappingService();
    this.availableModels = {
      cellpose: {
        name: 'CellPose',
        description: 'Segmentación universal de células sin entrenamiento previo',
        supports: ['cells', 'nuclei', 'cytoplasm'],
        defaultParams: { diameter: 30, flow_threshold: 0.4, cellprob_threshold: 0.0 }
      },
      stardist: {
        name: 'StarDist',
        description: 'Segmentación de núcleos con forma estelar',
        supports: ['nuclei'],
        defaultParams: { prob_thresh: 0.5, nms_thresh: 0.4 }
      },
      unet: {
        name: 'U-Net',
        description: 'Modelo pre-entrenado para células específicas',
        supports: ['cells', 'nuclei'],
        defaultParams: { threshold: 0.5 }
      },
      maskrcnn: {
        name: 'Mask R-CNN',
        description: 'Detección y segmentación de instancias',
        supports: ['cells', 'nuclei', 'organelles'],
        defaultParams: { confidence_threshold: 0.7, nms_threshold: 0.3 }
      }
    };
  }

  /**
   * Segmenta células usando el modelo especificado
   * @param {Buffer} imageBuffer - Imagen a segmentar
   * @param {string} modelType - Tipo de modelo ('cellpose', 'stardist', 'unet', 'maskrcnn')
   * @param {Object} options - Parámetros del modelo
   * @returns {Promise<SegmentationResult>}
   */
  async segmentCells(imageBuffer, modelType = 'cellpose', options = {}) {
    console.log(`Segmenting cells using ${modelType} model`);

    // Validar modelo
    if (!this.availableModels[modelType]) {
      throw new Error(`Unknown model type: ${modelType}`);
    }

    const model = this.availableModels[modelType];
    const params = { ...model.defaultParams, ...options };

    // En producción, aquí se haría una llamada al microservicio Python
    // Por ahora, usamos segmentación básica mejorada como placeholder
    const result = await this.performSegmentation(imageBuffer, modelType, params);

    return result;
  }

  /**
   * Realiza segmentación (placeholder que simula ML)
   * En producción, esto llamaría a un servicio Python con modelos reales
   */
  async performSegmentation(imageBuffer, modelType, params) {
    // Obtener datos de imagen
    const { data, info } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Aplicar threshold adaptativo basado en el modelo
    const threshold = this.getAdaptiveThreshold(data, info.width, info.height, modelType, params);
    
    // Segmentar usando método mejorado
    const masks = await this.createMasks(data, info.width, info.height, threshold, params);
    
    // Calcular métricas para cada célula
    const cellMetrics = await this.calculateCellMetrics(masks, data, info.width, info.height);
    
    // Crear máscara de visualización
    const visualizationMask = await this.createVisualizationMask(
      masks,
      info.width,
      info.height
    );

    return {
      masks: visualizationMask,
      cells: cellMetrics,
      metadata: {
        model: modelType,
        parameters: params,
        imageDimensions: { width: info.width, height: info.height },
        totalCells: cellMetrics.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Calcula threshold adaptativo según el modelo
   */
  getAdaptiveThreshold(data, width, height, modelType, params) {
    // Calcular histograma
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i++) {
      histogram[data[i]]++;
    }

    // Calcular percentiles
    let sum = 0;
    const total = data.length;
    let p25 = 0, p75 = 0, median = 0;

    for (let i = 0; i < 256; i++) {
      sum += histogram[i];
      if (sum >= total * 0.25 && p25 === 0) p25 = i;
      if (sum >= total * 0.5 && median === 0) median = i;
      if (sum >= total * 0.75 && p75 === 0) p75 = i;
    }

    // Threshold adaptativo según modelo
    switch (modelType) {
      case 'cellpose':
        return median + (p75 - p25) * 0.3;
      case 'stardist':
        return median * 0.8;
      case 'unet':
        return params.threshold * 255;
      case 'maskrcnn':
        return median * 0.7;
      default:
        return median;
    }
  }

  /**
   * Crea máscaras de segmentación usando connected components mejorado
   */
  async createMasks(data, width, height, threshold, params) {
    const visited = new Set();
    const masks = [];
    let maskId = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (data[idx] > threshold && !visited.has(idx)) {
          const component = this.floodFillImproved(data, width, height, x, y, visited, threshold);
          
          // Filtrar por tamaño mínimo (según parámetros del modelo)
          const minSize = params.min_size || 50;
          if (component.pixels.length >= minSize) {
            masks.push({
              id: maskId++,
              pixels: component.pixels,
              centroid: component.centroid,
              bbox: component.bbox,
              area: component.pixels.length
            });
          }
        }
      }
    }

    return masks;
  }

  /**
   * Flood fill mejorado con mejor manejo de bordes
   */
  floodFillImproved(data, width, height, startX, startY, visited, threshold) {
    const pixels = [];
    const stack = [[startX, startY]];
    let sumX = 0, sumY = 0;
    let minX = startX, maxX = startX, minY = startY, maxY = startY;

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const idx = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height || visited.has(idx) || data[idx] <= threshold) {
        continue;
      }

      visited.add(idx);
      pixels.push([x, y]);
      sumX += x;
      sumY += y;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      // 8-connectivity para mejor segmentación
      stack.push(
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
        [x + 1, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1]
      );
    }

    return {
      pixels,
      centroid: { x: sumX / pixels.length, y: sumY / pixels.length },
      bbox: { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
    };
  }

  /**
   * Calcula métricas detalladas para cada célula detectada
   */
  async calculateCellMetrics(masks, imageData, width, height) {
    return masks.map((mask, idx) => {
      // Calcular intensidad media
      let sumIntensity = 0;
      mask.pixels.forEach(([x, y]) => {
        const idx = y * width + x;
        sumIntensity += imageData[idx];
      });
      const meanIntensity = sumIntensity / mask.pixels.length;

      // Calcular perímetro (aproximado)
      const perimeter = this.calculatePerimeter(mask.pixels, width, height);

      // Calcular circularidad
      const circularity = (4 * Math.PI * mask.area) / (perimeter * perimeter);

      // Calcular momentos
      const moments = this.calculateMoments(mask.pixels, mask.centroid);

      return {
        id: mask.id,
        area: mask.area,
        perimeter: perimeter,
        circularity: circularity,
        meanIntensity: meanIntensity,
        centroid: mask.centroid,
        bbox: mask.bbox,
        moments: moments,
        // Métricas adicionales
        aspectRatio: mask.bbox.width / (mask.bbox.height || 1),
        solidity: mask.area / (mask.bbox.width * mask.bbox.height || 1),
        extent: mask.area / (mask.bbox.width * mask.bbox.height || 1)
      };
    });
  }

  /**
   * Calcula el perímetro de una máscara
   */
  calculatePerimeter(pixels, width, height) {
    const pixelSet = new Set(pixels.map(([x, y]) => `${x},${y}`));
    let perimeter = 0;

    pixels.forEach(([x, y]) => {
      // Verificar vecinos 4-conectados
      const neighbors = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
      ];

      neighbors.forEach(([nx, ny]) => {
        if (!pixelSet.has(`${nx},${ny}`)) {
          perimeter++;
        }
      });
    });

    return perimeter;
  }

  /**
   * Calcula momentos de imagen para análisis de forma
   */
  calculateMoments(pixels, centroid) {
    let m00 = 0, m10 = 0, m01 = 0, m11 = 0, m20 = 0, m02 = 0;

    pixels.forEach(([x, y]) => {
      const dx = x - centroid.x;
      const dy = y - centroid.y;
      m00 += 1;
      m10 += dx;
      m01 += dy;
      m11 += dx * dy;
      m20 += dx * dx;
      m02 += dy * dy;
    });

    return {
      m00, m10, m01, m11, m20, m02,
      // Hu moments (invariantes a escala y rotación)
      hu1: m20 + m02,
      hu2: Math.pow(m20 - m02, 2) + 4 * Math.pow(m11, 2)
    };
  }

  /**
   * Crea máscara de visualización con colores únicos por célula
   */
  async createVisualizationMask(masks, width, height) {
    const rgbBuffer = Buffer.alloc(width * height * 3);
    const maskBuffer = Buffer.alloc(width * height * 4); // RGBA para transparencia

    // Inicializar con fondo transparente
    for (let i = 0; i < width * height; i++) {
      maskBuffer[i * 4 + 3] = 0; // Alpha = 0 (transparente)
    }

    // Colorear cada máscara con color único
    masks.forEach((mask, idx) => {
      const color = this.getColorForMask(idx);
      
      mask.pixels.forEach(([x, y]) => {
        const pixelIdx = y * width + x;
        maskBuffer[pixelIdx * 4] = color.r;     // R
        maskBuffer[pixelIdx * 4 + 1] = color.g; // G
        maskBuffer[pixelIdx * 4 + 2] = color.b; // B
        maskBuffer[pixelIdx * 4 + 3] = 200;     // Alpha (semi-transparente)
      });
    });

    return await sharp(maskBuffer, {
      raw: {
        width,
        height,
        channels: 4
      }
    }).png().toBuffer();
  }

  /**
   * Genera color único para cada máscara
   */
  getColorForMask(index) {
    // Generar colores distintos usando HSV
    const hue = (index * 137.508) % 360; // Golden angle para distribución uniforme
    return this.hsvToRgb(hue / 360, 0.8, 0.9);
  }

  /**
   * Convierte HSV a RGB
   */
  hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = v - c;

    let r, g, b;
    if (h < 1/6) { r = c; g = x; b = 0; }
    else if (h < 2/6) { r = x; g = c; b = 0; }
    else if (h < 3/6) { r = 0; g = c; b = x; }
    else if (h < 4/6) { r = 0; g = x; b = c; }
    else if (h < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  /**
   * Obtiene información de modelos disponibles
   */
  getAvailableModels() {
    return Object.keys(this.availableModels).map(key => ({
      id: key,
      ...this.availableModels[key]
    }));
  }
}

