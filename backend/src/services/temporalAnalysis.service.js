import sharp from 'sharp';

/**
 * TemporalAnalysisService - Servicio para análisis de series temporales
 * Soporta time-lapse, tracking de células, y análisis de dinámica celular
 */
export class TemporalAnalysisService {
  constructor() {
    this.trackingAlgorithms = {
      nearestNeighbor: 'nearest-neighbor',
      kalman: 'kalman-filter',
      hungarian: 'hungarian-algorithm',
    };
  }

  /**
   * Analiza una serie temporal de imágenes
   * @param {Array<Buffer>} imageSequence - Secuencia de imágenes en orden temporal
   * @param {Object} options - Opciones de análisis
   */
  async analyzeTimeSeries(imageSequence, options = {}) {
    const {
      trackingMethod = 'nearest-neighbor',
      maxDistance = 50,
      minTrackLength = 3,
    } = options;

    console.log(`Analyzing time series with ${imageSequence.length} frames`);

    // Detectar objetos en cada frame
    const detections = await Promise.all(
      imageSequence.map((frame, index) =>
        this.detectObjectsInFrame(frame, index)
      )
    );

    // Realizar tracking entre frames
    const tracks = await this.trackObjects(detections, {
      method: trackingMethod,
      maxDistance,
      minTrackLength,
    });

    // Calcular métricas temporales
    const metrics = this.calculateTemporalMetrics(tracks);

    return {
      totalFrames: imageSequence.length,
      totalTracks: tracks.length,
      detections,
      tracks,
      metrics,
    };
  }

  /**
   * Detecta objetos (células) en un frame individual
   */
  async detectObjectsInFrame(frameBuffer, frameIndex) {
    const { data, info } = await sharp(frameBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Detección básica usando threshold y connected components
    const objects = await this.findConnectedComponents(data, info.width, info.height);

    return {
      frameIndex,
      timestamp: frameIndex, // En producción usarías timestamps reales
      objects: objects.map((obj, idx) => ({
        id: `${frameIndex}_${idx}`,
        centroid: obj.centroid,
        area: obj.area,
        boundingBox: obj.bbox,
        intensity: obj.meanIntensity,
      })),
    };
  }

  /**
   * Encuentra componentes conectados (células) en la imagen
   */
  async findConnectedComponents(data, width, height) {
    const visited = new Set();
    const objects = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (data[idx] > 128 && !visited.has(idx)) {
          // Encontrar componente conectado usando flood fill
          const component = this.floodFill(data, width, height, x, y, visited);
          if (component.pixels.length > 50) {
            // Filtrar objetos muy pequeños (ruido)
            objects.push(component);
          }
        }
      }
    }

