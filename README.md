# 🔬 Biological Image Analysis Platform

[![CI/CD](https://github.com/yourusername/biologic-project/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/yourusername/biologic-project/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

[English](#english) | [Español](#español)

---

## English

### Overview

A powerful, enterprise-grade web platform for biological and microscopy image analysis. This system provides advanced tools for multi-channel visualization, quantitative analysis, ML-powered segmentation, and comprehensive reporting of TIFF microscopy images.

### ✨ Key Features

- **🖼️ Multi-Format Image Support**
  - TIFF format processing (including multi-dimensional stacks)
  - Multi-channel visualization with customizable color mapping
  - Z-stack navigation and 3D volume rendering

- **📊 Advanced Analysis**
  - Real-time quantitative metrics (intensity, area, SNR)
  - Channel colocalization analysis
  - Statistical analysis with distribution plots
  - Temporal tracking for time-series data

- **🤖 Machine Learning Integration**
  - Automated cell/structure segmentation
  - Customizable ML models
  - Batch processing capabilities

- **🎨 Professional Visualization**
  - Interactive canvas with zoom/pan controls
  - Multi-layer image composition with blend modes
  - Color channel adjustment and contrast enhancement
  - Responsive design (mobile, tablet, desktop)

- **📑 Reporting & Export**
  - PDF report generation with analysis results
  - Data export in multiple formats
  - Metadata extraction and display

### 🛠️ Technology Stack

**Frontend**
- React 18 with Hooks
- Material-UI (MUI) v5
- Zustand (state management)
- Konva.js (canvas manipulation)
- Three.js (3D visualization)
- Vite (build tool)

**Backend**
- Node.js 18
- Express.js
- Sequelize ORM
- PostgreSQL 15
- Sharp (image processing)
- Multer (file upload)

**DevOps**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

### 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- 4GB RAM minimum
- 10GB free disk space

### 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/biologic-project.git
   cd biologic-project
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start with Docker Compose**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

### 💻 Local Development

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Database**
```bash
docker compose up postgres -d
```

### 🏗️ Project Structure

```
biologic-project/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Express middleware
│   └── uploads/            # File storage
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API clients
│   │   ├── store/          # State management
│   │   └── theme/          # MUI theme
│   └── index.html
├── docker-compose.yml      # Service orchestration
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
└── README.md
```

### 📚 API Documentation

**Image Upload**
```bash
POST /api/upload
Content-Type: multipart/form-data
Body: { images: [File, File, ...] }
```

**Get All Images**
```bash
GET /api/images
Response: { data: [...], count: number }
```

**Image Processing**
```bash
POST /api/image/process
Body: { imageId: string, operations: [...] }
```

**Analytics**
```bash
GET /api/images/:id/quantitative
Response: { metrics: {...}, channels: [...] }
```

See [API.md](./API.md) for complete documentation.

### 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **On Pull Request**: Run tests and linting
- **On Push to Main**: Build, test, and deploy
- **On Tag**: Create release and publish Docker images

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

### 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 👥 Authors

- Your Name - [GitHub](https://github.com/yourusername)

### 🙏 Acknowledgments

- Built with React and Material-UI
- Powered by PostgreSQL
- Containerized with Docker

---

## Español

### Descripción General

Una plataforma web de nivel empresarial para el análisis de imágenes biológicas y de microscopía. Este sistema proporciona herramientas avanzadas para visualización multicanal, análisis cuantitativo, segmentación basada en ML y generación de informes completos de imágenes de microscopía TIFF.

### ✨ Características Principales

- **🖼️ Soporte Multi-Formato**
  - Procesamiento de formato TIFF (incluyendo stacks multidimensionales)
  - Visualización multicanal con mapeo de colores personalizable
  - Navegación de Z-stack y renderizado volumétrico 3D

- **📊 Análisis Avanzado**
  - Métricas cuantitativas en tiempo real (intensidad, área, SNR)
  - Análisis de colocalización de canales
  - Análisis estadístico con gráficos de distribución
  - Seguimiento temporal para datos de series temporales

- **🤖 Integración con Machine Learning**
  - Segmentación automática de células/estructuras
  - Modelos ML personalizables
  - Capacidad de procesamiento por lotes

- **🎨 Visualización Profesional**
  - Canvas interactivo con controles de zoom/pan
  - Composición de imágenes multicapa con modos de fusión
  - Ajuste de canales de color y mejora de contraste
  - Diseño responsive (móvil, tablet, escritorio)

- **📑 Reportes y Exportación**
  - Generación de informes PDF con resultados de análisis
  - Exportación de datos en múltiples formatos
  - Extracción y visualización de metadatos

### 🛠️ Stack Tecnológico

**Frontend**
- React 18 con Hooks
- Material-UI (MUI) v5
- Zustand (gestión de estado)
- Konva.js (manipulación de canvas)
- Three.js (visualización 3D)
- Vite (herramienta de compilación)

**Backend**
- Node.js 18
- Express.js
- Sequelize ORM
- PostgreSQL 15
- Sharp (procesamiento de imágenes)
- Multer (carga de archivos)

**DevOps**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (proxy inverso)

### 📋 Requisitos Previos

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (para desarrollo local)
- 4GB RAM mínimo
- 10GB de espacio libre en disco

### 🚀 Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/yourusername/biologic-project.git
   cd biologic-project
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Iniciar con Docker Compose**
   ```bash
   docker compose up --build
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost
   - API Backend: http://localhost:5000
   - Health check: http://localhost:5000/health

### 💻 Desarrollo Local

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Base de Datos**
```bash
docker compose up postgres -d
```

### 🏗️ Estructura del Proyecto

```
biologic-project/
├── .github/
│   └── workflows/          # Pipelines CI/CD
├── backend/
│   ├── src/
│   │   ├── controllers/    # Manejadores de peticiones
│   │   ├── models/         # Modelos de base de datos
│   │   ├── routes/         # Rutas API
│   │   ├── services/       # Lógica de negocio
│   │   └── middleware/     # Middleware de Express
│   └── uploads/            # Almacenamiento de archivos
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── services/       # Clientes API
│   │   ├── store/          # Gestión de estado
│   │   └── theme/          # Tema MUI
│   └── index.html
├── docker-compose.yml      # Orquestación de servicios
├── Dockerfile.backend      # Contenedor backend
├── Dockerfile.frontend     # Contenedor frontend
└── README.md
```

### 📚 Documentación de la API

**Subir Imagen**
```bash
POST /api/upload
Content-Type: multipart/form-data
Body: { images: [File, File, ...] }
```

**Obtener Todas las Imágenes**
```bash
GET /api/images
Response: { data: [...], count: number }
```

**Procesar Imagen**
```bash
POST /api/image/process
Body: { imageId: string, operations: [...] }
```

**Analíticas**
```bash
GET /api/images/:id/quantitative
Response: { metrics: {...}, channels: [...] }
```

Ver [API.md](./API.md) para documentación completa.

### 🔄 Pipeline CI/CD

Este proyecto utiliza GitHub Actions para integración y despliegue continuo:

- **En Pull Request**: Ejecutar pruebas y linting
- **En Push a Main**: Construir, probar y desplegar
- **En Tag**: Crear release y publicar imágenes Docker

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones de despliegue.

### 🧪 Pruebas

```bash
# Pruebas backend
cd backend
npm test

# Pruebas frontend
cd frontend
npm test

# Pruebas E2E
npm run test:e2e
```

### 🤝 Contribuir

1. Hacer fork del repositorio
2. Crear tu rama de característica (`git checkout -b feature/CaracteristicaIncreible`)
3. Commit de tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abrir un Pull Request

### 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

### 👥 Autores

- Tu Nombre - [GitHub](https://github.com/yourusername)

### 🙏 Agradecimientos

- Construido con React y Material-UI
- Impulsado por PostgreSQL
- Contenerizado con Docker

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/images/dashboard.png)

### Image Viewer
![Image Viewer](docs/images/viewer.png)

### Analytics
![Analytics](docs/images/analytics.png)

---

## 🔗 Links

- [Documentation](https://docs.example.com)
- [API Reference](https://api.example.com/docs)
- [Issue Tracker](https://github.com/yourusername/biologic-project/issues)
- [Changelog](CHANGELOG.md)

---

## 📧 Contact

For questions or support, please contact:
- Email: support@example.com
- Discord: [Join our server](https://discord.gg/example)

---

**Made with ❤️ for the scientific community**
