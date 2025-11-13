# Biologic Platform 🔬

A professional biological image analysis platform for researchers and scientists to visualize, analyze, and process microscopy images.

[![CI/CD Pipeline](https://github.com/your-username/biologic-project/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-username/biologic-project/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### Authentication & User Management
- ✅ User registration with email verification
- ✅ Secure login with JWT tokens
- ✅ Password reset via email
- ✅ Role-based access control (Admin, Worker, Viewer)
- ✅ Session management

### Image Analysis
- 📊 **Multiple Viewing Modes**:
  - Single view with zoom & pan
  - Slider view for sequential analysis
  - Grid view for comparison
  - 3D volumetric rendering
- 🎨 **Advanced Color Mapping**:
  - Multi-channel color control
  - Brightness & contrast adjustment
  - Custom color palettes
- 📈 **Analytics Dashboard**:
  - Real-time statistics
  - Image metadata visualization
  - Analysis history

### Image Processing
- 🖼️ TIFF format support
- 🔍 3D visualization with slice navigation
- 📐 Image composition tools
- 💾 Metadata extraction and display
- 🎯 ML-based segmentation (planned)

### Enterprise Features
- 🔒 Secure authentication system
- 📧 Email notifications
- 🍪 GDPR-compliant cookie management
- 📱 Fully responsive design
- 🌙 Dark mode interface

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Canvas Rendering**: Konva.js, Three.js
- **Authentication**: JWT + Context API
- **Styling**: Emotion (CSS-in-JS)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **File Processing**: Sharp, TIFF.js
- **Email**: Nodemailer

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: Render PostgreSQL

## 📋 Prerequisites

- Node.js 18 or higher
- Docker & Docker Compose
- PostgreSQL 15 (for local development)
- Gmail account with App Password (for email features)

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/biologic-project.git
cd biologic-project
```

### 2. Local Development with Docker

```bash
# Start all services
docker compose up

# The application will be available at:
# - Frontend: http://localhost:80
# - Backend: http://localhost:5000
# - Database: localhost:5432
```

### 3. Create Demo Users

```bash
# Enter the backend container
docker exec -it biologic-backend sh

# Create demo users
npm run create-demo-users
```

### 4. Login Credentials

- **Admin**: admin@demo.com / demo123
- **Worker**: worker@demo.com / demo123
- **Viewer**: viewer@demo.com / demo123

## 🔧 Development Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Initialize database
npm run init-db

# Create demo users
npm run create-demo-users

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

## 📦 Production Deployment

### Prerequisites

1. **GitHub Account**: For code hosting and CI/CD
2. **Vercel Account**: For frontend hosting
3. **Render Account**: For backend and database hosting
4. **Gmail Account**: With App Password enabled

### Step-by-Step Guide

Detailed deployment instructions are available in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

**Quick Summary:**

1. **Setup Database** (Render PostgreSQL)
2. **Configure Email** (Gmail App Password)
3. **Deploy Backend** (Render)
4. **Deploy Frontend** (Vercel)
5. **Configure CI/CD** (GitHub Actions)

### GitHub Secrets Configuration

Add these secrets to your GitHub repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

Required secrets:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `RENDER_DEPLOY_HOOK`: Your Render deploy hook URL
- `VITE_API_URL`: Your backend API URL

### Automatic Deployment

Once configured, deployments happen automatically:

```bash
# Deploy to production
git push origin main

# GitHub Actions will:
# 1. Run tests and linting
# 2. Build frontend and backend
# 3. Deploy to Vercel (frontend)
# 4. Deploy to Render (backend)
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🌍 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-32-characters-minimum

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend.onrender.com
```

## 📚 Project Structure

```
biologic-project/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Auth/        # Authentication components
│   │   │   ├── Dashboard/   # Dashboard components
│   │   │   ├── ImageViewer/ # Image viewing components
│   │   │   └── ...
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand stores
│   │   └── theme/           # MUI theme
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── migrations/      # Database migrations
│   │   └── server.js        # Express app
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions workflow
│
├── docker-compose.yml        # Docker services
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

## 🔐 Security

- All passwords are hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- Email verification required for new accounts
- HTTPS enforced in production
- CORS configured for specific origins
- SQL injection protection via Sequelize
- XSS protection via sanitization
- CSRF protection via SameSite cookies

## 📄 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/verify-email      # Verify email
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
POST   /api/auth/resend-verification # Resend verification email
GET    /api/auth/me                # Get current user
GET    /api/auth/users             # Get all users (admin only)
```

### Image Endpoints

```
GET    /api/images                 # Get all images
POST   /api/upload/images          # Upload TIFF images
GET    /api/images/:id             # Get image by ID
DELETE /api/images/:id             # Delete image
GET    /api/image/:id/slice/:index # Get specific slice
```

### Analysis Endpoints

```
GET    /api/metadata/:id           # Get image metadata
POST   /api/compositions           # Create composition
GET    /api/compositions/:id       # Get composition
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Email not sending:**
- Verify Gmail App Password is correct
- Check 2-Step Verification is enabled
- Review backend logs for errors

**Database connection failed:**
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall rules

**Frontend can't connect to backend:**
- Verify VITE_API_URL is correct
- Check backend is running
- Review CORS configuration

**Images not loading:**
- Check file permissions
- Verify uploads directory exists
- Review backend logs

### Getting Help

- 📖 [Deployment Guide](./DEPLOYMENT.md)
- 🐛 [Open an Issue](https://github.com/your-username/biologic-project/issues)
- 💬 [Discussions](https://github.com/your-username/biologic-project/discussions)

## 🎯 Roadmap

- [ ] ML-based image segmentation
- [ ] Batch processing
- [ ] Export to multiple formats
- [ ] Collaborative annotations
- [ ] API rate limiting
- [ ] Advanced analytics
- [ ] Mobile app

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Material-UI for the UI components
- Konva.js for canvas rendering
- Sharp for image processing
- The open-source community

---

**Made with ❤️ for the scientific community**
