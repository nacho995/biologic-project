import sharp from 'sharp';

/**
 * ColorMappingService - Servicio profesional para procesamiento de imágenes multicanal
 * 
 * Basado en:
 * - Bio-image Analysis Notebooks: https://biapol.github.io/blog/robert_haase/BioImageAnalysisNotebooks/
 * - Spatial analysis: https://ultivue.com/image-analysis/
 * - Multiplex immunofluorescence workflows
 */
export class ColorMappingService {
  constructor() {
    // Mapeo profesional de marcadores fluorescentes con metadatos biológicos
    this.colorMap = {
      1: {
        name: 'DAPI',
        r: 0, g: 0, b: 255,
        fluorophore: 'DAPI',
        target: 'DNA/Nuclei',
        excitation: 358,
        emission: 461,
        description: '4\',6-diamidino-2-phenylindole - marca ADN nuclear'
      },
      2: {
        name: 'FITC/GFP',
        r: 0, g: 255, b: 0,
        fluorophore: 'FITC/GFP',
        target: 'Proteins/Cells',
        excitation: 488,
        emission: 509,
        description: 'Fluorescein/Green Fluorescent Protein'
      },
      3: {
        name: 'Texas Red/PE',
        r: 255, g: 0, b: 0,
        fluorophore: 'Texas Red/PE',
        target: 'Proteins/Cells',
        excitation: 596,
        emission: 615,
        description: 'Phycoerythrin - marcador común en citometría'
      },
      4: {
        name: 'CFP',
        r: 0, g: 255, b: 255,
        fluorophore: 'CFP',
        target: 'Proteins',
        excitation: 433,
        emission: 475,
        description: 'Cyan Fluorescent Protein'
      },
      5: {
        name: 'Cy5/Far-Red',
        r: 255, g: 0, b: 255,
        fluorophore: 'Cy5',
        target: 'Proteins',
        excitation: 649,
        emission: 670,
        description: 'Cianina 5 - bajo autofluorescencia tisular'
      },
      6: {
        name: 'YFP',
        r: 255, g: 255, b: 0,
        fluorophore: 'YFP',
        target: 'Proteins',
        excitation: 514,
        emission: 527,
        description: 'Yellow Fluorescent Protein'
      },
      7: {
        name: 'Orange',
        r: 255, g: 165, b: 0,
        fluorophore: 'RFP variants',
        target: 'Proteins',
        excitation: 555,
        emission: 584,
        description: 'Orange fluorescent proteins'
      },
      8: {
        name: 'APC',
        r: 128, g: 0, b: 128,
        fluorophore: 'APC',
        target: 'Proteins',
        excitation: 650,
        emission: 660,
        description: 'Allophycocyanin - usado en paneles multicolor'
      },
      9: {
        name: 'PerCP',
        r: 255, g: 192, b: 203,
        fluorophore: 'PerCP',
        target: 'Proteins',
        excitation: 488,
        emission: 678,
        description: 'Peridinin-chlorophyll-protein complex'
      },
      10: {
        name: 'PE-Cy7',
        r: 50, g: 205, b: 50,
        fluorophore: 'PE-Cy7',
        target: 'Proteins',
        excitation: 496,
        emission: 785,
        description: 'PE-Cyanine7 tandem dye'
      },
      11: {
        name: 'APC-Cy7',
        r: 0, g: 128, b: 128,
        fluorophore: 'APC-Cy7',
        target: 'Proteins',
        excitation: 650,
        emission: 785,
        description: 'APC-Cyanine7 tandem dye'
      },
      12: {
        name: 'BV421',
        r: 75, g: 0, b: 130,
        fluorophore: 'BV421',
        target: 'Proteins',
        excitation: 405,
        emission: 421,
        description: 'Brilliant Violet 421 - alta estabilidad foto'
      },
    };

    // Patrones de detección automática de canales
    this.channelPatterns = {
      dapi: { wavelengths: [350-400, 450-470], colors: ['blue', 'cyan'] },
      gfp: { wavelengths: [470-500, 500-530], colors: ['green', 'lime'] },
      rfp: { wavelengths: [540-580, 580-620], colors: ['red', 'orange'] },
      cy5: { wavelengths: [630-670, 670-710], colors: ['magenta', 'purple'] },
      cy7: { wavelengths: [730-780, 780-820], colors: ['far-red', 'near-ir'] },
    };
  }

