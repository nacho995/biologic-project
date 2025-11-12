# 🔬 Biological Image Analysis Platform

Sistema profesional de análisis y visualización de imágenes biológicas para laboratorios de investigación. Plataforma enterprise-grade con capacidades avanzadas de procesamiento multicanal, análisis cuantitativo, segmentación con IA, y generación de reportes científicos.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Instalación y Uso](#-instalación-y-uso)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [API Documentation](#-api-documentation)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración](#-configuración)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## 🚀 Características Principales

### 🎨 Visualización Multicanal Profesional

- **Detección automática de canales**: RGB, Fluorescencia (DAPI, GFP, RFP, CFP, YFP, etc.)
- **Asignación de colores por canal**: Cada color se puede asignar a un canal específico
- **Combinación aditiva normalizada**: Suma de canales dividida por número de imágenes activas
- **Filtrado de píxeles negros**: Los píxeles negros (valor 0) no contribuyen a la suma
- **Normalización inteligente**: Si hay 2 imágenes activas, suma y divide por 2; si hay 3, divide por 3
- **Manejo de negro**: Si todas las imágenes tienen negro en un píxel, el resultado es 0
- **12 colores profesionales**: DAPI, FITC/GFP, Texas Red/PE, Cy5, YFP, y más
- **Ajuste de contraste independiente**: Por color/canal (50-150%)

### 📊 Análisis Cuantitativo Avanzado

- **Estadísticas por canal**: Media, desviación estándar, S/N ratio, rango dinámico
- **Análisis de colocalización**: Coeficiente de Pearson entre canales
- **Métricas celulares**: Conteo estimado, intensidad media, área cubierta
- **Calidad de imagen**: Evaluación de foco, uniformidad de fondo
- **Dashboard analítico**: Visualización en tiempo real de todas las métricas

### 🤖 Segmentación con Machine Learning

- **Múltiples modelos**: CellPose, StarDist, U-Net, Mask R-CNN
- **Métricas por célula**: Área, perímetro, circularidad, intensidad, aspect ratio
- **Máscaras de visualización**: Overlay de segmentación con colores únicos
- **Exportación de resultados**: Máscaras PNG y métricas JSON

### 📈 Análisis Estadístico

- **T-tests**: Independent, paired, Welch, one-sample
- **ANOVA**: One-way, two-way
- **Correlaciones**: Pearson y Spearman
- **Effect sizes**: Cohen's d, eta-squared
- **Visualizaciones científicas**: Box plots, scatter plots, heatmaps

### ⏱️ Tracking Temporal

- **Series temporales**: Análisis de time-lapse
- **Tracking de células**: Nearest-neighbor algorithm
- **Métricas temporales**: Velocidad, desplazamiento, persistencia
- **Detección de eventos**: Divisiones celulares, muerte celular
- **Timeline player**: Reproducción con controles interactivos

### 📄 Generación de Reportes PDF

- **Reportes científicos**: Formato profesional para publicaciones
- **Secciones configurables**: Portada, resumen, metodología, resultados, estadísticas
- **Inclusión automática**: Métricas, gráficos, tablas
- **Exportación múltiple**: PDF, HTML, DOCX, LaTeX

### 🖼️ Gestión de Imágenes

- **Upload masivo**: Múltiples formatos (TIFF, PNG, JPEG)
- **Metadatos CSV**: Asociación de imágenes con condiciones experimentales
- **Thumbnails automáticos**: Para navegación rápida
- **Visualización interactiva**: Zoom, pan, rotación
- **Composiciones**: Superposición de múltiples imágenes con blend modes

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI framework
- **Material-UI (MUI)** - Componentes profesionales
- **Zustand** - State management
- **Konva.js** - Canvas interactivo
- **Vite** - Build tool rápido
- **Three.js** (opcional) - Visualización 3D
- **jsPDF** - Generación de PDFs

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **PostgreSQL 15** - Base de datos
- **Sequelize** - ORM
- **Sharp** - Procesamiento de imágenes (GPU-accelerated)
- **Multer** - File uploads

### Infrastructure
- **Docker & Docker Compose** - Containerización
- **Nginx** - Reverse proxy
- **PostgreSQL** - Base de datos persistente

---

## 🚀 Instalación y Uso

### Requisitos Previos

- Docker & Docker Compose
- Node.js 18+ (para desarrollo local)
- PostgreSQL 15+ (o usar Docker)

### Quick Start con Docker

```bash
# Clonar el repositorio
git clone <repository-url>
cd biologic-project

# Iniciar todos los servicios
docker compose up --build

# La aplicación estará disponible en:
# Frontend: http://localhost:59424
# Backend API: http://localhost:5000
```

### Desarrollo Local

#### Backend
```bash
cd backend
npm install
npm run dev  # Servidor en http://localhost:5000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev  # Servidor en http://localhost:5173
```

---

## 📖 Funcionalidades Detalladas

### 1. Sistema de Canales y Colores

#### Para Imágenes Multicanal (RGB, 3+ canales)
- Cada color se asigna a un canal específico (Ch 0, Ch 1, Ch 2, etc.)
- Los canales se procesan independientemente
- **Combinación normalizada**: Suma de canales dividida por número de imágenes activas
- **Filtrado de negro**: Píxeles negros (valor 0) no contribuyen a la suma
- **Ejemplo**: 2 imágenes activas → suma/2; 3 imágenes → suma/3
- **Negro preservado**: Si todas las imágenes tienen negro en un píxel, resultado = 0
- Resultado: Visualización tipo ImageJ/FIJI con normalización

#### Para Imágenes Grayscale (1 canal)
- Múltiples colores se combinan como overlays
- **Combinación normalizada**: Suma de colores dividida por número de colores activos
- **Filtrado de negro**: Píxeles negros (valor 0) no contribuyen a la suma
- Todos los colores se aplican a la misma imagen base

#### Paleta de Colores (12 colores)
1. **DAPI** (Blue) - Marca ADN nuclear
2. **FITC/GFP** (Green) - Green Fluorescent Protein
3. **Texas Red/PE** (Red) - Phycoerythrin
4. **CFP** (Cyan) - Cyan Fluorescent Protein
5. **Cy5/Far-Red** (Magenta) - Cianina 5
6. **YFP** (Yellow) - Yellow Fluorescent Protein
7. **Orange** - RFP variants
8. **APC** (Purple) - Allophycocyanin
9. **PerCP** (Pink) - Peridinin-chlorophyll-protein
10. **PE-Cy7** (Lime) - PE-Cyanine7 tandem
11. **APC-Cy7** (Teal) - APC-Cyanine7 tandem
12. **BV421** (Indigo) - Brilliant Violet 421

### 2. Análisis Cuantitativo

El sistema calcula automáticamente:

- **Por Canal**:
  - Intensidad media y desviación estándar
  - Signal-to-Noise ratio
  - Rango dinámico
  - Coeficiente de variación
  - Detección automática de fluoróforo

- **Colocalización**:
  - Coeficiente de Pearson entre canales
  - Interpretación automática (Strong/Moderate/Weak)

- **Calidad de Imagen**:
  - Evaluación de foco (Excellent/Good/Moderate/Poor)
  - Uniformidad de fondo
  - Uniformidad de señal

- **Métricas Celulares**:
  - Conteo estimado de células
  - Intensidad media global
  - Signal-to-Noise por canal

### 3. Segmentación ML

#### Modelos Disponibles
- **CellPose**: Segmentación universal sin entrenamiento
- **StarDist**: Segmentación de núcleos con forma estelar
- **U-Net**: Modelo pre-entrenado para células específicas
- **Mask R-CNN**: Detección y segmentación de instancias

#### Métricas por Célula
- Área (píxeles)
- Perímetro
- Circularidad
- Intensidad media
- Aspect ratio
- Solidity
- Extent
- Momentos de imagen (Hu moments)

### 4. Análisis Estadístico

#### Tests Disponibles
- **T-tests**: Independent, paired, Welch, one-sample
- **ANOVA**: One-way, two-way
- **Correlaciones**: Pearson, Spearman
- **Non-parametric**: Mann-Whitney, Kruskal-Wallis

#### Visualizaciones
- Box plots con significancia
- Scatter plots con regresión
- Heatmaps de correlación
- Survival curves
- Forest plots

### 5. Tracking Temporal

- **Detección de objetos**: Por frame usando connected components
- **Tracking**: Nearest-neighbor algorithm
- **Métricas**:
  - Velocidad instantánea y promedio
  - Distancia total recorrida
  - Persistencia temporal
  - Detección de divisiones
  - Detección de muerte celular

### 6. Visualización 3D (Básica)

- Renderizado volumétrico básico
- Controles de opacidad
- Modos de visualización (Volume, MIP, Surface)
- Timeline player para series temporales

**Nota**: Requiere instalación de Three.js:
```bash
cd frontend
npm install three @react-three/fiber @react-three/drei
```

### 7. Generación de Reportes

- **Secciones**:
  - Portada con logo
  - Resumen ejecutivo
  - Metodología
  - Resultados con imágenes
  - Análisis estadístico
  - Apéndices

- **Formatos**: PDF, HTML, DOCX, LaTeX

---

## 📡 API Documentation

### Endpoints Principales

#### Upload
```
POST /api/upload/images      - Subir imágenes (múltiples)
POST /api/csv-uploads        - Subir CSV con metadatos (CRUD completo)
```

#### Imágenes
```
GET  /api/images                    - Listar todas las imágenes
GET  /api/images/:id                - Obtener imagen
GET  /api/images/:id/thumbnail      - Obtener thumbnail
GET  /api/images/:id/details        - Detalles completos
GET  /api/images/:id/slices         - Slice multi-dimensional
POST /api/images/:id/color-adjust   - Ajustar colores/canales
GET  /api/images/:id/quantitative-analysis  - Análisis cuantitativo
POST /api/images/:id/segment        - Segmentación ML
POST /api/images/:id/export/ome-tiff - Exportar a OME-TIFF
POST /api/images/:id/export/hdf5     - Exportar a HDF5
PUT  /api/images/:id                - Actualizar imagen
DELETE /api/images/:id               - Borrar imagen
```

#### ML Segmentation
```
GET  /api/ml/models                  - Modelos disponibles
POST /api/ml/segment/:id            - Realizar segmentación
GET  /api/ml/segment/:id/metrics    - Métricas de segmentación
```

#### Procesamiento de Imágenes
```
POST /api/image/process              - Procesar con contraste/brillo
GET  /api/image/:id/histogram        - Histograma de píxeles
```

#### CSVs
```
GET    /api/csv-uploads               - Listar CSVs
GET    /api/csv-uploads/:id          - Obtener CSV
POST   /api/csv-uploads               - Crear CSV
PUT    /api/csv-uploads/:id          - Actualizar CSV
DELETE /api/csv-uploads/:id          - Borrar CSV
```

#### Composiciones
```
GET    /api/compositions              - Listar composiciones
GET    /api/compositions/:id         - Obtener composición
POST   /api/compositions              - Crear composición
PUT    /api/compositions/:id         - Actualizar composición
DELETE /api/compositions/:id         - Borrar composición
```

#### Metadatos
```
GET /api/metadata                    - Todos los metadatos
GET /api/metadata/:imageId           - Metadatos de imagen
```

### Ejemplo de Uso: Ajustar Colores

```javascript
// Frontend
import { adjustImageColor } from './services/api';

const adjustments = [
  {
    colorId: 2,        // Green
    channel: 0,         // Canal 0
    contrast: 100,      // 100%
    enabled: true
  },
  {
    colorId: 3,        // Red
    channel: 1,         // Canal 1
    contrast: 120,      // 120%
    enabled: true
  }
];

const blob = await adjustImageColor(imageId, adjustments);
const imageUrl = URL.createObjectURL(blob);
```

---

## 📁 Estructura del Proyecto

```
biologic-project/
├── backend/
│   ├── src/
│   │   ├── config/              # Configuración (DB, etc.)
│   │   ├── controllers/         # Controladores de rutas
│   │   │   ├── image.controller.js
│   │   │   ├── imageProcess.controller.js
│   │   │   ├── mlSegmentation.controller.js
│   │   │   ├── upload.controller.js
│   │   │   └── ...
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── colorMapping.service.js      # Procesamiento multicanal
│   │   │   ├── mlSegmentation.service.js   # Segmentación ML
│   │   │   ├── statisticalAnalysis.service.js  # Análisis estadístico
│   │   │   ├── temporalAnalysis.service.js     # Tracking temporal
│   │   │   ├── imageProcessor.service.js
│   │   │   └── ...
│   │   ├── models/              # Modelos Sequelize
│   │   ├── routes/              # Definición de rutas
│   │   ├── middleware/          # Middleware Express
│   │   └── server.js            # Entry point
│   ├── uploads/                 # Archivos subidos
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── ColorControlPanel/    # Control de colores
│   │   │   ├── SegmentationPanel/    # Segmentación ML
│   │   │   ├── AnalyticsDashboard/   # Dashboard analítico
│   │   │   ├── StatisticalAnalysis/   # Análisis estadístico
│   │   │   ├── TemporalTracking/     # Tracking temporal
│   │   │   ├── VolumetricViewer3D/   # Visualización 3D
│   │   │   ├── ReportGenerator/      # Generación de reportes
│   │   │   └── ...
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useColorAdjustment.js
│   │   │   ├── useImageLoader.js
│   │   │   └── ...
│   │   ├── store/               # Zustand stores
│   │   │   ├── colorStore.js
│   │   │   ├── imageStore.js
│   │   │   └── ...
│   │   ├── services/            # API client
│   │   │   └── api.js
│   │   └── App.jsx              # Componente principal
│   └── package.json
│
├── docker-compose.yml           # Orquestación Docker
├── Dockerfile.backend           # Dockerfile backend
├── Dockerfile.frontend          # Dockerfile frontend
├── nginx.conf                   # Configuración Nginx
└── README.md                    # Este archivo
```

---

## ⚙️ Configuración

### Variables de Entorno (Backend)

Crea `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=biologic_db
DB_USER=postgres
DB_PASSWORD=postgres

# File Upload
MAX_FILE_SIZE=104857600  # 100MB
```

### Variables de Entorno (Frontend)

Crea `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Docker Compose (Recomendado)

```bash
docker compose up --build -d
```

### Producción con Docker

1. Configurar variables de entorno
2. Ajustar `docker-compose.yml` para producción
3. Configurar SSL/HTTPS en Nginx
4. Configurar backups de PostgreSQL

### CI/CD

El proyecto está preparado para:
- GitHub Actions
- GitLab CI
- Jenkins
- Cualquier sistema CI/CD moderno

---

## 📝 Formato de CSV

El CSV debe contener al menos la columna `image_path`:

```csv
image_path,x,y,z,well_id,condition,timestamp,channel_1,channel_2,channel_3
images/cell_001.tif,100,200,50,A1,control,2024-01-01,true,false,true
images/cell_002.tif,150,250,60,A2,treatment,2024-01-01,true,true,false
```

**Columnas requeridas**:
- `image_path` (obligatoria): Ruta o nombre del archivo

**Columnas opcionales**:
- `x`, `y`, `z`: Coordenadas espaciales
- `well_id`: Identificador de pocillo (A1, B2, etc.)
- `condition`: Condición experimental
- `timestamp`: Fecha/hora
- `channel_1`, `channel_2`, `channel_3`: Canales activos (true/false)

---

## 🎯 Casos de Uso

### 1. Análisis de Inmunofluorescencia
- Cargar imágenes multicanal (DAPI, GFP, RFP)
- Asignar colores a cada canal
- Analizar colocalización
- Generar reporte PDF

### 2. Segmentación Celular
- Seleccionar modelo ML (CellPose)
- Segmentar células
- Exportar métricas por célula
- Visualizar máscaras de segmentación

### 3. Análisis Temporal
- Cargar serie temporal
- Realizar tracking de células
- Analizar velocidad y desplazamiento
- Detectar eventos (división, muerte)

### 4. Análisis Estadístico
- Seleccionar grupos experimentales
- Realizar t-test o ANOVA
- Visualizar resultados
- Exportar en formato APA

---

## 🔧 Troubleshooting

### Error: "Image has 1 channels" - Los canales no funcionan
**Solución**: Tu imagen es grayscale. Los canales solo funcionan con imágenes RGB o multicanal. Para grayscale, los colores se combinan como overlays.

### Error: "Cannot find module '@react-three/fiber'"
```bash
cd frontend && npm install three @react-three/fiber @react-three/drei
```

### Error: "Cannot find module 'jspdf'"
```bash
cd frontend && npm install jspdf html2canvas
```

### La imagen no se actualiza al cambiar colores
- Verifica los logs del backend
- Asegúrate de que la imagen tenga múltiples canales para usar el sistema de canales
- Para imágenes grayscale, activa múltiples colores sin cambiar canales

---

## 📚 Referencias

- [Bio-image Analysis Notebooks](https://biapol.github.io/blog/robert_haase/BioImageAnalysisNotebooks/)
- [Ultivue Spatial Analysis](https://ultivue.com/image-analysis/)
- [Napari Documentation](https://napari.org/stable/)
- [ImageJ/FIJI](https://imagej.net/software/fiji/)

---

## 📄 Licencia

MIT License

---

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🆘 Soporte

Para problemas o preguntas:
- Abre un issue en GitHub
- Revisa los logs del backend/frontend
- Consulta la documentación de API

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025
