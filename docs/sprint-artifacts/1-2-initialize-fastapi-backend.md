# Story 1.2: Initialize FastAPI Backend Project

Status: ready-for-dev

## Story

As a developer,
I want to initialize a FastAPI backend project with Python 3.11+ and core dependencies,
So that I have a robust API framework for building chat services.

## Acceptance Criteria

**Given** I have Python 3.11+ installed
**When** I create the backend directory structure
**Then** a Python virtual environment is created

**And** FastAPI with all standard dependencies is installed
**And** LangChain 0.1+ and OpenAI 1.0+ are installed
**And** SQLAlchemy 2.0+ with asyncpg driver is installed
**And** python-jose for JWT and passlib for bcrypt are installed
**And** requirements.txt contains all dependencies with versions
**And** The project structure includes app/main.py, app/auth/, app/chat/, app/models/, app/schemas/, app/services/, app/database/, app/utils/

**When** I run `fastapi dev app/main.py`
**Then** the development server starts on port 8000
**And** I can access the auto-generated API docs at /docs (Swagger UI)
**And** I can access alternative docs at /redoc (ReDoc)
**And** The root endpoint returns a welcome message

## Tasks / Subtasks

- [ ] Task 1: Create backend directory and virtual environment (AC: Python env ready)
  - [ ] 1.1: Create `backend/` directory
  - [ ] 1.2: Create virtual environment: `python -m venv venv`
  - [ ] 1.3: Activate virtual environment (Linux/Mac: `source venv/bin/activate`, Windows: `venv\Scripts\activate`)
  - [ ] 1.4: Verify Python version is 3.11+ (`python --version`)

- [ ] Task 2: Install core dependencies (AC: All packages installed)
  - [ ] 2.1: Install FastAPI: `pip install "fastapi[standard]"`
  - [ ] 2.2: Install LangChain: `pip install "langchain>=0.1.0" "openai>=1.0.0"`
  - [ ] 2.3: Install SQLAlchemy: `pip install "sqlalchemy>=2.0.0" asyncpg`
  - [ ] 2.4: Install Auth dependencies: `pip install "python-jose[cryptography]" "passlib[bcrypt]"`
  - [ ] 2.5: Install utilities: `pip install python-multipart alembic`
  - [ ] 2.6: Generate requirements.txt: `pip freeze > requirements.txt`

- [ ] Task 3: Create project structure (AC: All directories exist)
  - [ ] 3.1: Create `app/` directory with `__init__.py`
  - [ ] 3.2: Create `app/auth/` directory with `__init__.py`
  - [ ] 3.3: Create `app/chat/` directory with `__init__.py`
  - [ ] 3.4: Create `app/models/` directory with `__init__.py`
  - [ ] 3.5: Create `app/schemas/` directory with `__init__.py`
  - [ ] 3.6: Create `app/services/` directory with `__init__.py`
  - [ ] 3.7: Create `app/database/` directory with `__init__.py`
  - [ ] 3.8: Create `app/utils/` directory with `__init__.py`

- [ ] Task 4: Create app/main.py with FastAPI initialization (AC: Server starts)
  - [ ] 4.1: Import FastAPI and create app instance
  - [ ] 4.2: Configure CORS middleware with ALLOWED_ORIGINS
  - [ ] 4.3: Create root endpoint GET / returning {"message": "Welcome to LangChain Chatbot API"}
  - [ ] 4.4: Create health check endpoint GET /api/health returning {"status": "healthy"}
  - [ ] 4.5: Configure OpenAPI metadata (title, description, version)

- [ ] Task 5: Create app/config.py with Pydantic settings (AC: Config management ready)
  - [ ] 5.1: Import BaseSettings from pydantic_settings
  - [ ] 5.2: Define Settings class with all environment variables
  - [ ] 5.3: Add fields: DATABASE_URL, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
  - [ ] 5.4: Add fields: OPENAI_API_KEY, ALLOWED_ORIGINS, DEBUG, LOG_LEVEL
  - [ ] 5.5: Create settings instance: `settings = Settings()`

- [ ] Task 6: Test development server (AC: API docs accessible)
  - [ ] 6.1: Run `fastapi dev app/main.py`
  - [ ] 6.2: Verify server starts on port 8000
  - [ ] 6.3: Access http://localhost:8000 and see welcome message
  - [ ] 6.4: Access http://localhost:8000/docs and see Swagger UI
  - [ ] 6.5: Access http://localhost:8000/redoc and see ReDoc
  - [ ] 6.6: Test health check endpoint returns 200 OK

## Dev Notes

### Technical Requirements from Architecture

**Required Versions:**
- Python: 3.11+ (prerequisite)
- FastAPI: Latest stable (with standard extras)
- LangChain: 0.1+ (for GPT-4 integration)
- OpenAI: 1.0+ (API client)
- SQLAlchemy: 2.0+ (async support required)
- asyncpg: Latest (PostgreSQL async driver)
- python-jose: Latest (JWT handling)
- passlib: Latest with bcrypt support
- Alembic: Latest (database migrations)

**Key Configuration Points:**
- ASGI server: Uvicorn (comes with fastapi[standard])
- Async/await pattern for I/O operations
- Pydantic v2 for data validation and settings
- OAuth2 with Password flow for JWT authentication
- CORS middleware for frontend communication

