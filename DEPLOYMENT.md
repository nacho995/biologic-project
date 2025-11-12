# Deployment Guide

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
   - Runs on push to `main` and `develop` branches
   - Runs on pull requests
   - Tests backend and frontend
   - Builds and pushes Docker images to GitHub Container Registry
   - Deploys to production (configure deployment step)

2. **Docker Images** (`.github/workflows/docker-publish.yml`)
   - Runs on version tags (`v*`)
   - Can be triggered manually
   - Builds multi-platform images (amd64, arm64)
   - Publishes to GitHub Container Registry

### Setup

1. **Enable GitHub Actions** in your repository settings

2. **GitHub Container Registry** is automatically configured using `GITHUB_TOKEN`

3. **Secrets** (if needed for deployment):
   ```
   Settings → Secrets and variables → Actions → New repository secret
   ```

   Example secrets:
   - `DEPLOY_SSH_KEY`: SSH key for deployment server
   - `DEPLOY_HOST`: Deployment server hostname
   - `DEPLOY_USER`: Deployment server username

### Local Development

```bash
# Start all services
docker compose up --build

# Run tests
cd backend && npm test
cd frontend && npm test

# Lint code
cd backend && npm run lint
cd frontend && npm run lint
```

### Production Deployment

#### Option 1: Docker Compose (Simple)

```bash
# Pull latest images
docker compose pull

# Start services
docker compose up -d

# View logs
docker compose logs -f
```

#### Option 2: Kubernetes (Advanced)

See `k8s/` directory for Kubernetes manifests (to be created).

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=biologic
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Backend
PORT=5000
NODE_ENV=production

# Frontend (if needed)
VITE_API_URL=http://localhost:5000
```

### Monitoring

Health check endpoint: `http://localhost:5000/health`

### Rollback

If deployment fails, rollback to previous version:

```bash
# Using Docker
docker compose down
docker compose up -d --force-recreate

# Using git tags
git checkout v1.0.0
docker compose up --build -d
```

### Performance Optimization

- Images are cached in GitHub Actions
- Multi-stage builds reduce image size
- Nginx serves static frontend files
- PostgreSQL with persistent volumes

### Security

- All sensitive data in environment variables
- Images scanned for vulnerabilities (configure Trivy)
- HTTPS/TLS recommended for production
- Regular dependency updates

### Troubleshooting

```bash
# Check container logs
docker compose logs backend
docker compose logs frontend

# Check container status
docker compose ps

# Restart a service
docker compose restart backend

# Rebuild without cache
docker compose build --no-cache
```

