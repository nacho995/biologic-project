# 🔬 Biological Image Analysis Platform

[![CI/CD](https://github.com/yourusername/biologic-project/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/yourusername/biologic-project/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

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
- Email: support@biologic-analysis.com
- Privacy: privacy@biologic-analysis.com
- Legal: legal@biologic-analysis.com

## 🔒 Legal & Compliance

- [Privacy Policy](./PRIVACY_POLICY.md)
- [Terms of Service](./TERMS_OF_SERVICE.md)
- [Cookie Policy](./COOKIE_POLICY.md)
- [Compliance & Security](./COMPLIANCE.md)

This platform complies with GDPR, CCPA, and international data protection standards.
