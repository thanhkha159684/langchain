# Story 1.4: Docker Compose Multi-Container Orchestration

Status: ready-for-dev

## Story

As a developer,
I want all services running in Docker containers with one command,
So that deployment is consistent across development and production environments.

## Acceptance Criteria

**Given** Docker 24+ and Docker Compose 2+ are installed
**When** I create docker-compose.yml configuration
**Then** four services are defined: frontend, backend, db (PostgreSQL), nginx

**And** frontend service builds from frontend/Dockerfile
**And** backend service builds from backend/Dockerfile
**And** db service uses official postgres:15-alpine image
**And** nginx service builds from nginx/Dockerfile
**And** All services are connected via custom bridge network
**And** PostgreSQL data persists in Docker volume
**And** Environment variables are injected from .env file

**When** I run `docker-compose up --build`
**Then** all four containers start successfully
**And** PostgreSQL is accessible on internal network at db:5432
**And** Backend runs on port 8000 internally
**And** Frontend runs on port 3000 internally
**And** Nginx exposes port 80 externally
**And** Database migrations run automatically on backend startup
**And** Health checks pass for all services

**When** I access http://localhost
**Then** Nginx routes me to the frontend
**And** Requests to /api/* are proxied to backend:8000
**And** API documentation is accessible at http://localhost/api/docs

## Tasks / Subtasks

- [ ] Task 1: Create frontend Dockerfile (AC: Frontend container builds)
  - [ ] 1.1: Create frontend/Dockerfile with multi-stage build
  - [ ] 1.2: Stage 1: deps - Install dependencies
  - [ ] 1.3: Stage 2: builder - Build Next.js app
  - [ ] 1.4: Stage 3: runner - Production runtime
  - [ ] 1.5: Expose port 3000
  - [ ] 1.6: Create frontend/.dockerignore

- [ ] Task 2: Create backend Dockerfile (AC: Backend container builds)
  - [ ] 2.1: Create backend/Dockerfile with Python 3.11 base
  - [ ] 2.2: Install dependencies from requirements.txt
  - [ ] 2.3: Copy application code
  - [ ] 2.4: Create docker-entrypoint.sh for migrations
  - [ ] 2.5: Expose port 8000
  - [ ] 2.6: CMD runs uvicorn with reload
  - [ ] 2.7: Create backend/.dockerignore

- [ ] Task 3: Create Nginx configuration (AC: Reverse proxy works)
  - [ ] 3.1: Create nginx/Dockerfile
  - [ ] 3.2: Create nginx/nginx.conf with routing rules
  - [ ] 3.3: Configure location / → frontend:3000
  - [ ] 3.4: Configure location /api/ → backend:8000
  - [ ] 3.5: Configure WebSocket support for /api/chat/ws
  - [ ] 3.6: Add security headers

- [ ] Task 4: Create docker-compose.yml (AC: All services orchestrated)
  - [ ] 4.1: Define version and services
  - [ ] 4.2: Configure db service: postgres:15-alpine with volume
  - [ ] 4.3: Configure backend service: build, depends_on db, env vars
  - [ ] 4.4: Configure frontend service: build, env vars
  - [ ] 4.5: Configure nginx service: build, ports 80:80, depends_on frontend+backend
  - [ ] 4.6: Define custom network: chatbot-network
  - [ ] 4.7: Define volume: postgres-data
  - [ ] 4.8: Add healthcheck for all services

- [ ] Task 5: Create root .env.example (AC: Environment template ready)
  - [ ] 5.1: Document all backend environment variables
  - [ ] 5.2: Document all frontend environment variables
  - [ ] 5.3: Document PostgreSQL variables
  - [ ] 5.4: Add comments explaining each variable

- [ ] Task 6: Test Docker Compose deployment (AC: One-command deployment works)
  - [ ] 6.1: Run `docker-compose up --build`
  - [ ] 6.2: Verify all 4 containers start successfully
  - [ ] 6.3: Check logs for errors: `docker-compose logs`
  - [ ] 6.4: Access http://localhost and see frontend
  - [ ] 6.5: Access http://localhost/api/health and see 200 OK
  - [ ] 6.6: Access http://localhost/api/docs and see Swagger UI
  - [ ] 6.7: Verify database migrations ran
  - [ ] 6.8: Test container restart: data persists

## Dev Notes

### Technical Requirements from Architecture

**Required Versions:**
- Docker: 24+ (latest stable)
- Docker Compose: 2+ (v2 syntax)
- Base Images:
  - Frontend: node:20-alpine
  - Backend: python:3.11-slim
  - Database: postgres:15-alpine
  - Nginx: nginx:1.25-alpine

**Docker Compose Services:**

**1. Database Service (db):**
- Image: postgres:15-alpine
- Environment: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- Volume: postgres-data mounted to /var/lib/postgresql/data
- Network: chatbot-network
- Healthcheck: pg_isready command

**2. Backend Service:**
- Build: backend/Dockerfile
- Depends on: db service
- Environment: DATABASE_URL, SECRET_KEY, OPENAI_API_KEY, etc.
- Entrypoint: Run Alembic migrations then start uvicorn
- Port: 8000 (internal only, not exposed externally)
- Network: chatbot-network

**3. Frontend Service:**
- Build: frontend/Dockerfile with multi-stage
- Environment: NEXT_PUBLIC_API_URL=http://localhost/api
- Port: 3000 (internal only)
- Network: chatbot-network
- Depends on: backend (optional, for readiness)

**4. Nginx Service:**
- Build: nginx/Dockerfile
- Depends on: frontend, backend
- Ports: 80:80 (only service exposed externally)
- Network: chatbot-network
- Configuration: Reverse proxy to frontend and backend

### Architecture Compliance

**Decision References:**
- Infrastructure: Docker Compose orchestration (FR7, Epic 1 Story 1.4)
- Environment Variables: .env file management (Decision 5.1)
- Multi-container pattern: Microservices architecture (Architecture boundaries)

**Key Patterns:**
1. **Multi-stage builds:** Optimize frontend image size
2. **Service networking:** Custom bridge network for inter-service communication
3. **Volume persistence:** PostgreSQL data survives container restarts
4. **Health checks:** Ensure services are ready before dependent services start
5. **Entrypoint scripts:** Run migrations before starting application

### Frontend Dockerfile Pattern (Multi-stage)

**Stage 1 - deps:**
- Base: node:20-alpine
- Install dependencies only
- Copy package.json, package-lock.json
- Run: npm ci

**Stage 2 - builder:**
- From deps stage
- Copy source code
- Build: npm run build

**Stage 3 - runner:**
- Base: node:20-alpine (fresh)
- Copy built artifacts from builder
- Copy node_modules from deps
- Expose 3000
- CMD: npm start

### Backend Dockerfile Pattern

**Base: python:3.11-slim**
- Install system dependencies
- Create app user (non-root)
- Copy requirements.txt and install
- Copy application code
- Copy docker-entrypoint.sh
- Expose 8000
- ENTRYPOINT: docker-entrypoint.sh
- CMD: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

**docker-entrypoint.sh:**
```bash
#!/bin/bash
set -e
# Wait for database
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do sleep 1; done
# Run migrations
echo "Running migrations..."
alembic upgrade head
# Start application
exec "$@"
```

### Nginx Configuration Pattern

**nginx.conf structure:**
```nginx
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:8000;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://frontend;
        # Headers...
    }
    
    location /api/ {
        proxy_pass http://backend;
        # Headers...
    }
    
    location /api/chat/ws {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        # WebSocket support...
    }
}
```

### Docker Compose Network Strategy

**Custom Bridge Network:**
- Name: chatbot-network
- Services can reach each other by service name (dns resolution)
- Frontend → backend:8000
- Backend → db:5432
- External access only through nginx on port 80

**Why custom network:**
- Better isolation
- Predictable DNS names
- Easier troubleshooting
- Future scalability

### Volume Persistence Strategy

**postgres-data volume:**
- Type: Named volume (managed by Docker)
- Mount point: /var/lib/postgresql/data
- Persistence: Data survives `docker-compose down`
- Removal: Only deleted with `docker-compose down -v`

### Environment Variable Injection

**Three levels of configuration:**

**1. Root .env file:**
- Loaded by docker-compose
- Contains all environment variables
- Never committed to git

**2. Service-specific env_file:**
- backend/.env (if needed)
- frontend/.env.local (if needed)

**3. docker-compose.yml environment:**
- Pass specific vars to each service
- Example: DATABASE_URL for backend, NEXT_PUBLIC_API_URL for frontend

### Testing Standards Summary

**For This Story:**
- Build test: All containers build without errors
- Start test: All containers start and stay running
- Network test: Services can communicate (backend → db, nginx → frontend)
- Persistence test: Restart containers, data intact
- Access test: http://localhost loads frontend
- API test: http://localhost/api/health returns 200

**Verification Commands:**
```bash
# Build and start
docker-compose up --build -d

# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Test backend from inside frontend container
docker-compose exec frontend curl http://backend:8000/api/health

# Check database
docker-compose exec db psql -U chatbot_user -d chatbot -c "\dt"

# Stop and remove containers (keep volumes)
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Validation Checklist

Before marking this story complete, verify:

- [ ] Docker 24+ installed (`docker --version`)
- [ ] Docker Compose 2+ installed (`docker-compose --version`)
- [ ] frontend/Dockerfile created with multi-stage build
- [ ] frontend/.dockerignore created
- [ ] backend/Dockerfile created
- [ ] backend/docker-entrypoint.sh created and executable
- [ ] backend/.dockerignore created
- [ ] nginx/Dockerfile created
- [ ] nginx/nginx.conf created with routing rules
- [ ] docker-compose.yml created with 4 services
- [ ] Custom network defined: chatbot-network
- [ ] Volume defined: postgres-data
- [ ] .env.example created at project root
- [ ] All services have healthcheck configured
- [ ] `docker-compose up --build` runs successfully
- [ ] All 4 containers start: db, backend, frontend, nginx
- [ ] No error messages in logs
- [ ] http://localhost shows frontend page
- [ ] http://localhost/api/health returns 200 OK
- [ ] http://localhost/api/docs shows Swagger UI
- [ ] Database migrations ran automatically
- [ ] Database tables exist (users, chat_sessions, messages)
- [ ] Services can communicate internally
- [ ] PostgreSQL data persists after container restart
- [ ] `docker-compose down` and `docker-compose up` works
- [ ] Environment variables loaded correctly

### References

**Source Documents:**
- [PRD - MVP Infrastructure - Docker Deployment](docs/prd.md#mvp---minimum-viable-product-week-1-4)
- [Architecture - Infrastructure Decision 5.1](docs/architecture.md#decision-51-environment-variable-management)
- [Epic 1: Foundation & Infrastructure Setup - Story 1.4](docs/epics.md#story-14-docker-compose-multi-container-orchestration)

### Project Context Reference

**Project:** langchain - AI Chatbot Full-Stack Learning Playground
**Epic:** Epic 1 - Foundation & Infrastructure Setup
**Story Position:** Fourth story (1.4) - Complete infrastructure
**Dependencies:** Stories 1.1, 1.2, 1.3 (All components ready to containerize)
**Blockers:** Docker and Docker Compose must be installed
**Next Story:** 1.5 - Environment Variable Management

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- Model name and version will be recorded here during implementation -->

### Debug Log References

<!-- Links to relevant logs during implementation -->

### Completion Notes List

<!-- Developer notes about implementation decisions, challenges, solutions -->

### File List

<!-- List of files created/modified during implementation -->