  /**
   * Detecta automáticamente el tipo de marcador fluorescente basado en análisis de histograma
   */
  async detectFluorophoreType(channelData, width, height) {
    // Análisis estadístico del canal para identificar el marcador
    const stats = this.calculateChannelStatistics(channelData, width, height);

    // Lógica de detección basada en características del histograma
    if (stats.mean < 50 && stats.stdDev < 30) {
      return { type: 'DAPI', confidence: 0.9, reasoning: 'Low intensity, tight distribution - typical DAPI staining' };
    } else if (stats.mean > 100 && stats.skewness > 0.5) {
      return { type: 'FITC/GFP', confidence: 0.8, reasoning: 'High intensity with positive skew - typical GFP expression' };
    } else if (stats.mean > 80 && stats.kurtosis > 1) {
      return { type: 'PE/TexasRed', confidence: 0.7, reasoning: 'High intensity with heavy tails - typical PE staining' };
    }

    return { type: 'Unknown', confidence: 0.3, reasoning: 'Could not determine fluorophore type' };
  }

  /**
   * Calcula estadísticas avanzadas de un canal para análisis cuantitativo
   */
  calculateChannelStatistics(data, width, height) {
    const totalPixels = width * height;
    let sum = 0, sumSq = 0, min = 255, max = 0;
    const histogram = new Array(256).fill(0);

    for (let i = 0; i < totalPixels; i++) {
      const value = data[i];
      sum += value;
      sumSq += value * value;
      min = Math.min(min, value);
      max = Math.max(max, value);
      histogram[value]++;
    }

    const mean = sum / totalPixels;
    const variance = (sumSq / totalPixels) - (mean * mean);
    const stdDev = Math.sqrt(variance);

    // Calcular skewness y kurtosis
    let skewness = 0, kurtosis = 0;
    for (let i = 0; i < totalPixels; i++) {
      const diff = data[i] - mean;
      const diff3 = diff * diff * diff;
      const diff4 = diff3 * diff;
      skewness += diff3;
      kurtosis += diff4;
    }
    skewness /= (totalPixels * stdDev * stdDev * stdDev);
    kurtosis = (kurtosis / (totalPixels * variance * variance)) - 3;

    return {
      mean,
      stdDev,
      min,
      max,
      variance,
      skewness,
      kurtosis,
      histogram,
      totalPixels,
      // Métricas biológicas adicionales
      signalToNoise: mean / (stdDev + 0.001),
      dynamicRange: max - min,
      coefficientOfVariation: stdDev / (mean + 0.001)
    };
  }