    return objects;
  }

  /**
   * Flood fill para encontrar componentes conectados
   */
  floodFill(data, width, height, startX, startY, visited) {
    const pixels = [];
    const stack = [[startX, startY]];
    let sumX = 0, sumY = 0, sumIntensity = 0;
    let minX = startX, maxX = startX, minY = startY, maxY = startY;

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const idx = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height || visited.has(idx) || data[idx] <= 128) {
        continue;
      }

      visited.add(idx);
      pixels.push([x, y]);
      sumX += x;
      sumY += y;
      sumIntensity += data[idx];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      // Agregar vecinos
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    return {
      pixels,
      centroid: { x: sumX / pixels.length, y: sumY / pixels.length },
      area: pixels.length,
      bbox: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
      meanIntensity: sumIntensity / pixels.length,
    };
  }

  /**
   * Realiza tracking de objetos entre frames
   */
  async trackObjects(detections, options) {
    const { method, maxDistance, minTrackLength } = options;
    const tracks = [];

    if (method === 'nearest-neighbor') {
      return this.nearestNeighborTracking(detections, maxDistance, minTrackLength);
    }

    // Por defecto usar nearest neighbor
    return this.nearestNeighborTracking(detections, maxDistance, minTrackLength);
  }

  /**
   * Tracking usando algoritmo de vecino más cercano
   */
  nearestNeighborTracking(detections, maxDistance, minTrackLength) {
    const tracks = [];

    // Inicializar tracks con el primer frame
    detections[0]?.objects.forEach((obj) => {
      tracks.push({
        id: `track_${tracks.length}`,
        frames: [0],
        positions: [obj.centroid],
        areas: [obj.area],
        intensities: [obj.intensity],
      });
    });

    // Para cada frame subsiguiente, asociar objetos a tracks existentes
    for (let frameIdx = 1; frameIdx < detections.length; frameIdx++) {
      const currentObjects = detections[frameIdx].objects;
      const usedObjects = new Set();

      // Intentar asociar cada track con el objeto más cercano
      tracks.forEach((track) => {
        const lastPos = track.positions[track.positions.length - 1];
        let bestMatch = null;
        let bestDistance = Infinity;

        currentObjects.forEach((obj, objIdx) => {
          if (usedObjects.has(objIdx)) return;

          const distance = Math.sqrt(
            Math.pow(obj.centroid.x - lastPos.x, 2) +
            Math.pow(obj.centroid.y - lastPos.y, 2)
          );

          if (distance < bestDistance && distance <= maxDistance) {
            bestDistance = distance;
            bestMatch = { obj, idx: objIdx };
          }
        });

        if (bestMatch) {
          track.frames.push(frameIdx);
          track.positions.push(bestMatch.obj.centroid);
          track.areas.push(bestMatch.obj.area);
          track.intensities.push(bestMatch.obj.intensity);
          usedObjects.add(bestMatch.idx);
        }
      });

      // Crear nuevos tracks para objetos no asociados
      currentObjects.forEach((obj, objIdx) => {
        if (!usedObjects.has(objIdx)) {
          tracks.push({
            id: `track_${tracks.length}`,
            frames: [frameIdx],
            positions: [obj.centroid],
            areas: [obj.area],
            intensities: [obj.intensity],
          });
        }
      });
    }

    // Filtrar tracks muy cortos
    return tracks.filter((track) => track.frames.length >= minTrackLength);
  }

  /**
   * Calcula métricas temporales de los tracks
   */
  calculateTemporalMetrics(tracks) {
    const metrics = {
      totalTracks: tracks.length,
      averageTrackLength: 0,
      averageSpeed: [],
      averageDisplacement: [],
      divisionEvents: 0,
      deathEvents: 0,
    };

    if (tracks.length === 0) return metrics;

    let totalLength = 0;
    tracks.forEach((track) => {
      totalLength += track.frames.length;

      // Calcular velocidad promedio
      if (track.positions.length > 1) {
        let totalDistance = 0;
        for (let i = 1; i < track.positions.length; i++) {
          const dx = track.positions[i].x - track.positions[i - 1].x;
          const dy = track.positions[i].y - track.positions[i - 1].y;
          totalDistance += Math.sqrt(dx * dx + dy * dy);
        }
        metrics.averageSpeed.push(totalDistance / (track.frames.length - 1));
      }

      // Calcular desplazamiento total
      if (track.positions.length > 1) {
        const first = track.positions[0];
        const last = track.positions[track.positions.length - 1];
        const displacement = Math.sqrt(
          Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2)
        );
        metrics.averageDisplacement.push(displacement);
      }

      // Detectar eventos de división (simplificado - área aumenta significativamente)
      if (track.areas.length > 1) {
        for (let i = 1; i < track.areas.length; i++) {
          if (track.areas[i] > track.areas[i - 1] * 1.5) {
            metrics.divisionEvents++;
            break;
          }
        }
      }
    });

    metrics.averageTrackLength = totalLength / tracks.length;
    metrics.averageSpeed = metrics.averageSpeed.length > 0
      ? metrics.averageSpeed.reduce((a, b) => a + b, 0) / metrics.averageSpeed.length
      : 0;
    metrics.averageDisplacement = metrics.averageDisplacement.length > 0
      ? metrics.averageDisplacement.reduce((a, b) => a + b, 0) / metrics.averageDisplacement.length
      : 0;

    return metrics;
  }
}