**Project Structure Pattern (from Architecture):**
```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Pydantic settings
│   ├── dependencies.py         # Shared dependencies
│   ├── auth/                   # Auth module
│   │   ├── __init__.py
│   │   ├── jwt_handler.py
│   │   ├── password.py
│   │   └── router.py
│   ├── chat/                   # Chat module
│   │   ├── __init__.py
│   │   ├── langchain_service.py
│   │   └── router.py
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   ├── services/               # Business logic
│   ├── database/               # Database config
│   └── utils/                  # Utilities
├── tests/                      # Test directory
├── requirements.txt
└── .env.example
```

### Architecture Compliance

**Decision References:**
- Starter Template: FastAPI Manual Setup (Architecture Doc)
- Naming Convention: snake_case for all Python files and functions (Implementation Patterns)
- ASGI Framework: FastAPI with Uvicorn (Fixed Constraint)
- Database ORM: SQLAlchemy 2.0+ with async support (Decision 1.1)

**Key Architecture Patterns to Apply:**
1. **File Naming:** snake_case for all .py files (jwt_handler.py, langchain_service.py)
2. **Function Naming:** snake_case (create_access_token, get_user_by_id)
3. **Class Naming:** PascalCase (User, ChatSession, Settings)
4. **Constants:** SCREAMING_SNAKE_CASE (SECRET_KEY, ALGORITHM)
5. **Module Organization:** Separation by concern (models, schemas, services, routers)

### Environment Variables Setup

**Create .env.example:**
```bash
# Database
DATABASE_URL=postgresql+asyncpg://chatbot_user:password@localhost:5432/chatbot
POSTGRES_USER=chatbot_user
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=chatbot

# JWT Authentication
SECRET_KEY=your-secret-key-generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost

# Application
DEBUG=true
LOG_LEVEL=INFO
```

### CORS Configuration

**Must Configure for Frontend Communication:**
- Allow origins: http://localhost:3000 (Next.js dev), http://localhost (Nginx)
- Allow credentials: True
- Allow methods: GET, POST, PUT, DELETE, OPTIONS
- Allow headers: Authorization, Content-Type

### API Documentation Auto-Generation

**FastAPI provides automatic docs at:**
- `/docs` - Swagger UI (interactive API testing)
- `/redoc` - ReDoc (alternative documentation)
- `/openapi.json` - OpenAPI schema

**Metadata Configuration:**
- Title: "LangChain Chatbot API"
- Description: "AI-powered chatbot with GPT-4 integration"
- Version: "1.0.0"

### Testing Standards Summary

**For This Story:**
- Manual testing: Start server, access endpoints, verify responses
- API docs check: Swagger UI loads and displays endpoints
- Health check: GET /api/health returns 200 with {"status": "healthy"}

**Future Stories Will Add:**
- pytest for unit and integration tests
- FastAPI TestClient for endpoint testing
- Async test support with pytest-asyncio

### Validation Checklist

Before marking this story complete, verify:

- [ ] Python version is 3.11+ (`python --version`)
- [ ] Virtual environment created and activated
- [ ] FastAPI installed with [standard] extras
- [ ] LangChain 0.1+ installed (check with `pip list | grep langchain`)
- [ ] OpenAI 1.0+ installed (check with `pip list | grep openai`)
- [ ] SQLAlchemy 2.0+ installed (check with `pip list | grep sqlalchemy`)
- [ ] asyncpg driver installed
- [ ] python-jose and passlib[bcrypt] installed
- [ ] Alembic installed
- [ ] requirements.txt generated with all dependencies
- [ ] All required directories exist with __init__.py files
- [ ] app/main.py created with FastAPI app
- [ ] app/config.py created with Pydantic Settings
- [ ] CORS middleware configured
- [ ] Development server starts on port 8000 (`fastapi dev app/main.py`)
- [ ] Root endpoint accessible at http://localhost:8000
- [ ] Swagger UI accessible at http://localhost:8000/docs
- [ ] ReDoc accessible at http://localhost:8000/redoc
- [ ] Health check endpoint returns 200 OK
- [ ] No import errors or warnings
- [ ] .env.example created with all required variables

### References

**Source Documents:**
- [PRD - Technical Requirements - Tech Stack](docs/prd.md#technical-requirements)
- [Architecture - Starter Template Evaluation - Backend: FastAPI Manual Setup](docs/architecture.md#backend-fastapi-manual-setup)
- [Architecture - Implementation Patterns - Backend Naming](docs/architecture.md#code-naming-conventions)
- [Epic 1: Foundation & Infrastructure Setup - Story 1.2](docs/epics.md#story-12-initialize-fastapi-backend-project)

### Project Context Reference

**Project:** langchain - AI Chatbot Full-Stack Learning Playground
**Epic:** Epic 1 - Foundation & Infrastructure Setup
**Story Position:** Second story (1.2) - Backend foundation
**Dependencies:** Story 1.1 (Frontend initialized - for reference)
**Blockers:** None
**Next Story:** 1.3 - Database Setup with PostgreSQL and Alembic

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