  /**
   * Análisis de colocalización entre dos canales (coeficiente de Pearson)
   */
  calculatePearsonCorrelation(channel1, channel2) {
    if (channel1.length !== channel2.length) {
      throw new Error('Channels must have same dimensions');
    }

    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, sum12 = 0;
    const n = channel1.length;

    for (let i = 0; i < n; i++) {
      sum1 += channel1[i];
      sum2 += channel2[i];
      sum1Sq += channel1[i] * channel1[i];
      sum2Sq += channel2[i] * channel2[i];
      sum12 += channel1[i] * channel2[i];
    }

    const mean1 = sum1 / n;
    const mean2 = sum2 / n;

    const numerator = sum12 - n * mean1 * mean2;
    const denominator = Math.sqrt(
      (sum1Sq - n * mean1 * mean1) * (sum2Sq - n * mean2 * mean2)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Detecta el número de canales de una imagen
   */
  async detectChannels(imageBuffer) {
    const metadata = await sharp(imageBuffer).metadata();
    return metadata.channels || 1;
  }

  /**
   * Extrae un canal específico de una imagen multicanal
   */
  async extractChannel(imageBuffer, channelIndex) {
    const metadata = await sharp(imageBuffer).metadata();
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const numChannels = info.channels;
    const channelData = Buffer.alloc(info.width * info.height);

    // Extraer solo el canal especificado
    for (let i = 0; i < info.width * info.height; i++) {
      channelData[i] = data[i * numChannels + channelIndex];
    }

    return {
      data: channelData,
      width: info.width,
      height: info.height
    };
  }

  /**
   * Aplica un colormap a un canal en escala de grises
   * Similar a microshow's pure_red, pure_green, pure_blue colormaps
   */
  async applyColormapToChannel(channelData, width, height, color, contrast = 100) {
    const contrastFactor = contrast / 100;
    const rgbBuffer = Buffer.alloc(channelData.length * 3);

    for (let i = 0; i < channelData.length; i++) {
      // Normalizar intensidad (0-1)
      let intensity = channelData[i] / 255;
      
      // Aplicar contraste
      intensity = Math.max(0, Math.min(1, (intensity - 0.5) * contrastFactor + 0.5));
      
      // Aplicar color
      rgbBuffer[i * 3] = Math.round(intensity * color.r);
      rgbBuffer[i * 3 + 1] = Math.round(intensity * color.g);
      rgbBuffer[i * 3 + 2] = Math.round(intensity * color.b);
    }

    return await sharp(rgbBuffer, {
      raw: {
        width,
        height,
        channels: 3
      }
    }).png().toBuffer();
  }

  /**
   * Combina múltiples capas de color para imágenes grayscale
   * Usa blend mode screen para mejor visualización de múltiples colores
   */
  async combineColorLayers(coloredLayers, width, height) {
    if (coloredLayers.length === 0) {
      throw new Error('No layers to combine');
    }

    if (coloredLayers.length === 1) {
      return coloredLayers[0];
    }

    console.log(`combineColorLayers: Combining ${coloredLayers.length} color layers`);

    // Convertir todas las capas a raw RGB
    const layerBuffers = await Promise.all(
      coloredLayers.map(async (layer, idx) => {
        const { data, info } = await sharp(layer)
          .raw()
          .toBuffer({ resolveWithObject: true });
        console.log(`Layer ${idx}: ${info.width}x${info.height}, ${info.channels} channels`);
        return data;
      })
    );

    // Combinar usando blend mode screen (1 - (1-a) * (1-b))
    // Esto es mejor para overlays de color que suma aditiva
    const combinedBuffer = Buffer.alloc(width * height * 3);
    
    for (let i = 0; i < width * height * 3; i++) {
      let result = 0;
      
      // Aplicar blend mode screen a todas las capas
      for (const layerBuffer of layerBuffers) {
        if (i < layerBuffer.length) {
          const value = layerBuffer[i] / 255; // Normalizar a 0-1
          // Screen blend: 1 - (1-result) * (1-value)
          result = 1 - (1 - result) * (1 - value);
        }
      }
      
      // Convertir de vuelta a 0-255
      combinedBuffer[i] = Math.round(result * 255);
    }

    console.log(`Combined ${layerBuffers.length} color layers using screen blend mode`);

    return await sharp(combinedBuffer, {
      raw: {
        width,
        height,
        channels: 3
      }
    }).png().toBuffer();
  }

  /**
   * Combina múltiples canales coloreados usando blend mode aditivo
   * Similar a como ImageJ/FIJI combina canales
   */
  async combineChannelsAdditive(coloredChannels) {
    if (coloredChannels.length === 0) {
      throw new Error('No channels to combine');
    }

    console.log(`combineChannelsAdditive: Combining ${coloredChannels.length} channels`);

    if (coloredChannels.length === 1) {
      console.log('Only one channel, returning as-is');
      return coloredChannels[0];
    }

    // Obtener dimensiones del primer canal
    const firstMetadata = await sharp(coloredChannels[0]).metadata();
    const width = firstMetadata.width;
    const height = firstMetadata.height;
    console.log(`Combining channels with dimensions: ${width}x${height}`);

    // Convertir todos los canales a raw RGB
    const channelBuffers = await Promise.all(
      coloredChannels.map(async (channel, idx) => {
        const { data, info } = await sharp(channel)
          .raw()
          .toBuffer({ resolveWithObject: true });
        console.log(`Channel ${idx}: ${info.width}x${info.height}, ${info.channels} channels, ${data.length} bytes`);
        return data;
      })
    );

    // Combinar usando suma aditiva (clamped a 255)
    const combinedBuffer = Buffer.alloc(width * height * 3);
    let maxSum = 0;
    let minSum = Infinity;
    
    for (let i = 0; i < width * height * 3; i++) {
      let sum = 0;
      for (const channelBuffer of channelBuffers) {
        if (i < channelBuffer.length) {
          sum += channelBuffer[i];
        }
      }
      maxSum = Math.max(maxSum, sum);
      minSum = Math.min(minSum, sum);
      // Clamp a 255
      combinedBuffer[i] = Math.min(255, sum);
    }

    console.log(`Combined channels: min sum=${minSum}, max sum=${maxSum}, clamped to 0-255`);

    return await sharp(combinedBuffer, {
      raw: {
        width,
        height,
        channels: 3
      }
    }).png().toBuffer();
  }

  /**
   * Procesa imagen multicanal con ajustes independientes por canal y análisis cuantitativo
   * adjustments: [{ channel: 0, colorId: 2, contrast: 100, enabled: true }]
   */
  async combineChannels(imageBuffer, adjustments) {
    const activeAdjustments = adjustments.filter(adj => adj.enabled);

    if (activeAdjustments.length === 0) {
      return await sharp(imageBuffer).png().toBuffer();
    }

    console.log(`Processing ${activeAdjustments.length} active channels`);

    // Detectar número de canales
    const numChannels = await this.detectChannels(imageBuffer);
    console.log(`Image has ${numChannels} channels`);

    // Análisis cuantitativo avanzado
    const quantitativeAnalysis = await this.performQuantitativeAnalysis(imageBuffer, activeAdjustments);

    // Si la imagen es de un solo canal (grayscale), procesar múltiples colores como overlay
    if (numChannels === 1) {
      console.log(`Image is grayscale (1 channel). Processing ${activeAdjustments.length} color overlays.`);
      
      const { data, info } = await sharp(imageBuffer)
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Si solo hay un ajuste activo, aplicar directamente
      if (activeAdjustments.length === 1) {
        const adjustment = activeAdjustments[0];
        const color = this.colorMap[adjustment.colorId] || this.colorMap[2];
        const result = await this.applyColormapToChannel(
          data,
          info.width,
          info.height,
          color,
          adjustment.contrast
        );
        result.quantitativeData = quantitativeAnalysis;
        return result;
      }

      // Si hay múltiples colores activos, combinarlos como overlay
      // Cada color se aplica con diferente intensidad/opacidad
      const coloredLayers = [];
      
      for (const adjustment of activeAdjustments) {
        const color = this.colorMap[adjustment.colorId] || this.colorMap[2];
        console.log(`Applying color ${color.name} to grayscale image with contrast ${adjustment.contrast}%`);
        
        // Aplicar color con opacidad basada en el orden (primer color más opaco)
        const coloredLayer = await this.applyColormapToChannel(
          data,
          info.width,
          info.height,
          color,
          adjustment.contrast
        );
        
        coloredLayers.push(coloredLayer);
      }

      // Combinar múltiples colores usando blend mode screen (mejor para overlays)
      if (coloredLayers.length === 1) {
        const result = coloredLayers[0];
        result.quantitativeData = quantitativeAnalysis;
        return result;
      }

      // Combinar múltiples capas de color
      console.log(`Combining ${coloredLayers.length} color layers for grayscale image`);
      const combined = await this.combineColorLayers(coloredLayers, info.width, info.height);
      combined.quantitativeData = quantitativeAnalysis;
      return combined;
    }

    // Para imágenes multicanal, procesar cada canal independientemente
    const coloredChannels = [];
    const channelAnalysis = [];

    for (const adjustment of activeAdjustments) {
      const channelIndex = adjustment.channel !== undefined ? adjustment.channel : 0;

      console.log(`Processing adjustment: colorId=${adjustment.colorId}, channel=${channelIndex}, enabled=${adjustment.enabled}, contrast=${adjustment.contrast}`);

      // Validar que el canal existe
      if (channelIndex >= numChannels) {
        console.warn(`Channel ${channelIndex} does not exist (image has ${numChannels} channels), skipping`);
        continue;
      }

      // Extraer canal
      const { data, width, height } = await this.extractChannel(imageBuffer, channelIndex);
      console.log(`Extracted channel ${channelIndex}, dimensions: ${width}x${height}`);

      // Detectar tipo de fluoróforo automáticamente
      const fluorophoreDetection = await this.detectFluorophoreType(data, width, height);

      // Aplicar color
      const color = this.colorMap[adjustment.colorId] || this.colorMap[2];
      console.log(`Applying color ${color.name} (RGB: ${color.r}, ${color.g}, ${color.b}) to channel ${channelIndex}`);
      
      const coloredChannel = await this.applyColormapToChannel(
        data,
        width,
        height,
        color,
        adjustment.contrast
      );

      coloredChannels.push(coloredChannel);
      console.log(`Colored channel ${channelIndex} added to stack (${coloredChannels.length} total)`);

      // Recopilar análisis por canal
      channelAnalysis.push({
        channelIndex,
        fluorophore: fluorophoreDetection,
        statistics: this.calculateChannelStatistics(data, width, height),
        colorApplied: color.name
      });
    }

    console.log(`Total colored channels to combine: ${coloredChannels.length}`);

    // Combinar canales usando blend aditivo
    const finalImage = await this.combineChannelsAdditive(coloredChannels);

    // Agregar análisis completo
    finalImage.quantitativeData = {
      ...quantitativeAnalysis,
      channels: channelAnalysis,
      totalActiveChannels: activeAdjustments.length
    };

    return finalImage;
  }

  /**
   * Realiza análisis cuantitativo profesional completo
   */
  async performQuantitativeAnalysis(imageBuffer, adjustments) {
    const numChannels = await this.detectChannels(imageBuffer);
    const analysis = {
      imageMetadata: {},
      channelCorrelations: [],
      cellularMetrics: {},
      qualityMetrics: {}
    };

    // Extraer datos de todos los canales activos para análisis
    const channelData = [];
    for (const adjustment of adjustments.filter(adj => adj.enabled)) {
      if (adjustment.channel < numChannels) {
        const { data, width, height } = await this.extractChannel(imageBuffer, adjustment.channel);
        channelData.push({
          index: adjustment.channel,
          data,
          width,
          height,
          colorId: adjustment.colorId
        });
      }
    }

    // Calcular correlaciones entre canales (análisis de colocalización)
    for (let i = 0; i < channelData.length; i++) {
      for (let j = i + 1; j < channelData.length; j++) {
        const correlation = this.calculatePearsonCorrelation(
          channelData[i].data,
          channelData[j].data
        );

        analysis.channelCorrelations.push({
          channel1: channelData[i].index,
          channel2: channelData[j].index,
          pearsonCorrelation: correlation,
          interpretation: this.interpretCorrelation(correlation)
        });
      }
    }

    // Calcular métricas celulares básicas
    analysis.cellularMetrics = {
      totalCells: await this.estimateCellCount(imageBuffer),
      meanIntensity: channelData.reduce((sum, ch) => {
        const stats = this.calculateChannelStatistics(ch.data, ch.width, ch.height);
        return sum + stats.mean;
      }, 0) / channelData.length,
      signalToNoiseRatio: channelData.map(ch => {
        const stats = this.calculateChannelStatistics(ch.data, ch.width, ch.height);
        return stats.signalToNoise;
      })
    };

    // Métricas de calidad de imagen
    analysis.qualityMetrics = {
      focusQuality: await this.assessFocusQuality(imageBuffer),
      backgroundUniformity: await this.assessBackgroundUniformity(imageBuffer),
      signalUniformity: channelData.map(ch => {
        const stats = this.calculateChannelStatistics(ch.data, ch.width, ch.height);
        return stats.coefficientOfVariation;
      })
    };

    return analysis;
  }

  /**
   * Interpreta el coeficiente de correlación de Pearson para biología
   */
  interpretCorrelation(correlation) {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.8) return 'Strong colocalization';
    if (absCorr > 0.6) return 'Moderate colocalization';
    if (absCorr > 0.3) return 'Weak colocalization';
    return 'No significant colocalization';
  }

  /**
   * Estimación básica del número de células (simplificada)
   */
  async estimateCellCount(imageBuffer) {
    // Esta es una implementación simplificada
    // En producción usarías algoritmos de segmentación avanzados
    const metadata = await sharp(imageBuffer).metadata();
    const estimatedCellDensity = 0.01; // células por píxel (muy aproximado)
    return Math.round(metadata.width * metadata.height * estimatedCellDensity);
  }

  /**
   * Evalúa la calidad de foco de la imagen
   */
  async assessFocusQuality(imageBuffer) {
    // Implementación simplificada de evaluación de foco
    // En producción usarías algoritmos de sharpness assessment
    const { data } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calcular varianza de Laplaciano como métrica de foco
    let laplacianVariance = 0;
    const width = data.length / data.length; // aproximación simplificada

    // Esta es una implementación muy básica - en producción sería más sofisticada
    for (let i = 1; i < data.length - 1; i++) {
      const diff = data[i + 1] - data[i - 1];
      laplacianVariance += diff * diff;
    }

    const focusScore = laplacianVariance / data.length;

    if (focusScore > 1000) return 'Excellent focus';
    if (focusScore > 500) return 'Good focus';
    if (focusScore > 100) return 'Moderate focus';
    return 'Poor focus';
  }

  /**
   * Evalúa la uniformidad del fondo
   */
  async assessBackgroundUniformity(imageBuffer) {
    // Implementación simplificada
    const { data } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calcular coeficiente de variación del fondo
    const backgroundSamples = [];
    const step = Math.floor(data.length / 100); // muestrear 100 puntos

    for (let i = 0; i < data.length; i += step) {
      backgroundSamples.push(data[i]);
    }

    const mean = backgroundSamples.reduce((a, b) => a + b) / backgroundSamples.length;
    const variance = backgroundSamples.reduce((a, b) => a + (b - mean) ** 2, 0) / backgroundSamples.length;
    const cv = Math.sqrt(variance) / (mean + 0.001);

    if (cv < 0.1) return 'Excellent uniformity';
    if (cv < 0.2) return 'Good uniformity';
    if (cv < 0.3) return 'Moderate uniformity';
    return 'Poor uniformity';
  }

  /**
   * Segmentación celular básica usando threshold
   * En producción usarías modelos de ML (U-Net, Mask R-CNN, etc.)
   */
  async performBasicSegmentation(imageBuffer, method = 'threshold', options = {}) {
    const { threshold = 128, minSize = 50 } = options;

    console.log(`Performing ${method} segmentation with threshold=${threshold}`);

    // Convertir a grayscale
    const { data, info } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Aplicar threshold
    const segmentedData = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      segmentedData[i] = data[i] > threshold ? 255 : 0;
    }

    // Aplicar operaciones morfológicas básicas (opening/closing)
    // Esto ayuda a eliminar ruido y conectar regiones
    const cleanedData = this.morphologicalOpening(segmentedData, info.width, info.height, 3);

    // Crear imagen RGB con overlay de segmentación
    const rgbBuffer = Buffer.alloc(cleanedData.length * 3);
    for (let i = 0; i < cleanedData.length; i++) {
      if (cleanedData[i] > 0) {
        // Regiones segmentadas en verde (puede personalizarse)
        rgbBuffer[i * 3] = 0;     // R
        rgbBuffer[i * 3 + 1] = 255; // G
        rgbBuffer[i * 3 + 2] = 0;   // B
      } else {
        // Fondo en escala de grises
        rgbBuffer[i * 3] = data[i];
        rgbBuffer[i * 3 + 1] = data[i];
        rgbBuffer[i * 3 + 2] = data[i];
      }
    }

    return await sharp(rgbBuffer, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 3
      }
    }).png().toBuffer();
  }

  /**
   * Operación morfológica de opening (erosion seguida de dilation)
   */
  morphologicalOpening(data, width, height, kernelSize) {
    // Erosion
    const eroded = this.erode(data, width, height, kernelSize);
    // Dilation
    return this.dilate(eroded, width, height, kernelSize);
  }

  /**
   * Erosión morfológica básica
   */
  erode(data, width, height, kernelSize) {
    const result = Buffer.from(data);
    const halfKernel = Math.floor(kernelSize / 2);

    for (let y = halfKernel; y < height - halfKernel; y++) {
      for (let x = halfKernel; x < width - halfKernel; x++) {
        let minVal = 255;
        for (let ky = -halfKernel; ky <= halfKernel; ky++) {
          for (let kx = -halfKernel; kx <= halfKernel; kx++) {
            const idx = (y + ky) * width + (x + kx);
            minVal = Math.min(minVal, data[idx]);
          }
        }
        result[y * width + x] = minVal;
      }
    }
    return result;
  }

  /**
   * Dilatación morfológica básica
   */
  dilate(data, width, height, kernelSize) {
    const result = Buffer.from(data);
    const halfKernel = Math.floor(kernelSize / 2);

    for (let y = halfKernel; y < height - halfKernel; y++) {
      for (let x = halfKernel; x < width - halfKernel; x++) {
        let maxVal = 0;
        for (let ky = -halfKernel; ky <= halfKernel; ky++) {
          for (let kx = -halfKernel; kx <= halfKernel; kx++) {
            const idx = (y + ky) * width + (x + kx);
            maxVal = Math.max(maxVal, data[idx]);
          }
        }
        result[y * width + x] = maxVal;
      }
    }
    return result;
  }

  /**
   * Procesa imagen según modo de visualización (legacy)
   */
  async processImage(imageBuffer, options = {}) {
    const {
      mode = 'fluorescent',
      colorId = 2,
      contrast = 1.0,
    } = options;
    
    if (mode !== 'fluorescent') {
      console.warn(`Mode ${mode} not fully implemented, using fluorescent`);
    }

    const color = this.colorMap[colorId] || this.colorMap[2];
    const { data, info } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    return await this.applyColormapToChannel(
      data,
      info.width,
      info.height,
      color,
      contrast * 100
    );
  }
}

