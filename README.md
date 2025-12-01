# LangChain Chatbot - Full-Stack AI Application

AI-powered chatbot with GPT-4 integration via LangChain, built with Next.js 14 and FastAPI.

## Project Status

✅ **Epic 1: Foundation & Infrastructure Setup - COMPLETED**

All 7 stories completed:
- 1.1: Next.js Frontend Initialized
- 1.2: FastAPI Backend Initialized  
- 1.3: Database Setup (PostgreSQL + Alembic)
- 1.4: Docker Compose Orchestration
- 1.5: Environment Variable Management
- 1.6: Logging and Monitoring
- 1.7: API Documentation & Health Checks

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4 + Ant Design v6
- **State Management**: React Context (upcoming)

### Backend
- **Framework**: FastAPI 0.123+
- **Language**: Python 3.11+
- **ORM**: SQLAlchemy 2.0+ (async)
- **AI/LLM**: LangChain 1.1+ + OpenAI 2.8+
- **Migrations**: Alembic 1.17+

### Database
- **Primary**: PostgreSQL 15+
- **Driver**: asyncpg 0.31+

### Infrastructure
- **Containerization**: Docker 24+ & Docker Compose 2+
- **Reverse Proxy**: Nginx 1.25+
- **Environment**: .env based configuration

## Prerequisites

- Node.js 20.9+
- Python 3.11+
- Docker 24+ & Docker Compose 2+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

## Quick Start

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone <repository-url>
cd langchain

# Copy environment template
cp .env.example .env

# Generate SECRET_KEY
openssl rand -hex 32

# Edit .env and fill in:
# - SECRET_KEY (use generated value above)
# - OPENAI_API_KEY (from OpenAI dashboard)
# - POSTGRES_PASSWORD (choose a secure password)
```

### 2. Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service health
docker-compose ps
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **API Documentation**: http://localhost/api/docs
- **Alternative Docs**: http://localhost/api/redoc
- **Health Check**: http://localhost/api/health

### 4. Stop Services

```bash
# Stop containers (keep data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Development Setup (Without Docker)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup database (PostgreSQL must be running)
alembic upgrade head

# Run development server
fastapi dev app/main.py
```

Backend will be available at http://localhost:8000

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at http://localhost:3000

## Project Structure

```
langchain/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Core utilities
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── auth/            # Authentication module
│   │   ├── chat/            # Chat module
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── database/        # Database config
│   │   ├── utils/           # Utilities
│   │   ├── config.py        # Settings
│   │   └── main.py          # FastAPI app
│   ├── alembic/             # Database migrations
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── requirements.txt
│
├── nginx/                    # Nginx reverse proxy
│   ├── nginx.conf
│   └── Dockerfile
│
├── docs/                     # Project documentation
│   ├── architecture.md
│   ├── prd.md
│   └── sprint-artifacts/
│
├── docker-compose.yml        # Multi-container orchestration
├── .env.example             # Environment template
└── README.md                # This file
```

## Database Migrations

```bash
# Generate new migration
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback one migration
docker-compose exec backend alembic downgrade -1

# View migration history
docker-compose exec backend alembic history
```

## API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: http://localhost/api/docs
  - Interactive API testing
  - Request/response examples
  - Authentication testing

- **ReDoc**: http://localhost/api/redoc
  - Alternative documentation format
  - Clean, readable interface

- **OpenAPI Schema**: http://localhost/api/openapi.json
  - Raw OpenAPI 3.0 schema
  - For API clients and code generation

## Environment Variables

### Required Variables

- `SECRET_KEY`: JWT signing key (generate with `openssl rand -hex 32`)
- `OPENAI_API_KEY`: OpenAI API key
- `POSTGRES_PASSWORD`: Database password

### Optional Variables

- `POSTGRES_USER`: Database user (default: chatbot_user)
- `POSTGRES_DB`: Database name (default: chatbot)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token lifetime (default: 30)
- `DEBUG`: Debug mode (default: true)
- `LOG_LEVEL`: Logging level (default: INFO)

See `.env.example` for complete list with descriptions.

## Logging

### Backend Logs

```bash
# View all logs
docker-compose logs backend

# Follow logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Log Format

```
2025-12-02 10:30:00,123 - app.main - INFO - Request started: GET /api/health
```

### Log Levels

- **DEBUG**: Detailed diagnostic information (development only)
- **INFO**: General informational messages
- **WARNING**: Warning messages (validation errors, retries)
- **ERROR**: Error messages (API failures, exceptions)
- **CRITICAL**: Critical errors (system failure)

## Health Checks

All services have automated health checks:

```bash
# Check all service health
docker-compose ps

# Manual health check
curl http://localhost/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-02T10:00:00.000000",
  "version": "1.0.0"
}
```

## Troubleshooting

### Backend won't start

1. Check database is running: `docker-compose ps db`
2. Check database logs: `docker-compose logs db`
3. Verify `.env` file has correct `POSTGRES_*` values
4. Check backend logs: `docker-compose logs backend`

### Frontend won't build

1. Check Node version: `node --version` (should be 20.9+)
2. Clear Next.js cache: `rm -rf frontend/.next`
3. Rebuild: `docker-compose up --build frontend`

### Database migrations fail

1. Check database connection in `.env`
2. View migration logs: `docker-compose logs backend`
3. Manually run migrations: `docker-compose exec backend alembic upgrade head`

### Can't access services

1. Check all containers are running: `docker-compose ps`
2. Check nginx logs: `docker-compose logs nginx`
3. Verify ports not in use: `netstat -ano | findstr :80`

## Next Steps

Epic 2 will implement:
- User registration and login
- JWT authentication
- Protected routes
- User profile management

See `docs/epics.md` for complete roadmap.

## Contributing

This is a learning project. See `docs/project-planning.md` for development workflow.

## License

MIT License - See LICENSE file for details
