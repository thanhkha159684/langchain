# langchain - Epic Breakdown

**Author:** Langchain Chatbot
**Date:** 2025-12-02
**Project:** langchain (AI Chatbot Full-Stack Learning Playground)

---

## Overview

This document provides the complete epic and story breakdown for **langchain**, decomposing the requirements from the [PRD](./prd.md) and incorporating technical context from the [Architecture](./architecture.md) into implementable stories.

**Living Document Notice:** This breakdown includes comprehensive implementation details from both PRD requirements and Architecture technical decisions.

---

## Functional Requirements Inventory

### FR1: User Registration & Authentication
**Description:** Users can create accounts and authenticate securely to access the platform.
- User registration with email, username, password
- Password strength validation (8+ chars, uppercase, lowercase, digit)
- JWT token-based authentication
- Login/logout functionality
- Password hashing with bcrypt (cost factor 12)
- Protected routes requiring authentication
- Token expiration handling (30 minutes)

**PRD Reference:** MVP - Authentication System, Technical Requirements - Authentication Flow
**Architecture Reference:** Decision 2.1 (JWT Storage), Decision 2.2 (Password Requirements), Database Schema (users table)

---

### FR2: Basic Chat Interface
**Description:** Clean, intuitive UI for users to interact with AI chatbot.
- Text input field for user messages
- Message display area showing conversation history
- Clear distinction between user and AI messages
- Loading indicators during AI processing
- Send button and keyboard shortcuts (Enter to send)
- Responsive design for mobile/desktop

**PRD Reference:** MVP - Basic Chat Interface, User Journeys (Alex's "Aha!" Moment)
**Architecture Reference:** Frontend structure, Ant Design components, React Context state management

---

### FR3: AI Integration with LangChain
**Description:** Backend integration with OpenAI GPT-4 via LangChain framework.
- LangChain setup with ChatOpenAI
- GPT-4 model integration
- Conversation memory management
- Prompt template configuration
- Error handling for API failures
- Response time < 5 seconds (p95)

**PRD Reference:** MVP - AI Integration, Technical Requirements - Performance Benchmarks
**Architecture Reference:** Decision 1.2 (Conversation Memory Strategy), LangChain service setup

---

### FR4: WebSocket Real-time Communication
**Description:** Streaming AI responses in real-time via WebSocket connection.
- WebSocket endpoint at /api/chat/ws/{session_id}
- Token-based WebSocket authentication
- Chunk-by-chunk message streaming
- Connection lifecycle management (connect, disconnect, reconnect)
- Auto-reconnect logic (max 3 retries)
- Heartbeat/ping mechanism (30 seconds interval)

**PRD Reference:** Growth Features - Real-time Features, Technical Requirements - WebSocket specification
**Architecture Reference:** Decision 3.2 (Real-time Communication Pattern), Nginx WebSocket configuration

---

### FR5: Multi-Session Management
**Description:** Users can create, switch between, and manage multiple chat sessions.
- Create new chat session
- List all user's chat sessions
- Switch between sessions
- Delete chat sessions
- Session title/naming
- Session persistence across login/logout
- Display last updated timestamp

**PRD Reference:** Growth Features - Enhanced Chat, User Journeys (Alex's Discovery)
**Architecture Reference:** Database schema (chat_sessions table), REST API endpoints

---

### FR6: Chat History Persistence
**Description:** All conversations are saved and retrievable across sessions.
- Messages stored in PostgreSQL database
- Foreign key relationships (users → sessions → messages)
- Pagination for long conversations
- Load history on session open
- Conversation context maintained for AI
- CASCADE DELETE for data cleanup

**PRD Reference:** MVP - Basic Chat Interface, Growth Features - Enhanced Chat
**Architecture Reference:** Decision 1.1 (Database Schema), Decision 1.2 (Conversation Memory)

---

### FR7: Docker Deployment Infrastructure
**Description:** Complete containerized deployment with Docker Compose orchestration.
- Docker Compose with 4 services (frontend, backend, database, nginx)
- Nginx reverse proxy routing
- PostgreSQL with volume persistence
- Environment variable management
- One-command deployment: `docker-compose up`
- Health checks for all services

**PRD Reference:** MVP - Infrastructure, Technical Requirements - Environment Variables
**Architecture Reference:** Docker Compose structure, Nginx configuration, Environment management

---

### FR8: User Profile Management
**Description:** Users can view and manage their profile information.
- View user profile (username, email, account creation date)
- Display user statistics (total sessions, total messages)
- Account settings access
- Future: Profile editing, password change

**PRD Reference:** Implied in User Management, Growth Features
**Architecture Reference:** User schema, REST API endpoints (/api/users/{user_id})

---

### FR9: Error Handling & User Feedback
**Description:** Comprehensive error handling with user-friendly messages.
- Standardized error response format
- HTTP status codes (400, 401, 403, 404, 409, 500, 502)
- User-friendly error messages (Ant Design message component)
- Backend error logging with context
- Frontend error boundaries
- Retry mechanisms for transient failures

**PRD Reference:** Technical Requirements - Error Handling Strategy
**Architecture Reference:** Decision 3.1 (API Response Format), Implementation Patterns - Error Handling

---

### FR10: Security Implementation
**Description:** Security measures following OWASP Top 10 best practices.
- Input validation (Pydantic schemas, React validation)
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection (React auto-escaping)
- CORS configuration (specific origins only)
- Security headers (Nginx)
- Rate limiting consideration (future)
- Secrets management (environment variables)

**PRD Reference:** Technical Requirements - Security Requirements (OWASP Top 10)
**Architecture Reference:** Decision 2.1 (JWT Security), Implementation Patterns - Security

---

### FR11: Database Migrations
**Description:** Version-controlled database schema management with Alembic.
- Alembic setup for SQLAlchemy
- Auto-generate migrations from model changes
- Migration versioning and history
- Reversible migrations (upgrade/downgrade)
- Docker entrypoint migration execution

**PRD Reference:** Technical Requirements - Database Schema
**Architecture Reference:** Decision 1.3 (Database Migrations Approach)

---

### FR12: API Documentation
**Description:** Comprehensive, auto-generated API documentation.
- FastAPI auto-generated OpenAPI schema
- Swagger UI at /docs endpoint
- ReDoc alternative at /redoc endpoint
- Request/response examples
- Authentication documentation
- Error code reference

**PRD Reference:** Technical Requirements - API Specifications
**Architecture Reference:** FastAPI automatic documentation, API naming conventions

---

## Epic Structure & Planning

### Epic Design Principles Applied

This epic breakdown follows **user-value-first organization**, where each epic delivers something users can actually accomplish or benefit from. Epics are NOT organized by technical layers (database, API, frontend).

**Architecture Integration:**
- Leverages Next.js 14+ App Router and FastAPI technical decisions
- Builds on database schema design (users, chat_sessions, messages)
- Implements JWT authentication and WebSocket patterns from architecture
- Uses Ant Design components and React Context state management
- Follows Docker Compose orchestration strategy

**Incremental Delivery:**
- Epic 1: Foundation enables all subsequent development
- Epic 2: Users can register and access secure area
- Epic 3: Users can have basic AI conversations
- Epic 4: Users can manage multiple conversation threads
- Epic 5: Enhanced real-time experience with streaming

**Dependency Flow:**
```
Epic 1 (Foundation)
  ↓
Epic 2 (Authentication) → Epic 3 (Basic Chat)
  ↓                           ↓
Epic 4 (Multi-Session Management)
  ↓
Epic 5 (Real-time Streaming)
```

---

## Epic Overview

### Epic 1: Foundation & Infrastructure Setup
**User Value:** Development environment ready for building features
**FRs Covered:** FR7 (Docker Infrastructure), FR11 (Database Migrations), FR12 (API Documentation)
**Technical Context:** Docker Compose orchestration, PostgreSQL setup, Alembic migrations, FastAPI/Next.js initialization

### Epic 2: User Authentication & Account Management
**User Value:** Users can create accounts and securely access the platform
**FRs Covered:** FR1 (Registration & Authentication), FR8 (User Profile), FR9 (Error Handling), FR10 (Security)
**Technical Context:** JWT tokens, bcrypt hashing, localStorage strategy, Pydantic validation, OWASP security measures

### Epic 3: Basic AI Chat Conversation
**User Value:** Users can have meaningful conversations with AI assistant
**FRs Covered:** FR2 (Chat Interface), FR3 (AI Integration), FR6 (Chat History Persistence), FR9 (Error Handling)
**Technical Context:** LangChain + GPT-4 integration, conversation memory, Ant Design UI components, React Context state

### Epic 4: Multi-Session Management
**User Value:** Users can organize conversations into multiple threads and switch between topics
**FRs Covered:** FR5 (Multi-Session Management), FR6 (Chat History - extended)
**Technical Context:** chat_sessions table, session CRUD operations, React session state management, Ant Design sidebar

### Epic 5: Real-time Streaming Experience
**User Value:** Users see AI responses appear instantly, character by character, for more engaging interaction
**FRs Covered:** FR4 (WebSocket Real-time Communication)
**Technical Context:** WebSocket implementation, LangChain streaming, connection lifecycle, Nginx WebSocket proxy

---

## Epic 1: Foundation & Infrastructure Setup

**Epic Goal:** Establish complete development and deployment infrastructure that enables all subsequent feature development. Developers can run the entire stack locally with one command and have a working foundation for building chat features.

**User Value:** Development environment is production-ready from day one, following industry best practices for containerization, database management, and API documentation.

**FRs Covered:** FR7 (Docker Infrastructure), FR11 (Database Migrations), FR12 (API Documentation)

---

### Story 1.1: Initialize Next.js Frontend Project

As a developer,
I want to initialize a Next.js 14+ frontend project with TypeScript and Ant Design,
So that I have a modern React foundation for building the chat UI.

**Acceptance Criteria:**

**Given** I have Node.js 20.9+ installed
**When** I run the project initialization commands
**Then** a Next.js project is created with App Router architecture

**And** TypeScript is configured with strict mode
**And** Tailwind CSS is set up with PostCSS
**And** Ant Design v5 is installed with @ant-design/nextjs-registry
**And** ESLint is configured with Next.js rules
**And** Import aliases (@/*) are configured in tsconfig.json
**And** The project structure includes src/app, src/components, src/lib, src/hooks, src/types directories

**When** I run `npm run dev`
**Then** the development server starts on port 3000
**And** Hot Module Replacement (HMR) works with Turbopack
**And** I can access the default Next.js welcome page

**Technical Implementation:**
- Run: `npx create-next-app@latest frontend --typescript --tailwind --app --eslint --import-alias "@/*"`
- Install Ant Design: `npm install antd @ant-design/nextjs-registry`
- Create directory structure: components/, lib/, hooks/, types/, utils/
- Configure app/layout.tsx with AntdRegistry wrapper
- Set up globals.css with Tailwind directives

**Prerequisites:** None (first story)

---

### Story 1.2: Initialize FastAPI Backend Project

As a developer,
I want to initialize a FastAPI backend project with Python 3.11+ and core dependencies,
So that I have a robust API framework for building chat services.

**Acceptance Criteria:**

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

**Technical Implementation:**
- Create backend/ directory and virtual environment: `python -m venv venv`
- Install core packages: `pip install "fastapi[standard]" "langchain>=0.1.0" "openai>=1.0.0" "sqlalchemy>=2.0.0" "asyncpg" "python-jose[cryptography]" "passlib[bcrypt]" "python-multipart" "alembic"`
- Generate requirements.txt: `pip freeze > requirements.txt`
- Create app/main.py with FastAPI app initialization
- Configure CORS middleware with ALLOWED_ORIGINS
- Create __init__.py files in all module directories
- Set up basic health check endpoint: GET /api/health

**Prerequisites:** Story 1.1 (for reference architecture)

---

### Story 1.3: Database Setup with PostgreSQL and Alembic

As a developer,
I want PostgreSQL running with Alembic migrations configured,
So that I have reliable database management with version-controlled schema changes.

**Acceptance Criteria:**

**Given** PostgreSQL 15+ is available
**When** I initialize the database and Alembic
**Then** Alembic is configured in the backend project

**And** PostgreSQL connection is established via DATABASE_URL
**And** SQLAlchemy Base is configured in app/database/base.py
**And** Database session dependency is created in app/database/session.py
**And** Alembic env.py is configured to use SQLAlchemy models
**And** Three database models are created: User, ChatSession, Message

**When** I run `alembic revision --autogenerate -m "Initial schema"`
**Then** a migration file is generated in alembic/versions/
**And** The migration includes CREATE TABLE statements for users, chat_sessions, messages
**And** Foreign keys are properly defined with CASCADE DELETE
**And** Indexes are created: idx_users_username, idx_users_email, idx_chat_sessions_user_id, idx_messages_session_id

**When** I run `alembic upgrade head`
**Then** all tables are created in PostgreSQL
**And** I can query the alembic_version table to verify migration status

**Technical Implementation:**
- Install Alembic: `pip install alembic`
- Initialize: `alembic init alembic`
- Configure alembic.ini with sqlalchemy.url from environment
- Create app/models/user.py with User model (id, username, email, hashed_password, is_active, created_at, updated_at)
- Create app/models/chat_session.py with ChatSession model (id, user_id FK, title, created_at, updated_at)
- Create app/models/message.py with Message model (id, session_id FK, role ENUM, content, created_at)
- Update alembic/env.py to import Base and all models
- Configure async database engine with asyncpg
- Create indexes as per architecture document

**Prerequisites:** Story 1.2 (Backend project exists)

---

### Story 1.4: Docker Compose Multi-Container Orchestration

As a developer,
I want all services running in Docker containers with one command,
So that deployment is consistent across development and production environments.

**Acceptance Criteria:**

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

**Technical Implementation:**
- Create docker-compose.yml with 4 services
- Create frontend/Dockerfile (multi-stage: deps, build, production)
- Create backend/Dockerfile (Python base, install deps, run uvicorn)
- Create nginx/Dockerfile and nginx.conf with routing rules
- Configure frontend service: build context, ports, env vars (NEXT_PUBLIC_API_URL)
- Configure backend service: build context, ports, env vars (DATABASE_URL, SECRET_KEY, OPENAI_API_KEY), depends_on db
- Configure db service: postgres:15-alpine, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, volume mount
- Configure nginx service: proxy_pass rules for / → frontend:3000, /api/ → backend:8000
- Create .env.example template with all required variables
- Add docker-entrypoint.sh to backend for running migrations before uvicorn starts
- Configure Docker networks and volumes
- Add healthcheck commands for each service

**Prerequisites:** Story 1.1, 1.2, 1.3 (All projects initialized)

---

### Story 1.5: Environment Variable Management

As a developer,
I want secure environment variable management with clear templates,
So that secrets are never committed to git and configuration is straightforward.

**Acceptance Criteria:**

**Given** the project requires sensitive configuration
**When** I set up environment variable management
**Then** .env.example files exist in root, frontend/, and backend/ directories

**And** .env is listed in .gitignore (never committed)
**And** .env.example documents all required variables with descriptions
**And** Backend .env.example includes: DATABASE_URL, POSTGRES_*, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, OPENAI_API_KEY, ALLOWED_ORIGINS, DEBUG, LOG_LEVEL
**And** Frontend .env.example includes: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL
**And** Root .env.example includes all variables for docker-compose

**When** I copy .env.example to .env and fill in values
**Then** I can generate SECRET_KEY with: `openssl rand -hex 32`
**And** Docker Compose loads variables from .env file
**And** Backend reads config via Pydantic BaseSettings (app/config.py)
**And** Frontend accesses NEXT_PUBLIC_* variables at build time
**And** All services start successfully with configured values

**When** I run the application
**Then** Backend connects to PostgreSQL using DATABASE_URL
**And** JWT tokens are signed with SECRET_KEY
**And** OpenAI API calls use OPENAI_API_KEY
**And** Frontend API client uses NEXT_PUBLIC_API_URL
**And** CORS allows requests from ALLOWED_ORIGINS only

**Technical Implementation:**
- Create .env.example in project root with comprehensive comments
- Create frontend/.env.example with NEXT_PUBLIC_* variables
- Create backend/.env.example with backend-specific variables
- Add .env to .gitignore (all directories)
- Create app/config.py with Pydantic BaseSettings class
- Configure docker-compose.yml to use env_file: .env
- Add environment variable validation on application startup
- Document SECRET_KEY generation command in .env.example
- Create setup instructions in README.md
- Add error handling for missing required environment variables

**Prerequisites:** Story 1.4 (Docker Compose structure exists)

---

### Story 1.6: Logging and Monitoring Foundation

As a developer,
I want structured logging configured across all services,
So that debugging and troubleshooting are efficient.

**Acceptance Criteria:**

**Given** the application needs observability
**When** I configure logging for backend and frontend
**Then** Python logging module is configured in app/utils/logger.py

**And** Log format includes: timestamp, module, level, message
**And** Log levels are configurable via LOG_LEVEL environment variable
**And** Backend logs to stdout (captured by Docker)
**And** Frontend uses console methods (log, error, warn) wrapped in lib/logger.ts
**And** Structured logging includes context: user_id, request_id, session_id where applicable

**When** I run the application in Docker
**Then** Backend logs appear in `docker-compose logs backend`
**And** Log levels work correctly: DEBUG, INFO, WARNING, ERROR, CRITICAL
**And** Exceptions include stack traces with exc_info=True
**And** Docker log driver is json-file with max-size: 10m, max-file: 3

**When** an error occurs
**Then** Backend logs ERROR level with full context
**And** Frontend logs to browser console
**And** User-friendly error messages are shown to users (not stack traces)
**And** Technical details are logged for developer troubleshooting

**Technical Implementation:**
- Create app/utils/logger.py with configured Python logger
- Set log format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
- Configure handlers: StreamHandler (stdout)
- Add context filters for user_id, request_id
- Create frontend lib/logger.ts wrapper for console methods
- Configure Docker logging drivers in docker-compose.yml
- Add LOG_LEVEL to .env configuration
- Document logging patterns in architecture docs
- Create error logging middleware for FastAPI
- Add logging to all routers: INFO for requests, ERROR for exceptions

**Prerequisites:** Story 1.5 (Environment variables configured)

---

### Story 1.7: API Documentation and Health Checks

As a developer,
I want auto-generated API documentation and health check endpoints,
So that API contracts are clear and service health is monitorable.

**Acceptance Criteria:**

**Given** FastAPI auto-generates OpenAPI documentation
**When** I access the API documentation endpoints
**Then** Swagger UI is available at http://localhost/api/docs

**And** ReDoc alternative docs are available at http://localhost/api/redoc
**And** OpenAPI schema is available at http://localhost/api/openapi.json
**And** All endpoints are documented with descriptions
**And** Request/response schemas are auto-generated from Pydantic models
**And** Authentication requirements are clearly marked
**And** Example requests and responses are shown

**When** I create a health check endpoint
**Then** GET /api/health returns 200 OK with status: "healthy"
**And** GET /api/health includes: database connection status, timestamp, version
**And** Health check endpoint does not require authentication
**And** Nginx can use /api/health for upstream health checks

**When** Docker containers are running
**Then** Health checks run automatically every 30 seconds
**And** Unhealthy containers are restarted automatically
**And** I can check service health with `docker-compose ps`

**Technical Implementation:**
- FastAPI automatically generates /docs and /redoc endpoints
- Create app/routers/health.py with health check endpoint
- Health check queries database: `SELECT 1` to verify connection
- Return JSON: `{"status": "healthy", "database": "connected", "timestamp": "...", "version": "1.0.0"}`
- Configure response_model and tags for all routers
- Add descriptions to @router decorators and endpoint functions
- Configure OpenAPI metadata in app/main.py (title, description, version)
- Add healthcheck directives to docker-compose.yml services
- Document API endpoints in docs/api/endpoints.md
- Add response examples using OpenAPI response examples

**Prerequisites:** Story 1.6 (Logging configured)

---

## Epic 2: User Authentication & Account Management

**Epic Goal:** Enable users to securely create accounts, log in, and manage their profiles. Users can register with email/password, receive JWT tokens for authentication, and access protected areas of the application.

**User Value:** Users have secure, personalized accounts that protect their chat history and enable them to access the platform from any device.

**FRs Covered:** FR1 (Registration & Authentication), FR8 (User Profile), FR9 (Error Handling), FR10 (Security)

---

### Story 2.1: User Registration Backend API

As a new user,
I want to register an account with username, email, and password,
So that I can create a secure personal account for using the chatbot.

**Acceptance Criteria:**

**Given** the backend API is running
**When** I send POST /api/auth/register with valid data
**Then** the request is validated using Pydantic UserRegister schema

**And** username is validated: 3-50 characters, alphanumeric + underscore
**And** email is validated: RFC 5322 format, max 255 characters
**And** password is validated: min 8 characters, uppercase, lowercase, digit
**And** username uniqueness is checked in database
**And** email uniqueness is checked in database
**And** password is hashed with bcrypt (cost factor 12)
**And** user record is created in users table with hashed_password
**And** is_active is set to true, created_at and updated_at are set
**And** response returns 201 status with user object (id, username, email, createdAt)
**And** password is NEVER included in response

**When** I send duplicate username or email
**Then** response returns 409 Conflict
**And** error message indicates which field is duplicate: "Username already taken" or "Email already exists"
**And** error code is DUPLICATE_USERNAME or DUPLICATE_EMAIL

**When** I send invalid data (short password, invalid email)
**Then** response returns 400 Bad Request
**And** error details include field name and validation message
**And** error code is VALIDATION_ERROR

**Technical Implementation:**
- Create app/schemas/auth.py with UserRegister schema (username, email, password fields with Field validators)
- Create app/schemas/user.py with UserResponse schema (id, username, email, is_active, created_at) with alias for camelCase
- Create app/auth/password.py with hash_password(password: str) using passlib bcrypt
- Create app/services/auth_service.py with register_user(db, user_data) function
- Create app/auth/router.py with POST /api/auth/register endpoint
- Query database for existing username/email before creation
- Raise HTTPException(409) for duplicate, HTTPException(400) for validation
- Use response_model=UserResponse to exclude password from response
- Log registration events: INFO level with username (not password)
- Add error handling for database errors
- Return standardized error format per architecture Decision 3.1

**Prerequisites:** Epic 1 complete (Database and API infrastructure ready)

---

### Story 2.2: User Login and JWT Token Generation

As a registered user,
I want to log in with my username and password to receive an access token,
So that I can authenticate my requests to protected endpoints.

**Acceptance Criteria:**

**Given** I have a registered account
**When** I send POST /api/auth/login with valid credentials
**Then** the request is validated using Pydantic LoginRequest schema (username, password)

**And** user is retrieved from database by username
**And** password is verified using bcrypt.verify() against hashed_password
**And** JWT token is generated with payload: {"sub": user_id, "exp": expiration_timestamp, "iat": issued_at_timestamp}
**And** token is signed with SECRET_KEY using HS256 algorithm
**And** token expiration is set to 30 minutes from issue time
**And** response returns 200 with: {"accessToken": token, "tokenType": "Bearer", "expiresIn": 1800, "user": {...}}
**And** user object includes: id, username, email (no password)

**When** I send invalid credentials (wrong password or non-existent user)
**Then** response returns 401 Unauthorized
**And** error message is generic: "Invalid username or password" (don't reveal which field is wrong)
**And** error code is AUTHENTICATION_FAILED
**And** failed login attempt is logged with username and IP address

**When** I send malformed request (missing fields)
**Then** response returns 400 Bad Request
**And** validation error details are provided

**Technical Implementation:**
- Create app/schemas/auth.py with LoginRequest schema (username, password)
- Create app/schemas/auth.py with LoginResponse schema (accessToken, tokenType, expiresIn, user)
- Create app/auth/password.py with verify_password(plain_password, hashed_password) using bcrypt.verify()
- Create app/auth/jwt_handler.py with create_access_token(data: dict) function
- Use python-jose jwt.encode() with SECRET_KEY from config
- Set token expiration: datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
- Create app/services/auth_service.py with authenticate_user(db, username, password) function
- Create POST /api/auth/login endpoint in app/auth/router.py
- Return 401 for any authentication failure (timing-safe to prevent user enumeration)
- Log successful logins: INFO level
- Log failed logins: WARNING level with username and attempt details
- Configure OAuth2PasswordBearer scheme for token validation

**Prerequisites:** Story 2.1 (User registration works)

---

### Story 2.3: JWT Token Validation and Protected Routes

As an authenticated user,
I want my JWT token to be validated on protected endpoints,
So that only I can access my personal data and chat sessions.

**Acceptance Criteria:**

**Given** I have a valid JWT token from login
**When** I send a request to a protected endpoint with Authorization: Bearer {token} header
**Then** the token is extracted from Authorization header

**And** token signature is verified using SECRET_KEY
**And** token expiration (exp claim) is checked against current time
**And** user_id is extracted from token payload (sub claim)
**And** user is loaded from database by user_id
**And** user object is available in request context for endpoint handler
**And** request proceeds to endpoint handler with authenticated user

**When** I send a request without Authorization header
**Then** response returns 401 Unauthorized
**And** error message is "Not authenticated"
**And** error code is UNAUTHORIZED

**When** I send a request with expired token
**Then** response returns 401 Unauthorized
**And** error message is "Token expired"
**And** error code is TOKEN_EXPIRED

**When** I send a request with invalid token (malformed, wrong signature)
**Then** response returns 401 Unauthorized
**And** error message is "Invalid token"
**And** error code is TOKEN_INVALID

**When** token is valid but user no longer exists in database
**Then** response returns 401 Unauthorized
**And** error message is "User not found"

**Technical Implementation:**
- Create app/auth/dependencies.py with get_current_user() dependency
- Use OAuth2PasswordBearer(tokenUrl="/api/auth/login") for token extraction
- Implement token validation: jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
- Catch JWTError for invalid/expired tokens
- Raise HTTPException(401) with appropriate error details
- Query database for user by user_id from token
- Return User object from get_current_user dependency
- Use Depends(get_current_user) on all protected endpoints
- Create get_current_active_user() wrapper to check is_active=true
- Log token validation failures: WARNING level
- Handle all token-related exceptions with standardized error format

**Prerequisites:** Story 2.2 (JWT token generation works)

---

### Story 2.4: User Registration Frontend Form

As a new user,
I want a clean registration form to create my account,
So that I can easily sign up for the chatbot service.

**Acceptance Criteria:**

**Given** I access the registration page at /register
**When** the page loads
**Then** I see an Ant Design Form with three fields: username, email, password

**And** form uses Ant Design Input components with proper labels
**And** password field uses Input.Password with visibility toggle
**And** form has client-side validation rules matching backend requirements
**And** username validation: required, min 3 chars, max 50 chars, pattern: alphanumeric + underscore
**And** email validation: required, type: email
**And** password validation: required, min 8 chars, custom validator for uppercase/lowercase/digit
**And** real-time validation feedback shows on field blur
**And** submit button is Ant Design Button with loading state

**When** I fill in valid data and submit
**Then** form shows loading state on submit button
**And** POST /api/auth/register is called with form data
**And** on success (201), Ant Design message.success("Registration successful") is shown
**And** I am redirected to /login page after 1 second
**And** loading state is cleared

**When** backend returns validation error (400)
**Then** Ant Design message.error() shows the error message
**And** form fields show error state for relevant fields
**And** loading state is cleared

**When** backend returns duplicate error (409)
**Then** Ant Design message.error() shows "Username already taken" or "Email already exists"
**And** relevant form field shows error state
**And** loading state is cleared

**When** network error occurs
**Then** Ant Design message.error("Unable to register. Please try again.") is shown
**And** loading state is cleared

**Technical Implementation:**
- Create frontend/src/app/(auth)/register/page.tsx with registration form
- Import Form, Input, Button, message from 'antd'
- Use Form.useForm() hook for form instance
- Define form validation rules using Ant Design rules array
- Create custom password validator: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
- Create types/auth.types.ts with RegisterData interface
- Create services/auth.service.ts with register(data: RegisterData) function
- Use lib/api-client.ts axios instance for API calls
- Handle form submission with try-catch-finally
- Set loading state in try block, clear in finally block
- Use router.push('/login') for navigation after success
- Display error messages using Ant Design message component
- Extract error messages with getErrorMessage() utility
- Add link to login page: "Already have an account? Log in"

**Prerequisites:** Epic 1 complete, Story 2.1 (Registration API ready)

---

### Story 2.5: User Login Frontend Form

As a registered user,
I want a clean login form to access my account,
So that I can authenticate and use the chatbot.

**Acceptance Criteria:**

**Given** I access the login page at /login
**When** the page loads
**Then** I see an Ant Design Form with two fields: username, password

**And** form uses Ant Design Input components with proper labels
**And** password field uses Input.Password with visibility toggle
**And** form has validation rules: both fields required
**And** submit button is Ant Design Button with loading state
**And** "Remember me" checkbox is shown (UI only, no functionality yet)
**And** link to /register is visible: "Don't have an account? Sign up"

**When** I fill in valid credentials and submit
**Then** form shows loading state on submit button
**And** POST /api/auth/login is called with credentials
**And** on success (200), access token is extracted from response
**And** token is stored in localStorage with key 'access_token'
**And** user object is stored in localStorage with key 'user'
**And** Ant Design message.success("Login successful") is shown
**And** I am redirected to /chat page
**And** loading state is cleared

**When** backend returns authentication error (401)
**Then** Ant Design message.error("Invalid username or password") is shown
**And** password field is cleared for security
**And** focus returns to username field
**And** loading state is cleared

**When** backend returns other error
**Then** Ant Design message.error() shows the error message
**And** loading state is cleared

**When** network error occurs
**Then** Ant Design message.error("Unable to login. Please check your connection.") is shown
**And** loading state is cleared

**Technical Implementation:**
- Create frontend/src/app/(auth)/login/page.tsx with login form
- Import Form, Input, Button, Checkbox, message from 'antd'
- Use Form.useForm() hook for form instance
- Create types/auth.types.ts with LoginCredentials interface
- Create services/auth.service.ts with login(credentials) function
- Store token: localStorage.setItem('access_token', response.data.accessToken)
- Store user: localStorage.setItem('user', JSON.stringify(response.data.user))
- Handle form submission with try-catch-finally
- Clear password field on 401 error: form.setFieldsValue({password: ''})
- Use router.push('/chat') for navigation after success
- Display error messages using Ant Design message component
- Add "Forgot password?" link (disabled for MVP, shows "Coming soon")
- Style form with Ant Design layout and spacing utilities

**Prerequisites:** Story 2.2 (Login API ready), Story 2.4 (Registration form as reference)

---

### Story 2.6: Axios Interceptors for Token Management

As an authenticated user,
I want my JWT token automatically included in all API requests,
So that I don't have to manually add authentication headers.

**Acceptance Criteria:**

**Given** I have logged in and have a token in localStorage
**When** I make any API request using the axios client
**Then** request interceptor automatically adds Authorization header

**And** header format is: "Bearer {token}"
**And** token is retrieved from localStorage key 'access_token'
**And** if token doesn't exist, header is not added
**And** request proceeds with token injected

**When** API returns 401 Unauthorized response
**Then** response interceptor catches the error globally
**And** token is removed from localStorage (both 'access_token' and 'user')
**And** user is redirected to /login page
**And** Ant Design message.warning("Session expired. Please login again.") is shown
**And** original request is not retried

**When** API returns other error status (400, 403, 404, 500, etc.)
**Then** error is propagated to caller for component-level handling
**And** no automatic logout occurs

**When** network error occurs (no response)
**Then** error is propagated to caller
**And** no automatic logout occurs

**Technical Implementation:**
- Create frontend/src/lib/api-client.ts with axios instance
- Configure baseURL: process.env.NEXT_PUBLIC_API_URL
- Add request interceptor: apiClient.interceptors.request.use()
- Get token: localStorage.getItem('access_token')
- Set header: config.headers.Authorization = `Bearer ${token}`
- Add response interceptor: apiClient.interceptors.response.use()
- Check error.response?.status === 401 in error handler
- Clear storage: localStorage.removeItem('access_token'), localStorage.removeItem('user')
- Use window.location.href = '/login' for redirect (client-side)
- Show message: message.warning() before redirect
- Export configured axios instance as default
- Use this instance in all service files (auth.service.ts, chat.service.ts, etc.)
- Handle edge case: avoid redirect loop if already on /login page

**Prerequisites:** Story 2.5 (Login flow works), lib/api-client.ts exists

---

### Story 2.7: Auth Context and useAuth Hook

As a developer,
I want centralized auth state management with React Context,
So that auth status is consistent across all components.

**Acceptance Criteria:**

**Given** the application needs global auth state
**When** I create AuthContext and AuthProvider
**Then** AuthContext provides: user, isAuthenticated, isLoading, login, logout, register

**And** AuthProvider wraps the app in app/layout.tsx
**And** user state is initialized from localStorage on mount
**And** isAuthenticated is computed from user existence
**And** isLoading is true during initialization, false after

**When** login() method is called
**Then** auth.service.login() is called with credentials
**And** on success, user and token are stored in state and localStorage
**And** isAuthenticated becomes true
**And** caller receives success response

**When** register() method is called
**Then** auth.service.register() is called with user data
**And** on success, user is created but NOT automatically logged in
**And** caller handles redirect to login page

**When** logout() method is called
**Then** user and token are cleared from state
**And** localStorage is cleared (access_token, user)
**And** user is redirected to /login page
**And** isAuthenticated becomes false

**When** component uses useAuth() hook
**Then** current auth context values are returned
**And** TypeScript types are properly inferred
**And** error is thrown if used outside AuthProvider

**Technical Implementation:**
- Create frontend/src/contexts/AuthContext.tsx
- Define AuthContextType interface: { user, isAuthenticated, isLoading, login, logout, register }
- Create AuthContext with createContext<AuthContextType>()
- Implement AuthProvider component with useState for user and isLoading
- useEffect on mount: load user from localStorage, set isLoading false
- Implement login function: call API, store token/user, update state
- Implement register function: call API, return result (no auto-login)
- Implement logout function: clear state, clear localStorage, redirect
- Export useAuth() custom hook: useContext(AuthContext) with error handling
- Wrap app in app/layout.tsx with AuthProvider
- Use 'use client' directive in AuthContext.tsx
- Handle hydration mismatch: don't render until client-side
- Add error boundaries for auth context failures

**Prerequisites:** Story 2.6 (API client ready), Story 2.5 (Login works)

---

### Story 2.8: Protected Route Guard Component

As a user,
I want unauthorized access to protected pages blocked,
So that my chat data remains secure and login is enforced.

**Acceptance Criteria:**

**Given** protected pages exist (/chat, /profile, etc.)
**When** I access a protected page without being logged in
**Then** AuthGuard component checks authentication status

**And** if not authenticated, I am redirected to /login page
**And** original URL is saved as redirect parameter: /login?redirect=/chat
**And** Ant Design message.warning("Please login to continue") is shown

**When** I log in after redirect
**Then** after successful login, I am redirected to original destination
**And** if no redirect parameter, default to /chat page

**When** I am authenticated
**Then** AuthGuard allows rendering of protected content
**And** no redirect occurs
**And** page content is displayed normally

**When** authentication status is loading
**Then** AuthGuard shows Ant Design Spin component with loading message
**And** protected content is not rendered until auth check completes
**And** no redirect occurs during loading state

**Technical Implementation:**
- Create frontend/src/components/auth/AuthGuard.tsx
- Accept children prop: ReactNode
- Use useAuth() hook to get isAuthenticated, isLoading
- Use useRouter() for navigation and useSearchParams() for redirect param
- If isLoading: return <Spin size="large" tip="Checking authentication..." />
- If !isAuthenticated: save current path, redirect to /login?redirect={currentPath}
- If isAuthenticated: return children
- Update login page to read redirect parameter from URL
- After successful login, redirect to redirect param or default /chat
- Wrap chat pages with AuthGuard: <AuthGuard><ChatPage /></AuthGuard>
- Use 'use client' directive
- Handle edge cases: avoid redirect loop, handle invalid redirect URLs
- Show loading state with proper centering and styling

**Prerequisites:** Story 2.7 (Auth context ready)

---

### Story 2.9: User Profile Display

As an authenticated user,
I want to view my profile information,
So that I can see my account details and usage statistics.

**Acceptance Criteria:**

**Given** I am logged in
**When** I access /profile page or user menu
**Then** I see my profile information displayed

**And** profile shows: username, email, account creation date
**And** profile shows: is_active status
**And** profile uses Ant Design Descriptions component for layout
**And** dates are formatted in Vietnamese locale: "dd/mm/yyyy HH:mm"

**When** I request my profile from backend
**Then** GET /api/users/me endpoint returns my user data
**And** endpoint requires authentication (uses get_current_user dependency)
**And** response includes: id, username, email, isActive, createdAt, updatedAt
**And** password is never included in response

**When** profile page loads
**Then** user data is fetched from API
**And** loading state shows Ant Design Skeleton during fetch
**And** on success, profile information is displayed
**And** on error, Ant Design message.error() shows error message

**When** I click logout button
**Then** logout() from useAuth is called
**And** I am redirected to /login page
**And** session is cleared

**Technical Implementation:**
- Create backend GET /api/users/me endpoint in app/users/router.py
- Use current_user = Depends(get_current_user) for authentication
- Return UserResponse schema (excludes password)
- Create frontend /profile page in src/app/profile/page.tsx
- Use AuthGuard to protect route
- Create service method: userService.getProfile()
- Use useState for profile data and loading state
- Use useEffect to fetch profile on mount
- Display with Ant Design Descriptions component
- Format dates: new Date(user.createdAt).toLocaleDateString('vi-VN')
- Add logout button with confirmation modal: "Are you sure you want to logout?"
- Show Skeleton placeholder during loading
- Handle errors gracefully with message component
- Style page with proper spacing and layout

**Prerequisites:** Story 2.8 (Auth guard ready), Story 2.7 (Auth context ready)

---

## Epic 3: Basic AI Chat Conversation

**Epic Goal:** Enable users to have meaningful, context-aware conversations with GPT-4 through a clean chat interface. Users can send messages, receive AI responses, and see conversation history persisted in the database.

**User Value:** Users can interact with a powerful AI assistant for learning, problem-solving, and exploration. Conversations are saved and can be referenced later.

**FRs Covered:** FR2 (Chat Interface), FR3 (AI Integration), FR6 (Chat History Persistence), FR9 (Error Handling)

---

### Story 3.1: LangChain Service Setup with GPT-4

As a developer,
I want LangChain integrated with OpenAI GPT-4,
So that the backend can generate intelligent AI responses.

**Acceptance Criteria:**

**Given** LangChain and OpenAI packages are installed
**When** I configure the LangChain service
**Then** ChatOpenAI is initialized with GPT-4 model

**And** API key is loaded from OPENAI_API_KEY environment variable
**And** model name is set to "gpt-4" or "gpt-4-turbo-preview"
**And** temperature is configurable (default: 0.7 for balanced creativity)
**And** max_tokens is set to reasonable limit (default: 1000)
**And** streaming is enabled for future WebSocket support
**And** LangChain service is created as singleton in app/langchain_core/chain.py

**When** I create a conversation chain
**Then** ConversationChain is initialized with ChatOpenAI llm
**And** ConversationBufferMemory is configured for chat history
**And** memory has return_messages=True for proper formatting
**And** Custom prompt template is set (optional: "You are a helpful AI assistant...")
**And** chain is ready to process user messages

**When** I test the chain with a message
**Then** AI response is generated successfully
**And** response time is < 5 seconds for typical queries
**And** errors from OpenAI API are caught and logged
**And** rate limit errors return appropriate error message
**And** service degrades gracefully if API is unavailable

**Technical Implementation:**
- Create app/langchain_core/chain.py module
- Import ChatOpenAI from langchain_openai
- Import ConversationChain, ConversationBufferMemory from langchain.chains, langchain.memory
- Initialize ChatOpenAI: ChatOpenAI(api_key=settings.openai_api_key, model="gpt-4", temperature=0.7, streaming=True)
- Create function: create_conversation_chain() returns configured ConversationChain
- Set up memory: ConversationBufferMemory(return_messages=True, memory_key="history")
- Configure custom prompt template (optional): PromptTemplate with system message
- Add error handling: try-except for openai.error.RateLimitError, APIError, etc.
- Log all AI requests: INFO level with user_id, message preview (not full message for privacy)
- Log errors: ERROR level with full exception details
- Add configuration options in app/config.py: OPENAI_MODEL, OPENAI_TEMPERATURE, OPENAI_MAX_TOKENS
- Create health check: test OpenAI API connectivity

**Prerequisites:** Epic 1 complete (OPENAI_API_KEY configured), Epic 2 complete (Auth ready)

---

### Story 3.2: Chat Session Creation and Management Backend

As a user,
I want to create chat sessions to organize my conversations,
So that I can maintain context and separate different topics.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I send POST /api/chat/sessions
**Then** a new chat session is created in chat_sessions table

**And** session is associated with my user_id (from JWT token)
**And** title is set to provided value or default "New Conversation"
**And** created_at and updated_at are set to current timestamp
**And** response returns 201 with session object: {id, title, createdAt, updatedAt}

**When** I send GET /api/chat/sessions
**Then** all my chat sessions are returned
**And** sessions are ordered by updated_at DESC (most recent first)
**And** query supports pagination: ?limit=20&offset=0
**And** response includes total count and sessions array
**And** only my sessions are returned (filtered by user_id from token)

**When** I send GET /api/chat/sessions/{session_id}
**Then** session details are returned with message history
**And** messages are ordered by created_at ASC (chronological)
**And** response includes: session metadata + messages array
**And** 404 is returned if session doesn't exist
**And** 403 is returned if session belongs to another user

**When** I send DELETE /api/chat/sessions/{session_id}
**Then** session and all associated messages are deleted (CASCADE)
**And** response returns 200 with success message
**And** 404 is returned if session doesn't exist
**And** 403 is returned if session belongs to another user

**Technical Implementation:**
- Create app/schemas/chat.py with ChatSessionCreate, ChatSessionResponse, ChatSessionList schemas
- Create app/services/chat_service.py with session CRUD functions
- Create app/chat/router.py with session endpoints
- POST /api/chat/sessions: create_session(db, current_user, session_data)
- GET /api/chat/sessions: get_user_sessions(db, current_user, limit, offset)
- GET /api/chat/sessions/{session_id}: get_session_with_messages(db, current_user, session_id)
- DELETE /api/chat/sessions/{session_id}: delete_session(db, current_user, session_id)
- All endpoints use Depends(get_current_user) for authentication
- Verify session ownership: session.user_id == current_user.id
- Raise HTTPException(403) for unauthorized access
- Raise HTTPException(404) for not found
- Log session operations: INFO level with user_id, session_id
- Use SQLAlchemy async queries with proper error handling

**Prerequisites:** Story 3.1 (LangChain ready), Database schema (chat_sessions table)

---

### Story 3.3: Send Message and Generate AI Response Backend

As a user,
I want to send a message and receive an AI response,
So that I can have a conversation with the chatbot.

**Acceptance Criteria:**

**Given** I have a chat session created
**When** I send POST /api/chat/sessions/{session_id}/messages with {content: "my message"}
**Then** my message is validated: content required, max 10,000 characters

**And** session ownership is verified (session.user_id == current_user.id)
**And** user message is saved to messages table with role="user"
**And** conversation history is loaded from database (last 20 messages)
**And** history is formatted for LangChain ConversationBufferMemory
**And** LangChain chain is invoked with user message and loaded memory
**And** AI response is generated using GPT-4
**And** AI response is saved to messages table with role="assistant"
**And** session updated_at timestamp is updated
**And** response returns 200 with both messages: {userMessage: {...}, assistantMessage: {...}}

**When** OpenAI API fails
**Then** user message is still saved to database
**And** error is logged with full details
**And** response returns 500 with error code AI_API_ERROR
**And** error message is user-friendly: "AI service temporarily unavailable. Please try again."

**When** rate limit is hit
**Then** response returns 429 with error code AI_RATE_LIMIT
**And** error message includes retry guidance

**When** session doesn't exist or I don't own it
**Then** response returns 404 or 403 appropriately
**And** no message is saved

**Technical Implementation:**
- Create app/schemas/chat.py with MessageCreate, MessageResponse schemas
- Create POST /api/chat/sessions/{session_id}/messages endpoint
- Verify session exists and user owns it
- Save user message: Message(session_id=session_id, role="user", content=content)
- Load conversation history: query messages table filtered by session_id, order by created_at, limit 20
- Format history for LangChain: [HumanMessage(content=...), AIMessage(content=...), ...]
- Create ConversationBufferMemory and load history
- Create conversation chain with loaded memory
- Invoke chain: chain.predict(input=user_message)
- Save AI response: Message(session_id=session_id, role="assistant", content=ai_response)
- Update session: session.updated_at = datetime.utcnow()
- Commit transaction
- Handle OpenAI errors: catch RateLimitError, APIError, APIConnectionError
- Log all interactions: INFO level (user_id, session_id, message length, response time)
- Return both message objects in response

**Prerequisites:** Story 3.2 (Session management ready), Story 3.1 (LangChain configured)

---

### Story 3.4: Basic Chat Interface Frontend Component

As a user,
I want a clean chat interface to view and send messages,
So that I can easily interact with the AI chatbot.

**Acceptance Criteria:**

**Given** I am on the chat page
**When** the interface loads
**Then** I see three main areas: message list, input area, loading indicator

**And** message list displays all messages in chronological order
**And** user messages are styled differently from AI messages (alignment, color)
**And** user messages align right with blue background
**And** AI messages align left with gray background
**And** each message shows content and timestamp
**And** message list auto-scrolls to bottom when new message arrives
**And** loading indicator shows during AI response generation

**When** I type a message in the input field
**Then** input field uses Ant Design Input.TextArea
**And** input field has placeholder: "Type your message..."
**And** input field supports multi-line text
**And** input field has max length: 10,000 characters
**And** character count is displayed: "0 / 10000"
**And** Enter key sends message, Shift+Enter creates new line

**When** I click Send button
**Then** message is sent via API
**And** send button shows loading state during request
**And** user message appears immediately in chat (optimistic update)
**And** input field is cleared after send
**And** focus returns to input field
**And** AI response appears when received from backend
**And** loading indicator shows "AI is thinking..."

**When** API returns error
**Then** Ant Design message.error() shows error message
**And** user message remains in input (not cleared) for retry
**And** loading state is cleared

**Technical Implementation:**
- Create frontend/src/components/chat/ChatInterface.tsx
- Use Ant Design Layout, Input.TextArea, Button, List, Spin, Typography components
- Create state: messages array, inputValue, isLoading
- Create MessageBubble sub-component for rendering individual messages
- Style user messages: text-align: right, background: blue, border-radius
- Style AI messages: text-align: left, background: gray, border-radius
- Use useRef for message list container, scrollIntoView for auto-scroll
- Handle form submission: preventDefault, validate input, call API
- Optimistic update: add user message to state immediately
- After API success: add AI message to state
- Handle keyboard: onKeyDown check for Enter without Shift
- Show character count: inputValue.length / 10000
- Display Spin component during isLoading
- Format timestamps: formatDistanceToNow() from date-fns or custom formatter
- Make responsive: mobile-friendly layout with proper spacing

**Prerequisites:** Story 3.3 (Message API ready), Ant Design setup

---

### Story 3.5: Chat Service and API Integration Frontend

As a developer,
I want chat service methods for all chat operations,
So that API calls are organized and reusable.

**Acceptance Criteria:**

**Given** chat API endpoints are available
**When** I create chat service
**Then** chatService exports all necessary methods

**And** createSession(title?: string) creates new chat session
**And** getSessions(limit?: number, offset?: number) fetches user's sessions
**And** getSession(sessionId: string) fetches session with messages
**And** deleteSession(sessionId: string) deletes a session
**And** sendMessage(sessionId: string, content: string) sends message and gets AI response
**And** all methods use lib/api-client axios instance with auth token
**And** all methods are type-safe with TypeScript interfaces
**And** all methods handle errors and return proper types

**When** methods are called
**Then** proper HTTP methods are used: POST for create, GET for read, DELETE for delete
**And** request payloads match backend API expectations
**And** response data is typed with interfaces from types/chat.types.ts
**And** errors are thrown with proper error objects for handling in components

**Technical Implementation:**
- Create frontend/src/services/chat.service.ts
- Import apiClient from lib/api-client
- Define types in types/chat.types.ts: ChatSession, Message, SendMessageResponse, etc.
- Implement createSession: POST /api/chat/sessions with optional title
- Implement getSessions: GET /api/chat/sessions with query params
- Implement getSession: GET /api/chat/sessions/{sessionId}
- Implement deleteSession: DELETE /api/chat/sessions/{sessionId}
- Implement sendMessage: POST /api/chat/sessions/{sessionId}/messages with content
- All methods return Promise with typed response data
- Use async/await pattern
- Let errors bubble up for component-level handling
- Export as default object with all methods
- Add JSDoc comments for each method

**Prerequisites:** Story 3.4 (Chat interface ready), lib/api-client setup

---

### Story 3.6: Single Session Chat Page with Auto-Create

As a user,
I want to start chatting immediately without manual session creation,
So that I can quickly begin my conversation.

**Acceptance Criteria:**

**Given** I navigate to /chat page
**When** the page loads
**Then** it checks if I have any existing sessions

**And** if no sessions exist, one is auto-created with title "New Conversation"
**And** if sessions exist, the most recent one is loaded
**And** chat interface displays with loaded session
**And** message history is loaded and displayed
**And** input field is ready for new messages

**When** I send a message
**Then** message is sent to the active session
**And** AI response is received and displayed
**And** conversation continues in same session

**When** session creation or loading fails
**Then** error message is shown with Ant Design Alert component
**And** retry button is available
**And** user can refresh page to retry

**When** I am not authenticated
**Then** AuthGuard redirects me to /login
**And** after login, I return to /chat page

**Technical Implementation:**
- Create frontend/src/app/chat/page.tsx
- Wrap with AuthGuard component
- Use useState for: currentSession, messages, isLoading
- Use useEffect on mount to initialize session:
  - Call chatService.getSessions(limit=1)
  - If sessions.length === 0: call chatService.createSession()
  - If sessions.length > 0: use sessions[0]
  - Set currentSession state
  - Load session messages if available
- Render ChatInterface component with session and messages props
- Pass sendMessage handler that calls chatService.sendMessage(currentSession.id, content)
- Handle loading state with Ant Design Skeleton or Spin
- Handle errors with Alert component and retry button
- Use 'use client' directive
- Add page title and metadata
- Style page layout with proper spacing

**Prerequisites:** Story 3.5 (Chat service ready), Story 3.4 (ChatInterface component), Story 2.8 (AuthGuard)

---

### Story 3.7: Message Display with Markdown Support

As a user,
I want AI responses to support markdown formatting,
So that code snippets, lists, and formatting are displayed properly.

**Acceptance Criteria:**

**Given** AI response contains markdown
**When** message is displayed
**Then** markdown is rendered to HTML

**And** code blocks are syntax-highlighted with proper language detection
**And** inline code has distinct background color
**And** links are clickable and open in new tab
**And** lists (ordered and unordered) are properly formatted
**And** bold, italic, and other formatting work correctly
**And** headings have appropriate sizing
**And** blockquotes have distinct styling
**And** markdown rendering is safe (sanitized to prevent XSS)

**When** message contains code
**Then** code block has copy button
**And** clicking copy button copies code to clipboard
**And** Ant Design message.success("Copied!") is shown
**And** syntax highlighting matches code language (JavaScript, Python, etc.)

**When** message is very long
**Then** message scrolls within its container
**And** max height is set to prevent UI overflow
**And** "Show more" button expands full content if needed

**Technical Implementation:**
- Install react-markdown: `npm install react-markdown remark-gfh`
- Install syntax highlighter: `npm install react-syntax-highlighter`
- Update MessageBubble component to use ReactMarkdown
- Configure remark-gfm plugin for GitHub Flavored Markdown
- Configure react-syntax-highlighter with preferred theme (e.g., dracula, vs-dark)
- Add custom renderers for code blocks with copy functionality
- Sanitize HTML: configure ReactMarkdown to disallow dangerous elements
- Style markdown elements with CSS: code blocks, blockquotes, lists
- Add copy button using Ant Design Button with CopyOutlined icon
- Implement clipboard API: navigator.clipboard.writeText()
- Handle long messages: max-height with overflow-y: auto
- Test with various markdown examples: code, lists, tables, links, images
- Ensure accessibility: proper ARIA labels, keyboard navigation

**Prerequisites:** Story 3.6 (Chat page works), Story 3.4 (MessageBubble component)

---

### Story 3.8: Conversation History Persistence and Loading

As a user,
I want my conversation history saved and loaded automatically,
So that I can continue conversations later and don't lose context.

**Acceptance Criteria:**

**Given** I have an ongoing conversation
**When** I send messages
**Then** all messages are persisted to database immediately

**And** user messages are saved before calling AI
**And** AI responses are saved after generation
**And** database transaction ensures both messages are saved or rolled back together
**And** created_at timestamps are accurate
**And** session updated_at is updated with each message

**When** I reload the page or return later
**Then** previous chat session is loaded automatically
**And** all message history is fetched from database
**And** messages display in chronological order
**And** I can continue the conversation where I left off

**When** I have a long conversation (50+ messages)
**Then** only last 20 messages are used for AI context (per architecture)
**And** all messages are still displayed in UI
**And** pagination or lazy loading can be added later if needed

**When** I close browser and come back next day
**Then** my session still exists (persisted in PostgreSQL)
**And** all messages are intact
**And** I can send new messages and conversation continues

**Technical Implementation:**
- Backend ensures proper transaction handling in sendMessage endpoint
- Use SQLAlchemy session.commit() after both messages saved
- Use try-except with rollback on failure
- Frontend loads session messages on page load: chatService.getSession(sessionId)
- Display all messages in UI, even if > 20
- Backend limits conversation memory to last 20 messages for LangChain context
- Query messages: `SELECT * FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 20` then reverse
- Test persistence: send messages, close browser, reopen, verify messages exist
- Test long conversations: create session with 50 messages, verify context window works
- Add loading state while fetching history
- Handle empty history state: show welcome message or placeholder

**Prerequisites:** Story 3.3 (Message persistence works), Story 3.6 (Chat page loads sessions)

---

### Story 3.9: Error Handling and Retry Mechanism

As a user,
I want clear error messages and retry options when things go wrong,
So that I can recover from errors without losing my work.

**Acceptance Criteria:**

**Given** an error occurs during chat operation
**When** OpenAI API is unavailable
**Then** error message says "AI service is temporarily unavailable. Please try again in a moment."

**And** my message is still saved to database
**And** I can retry sending to get AI response
**And** retry button is available next to error message

**When** network connection fails
**Then** error message says "Connection lost. Please check your internet and try again."
**And** my message is preserved in input field (not sent)
**And** I can retry when connection restored

**When** rate limit is exceeded
**Then** error message says "Too many requests. Please wait a moment and try again."
**And** message includes estimated wait time if available
**And** automatic retry after delay (optional)

**When** validation error occurs (message too long)
**Then** error shows before sending: "Message is too long. Maximum 10,000 characters."
**And** character count shows in red when limit exceeded
**And** send button is disabled when input invalid

**When** session not found error
**Then** error message says "Chat session not found. Creating a new session..."
**And** new session is auto-created
**And** user can continue chatting

**Technical Implementation:**
- Backend returns appropriate error codes: AI_API_ERROR, AI_RATE_LIMIT, VALIDATION_ERROR
- Backend includes retry-after header for rate limits
- Frontend catches all errors in try-catch blocks
- Create getErrorMessage() utility to map error codes to user-friendly messages
- Show errors with Ant Design message.error() for transient errors
- Show errors with Alert component for persistent errors (with retry button)
- Implement retry mechanism: onClick handler that resends last message
- Store last message in state for retry capability
- Validate message length before sending: if (content.length > 10000) show error
- Disable send button when validation fails
- Show character count in red when > 10000
- Add loading states to prevent multiple submissions
- Log all errors client-side for debugging
- Test various error scenarios thoroughly

**Prerequisites:** Story 3.6 (Chat page functional), Story 3.3 (API error handling)

---

## Epic 4: Multi-Session Management

**Epic Goal:** Enable users to organize conversations into multiple threads, switch between topics seamlessly, and manage their session history. Users can create, rename, delete sessions and see them organized in a sidebar.

**User Value:** Users can maintain separate conversations for different topics, easily switch context, and keep their chat history organized.

**FRs Covered:** FR5 (Multi-Session Management), FR6 (Chat History - extended)

---

### Story 4.1: Session List Sidebar Component

As a user,
I want to see all my chat sessions in a sidebar,
So that I can easily browse and switch between different conversations.

**Acceptance Criteria:**

**Given** I have multiple chat sessions
**When** I view the chat page
**Then** I see a sidebar with all my sessions listed

**And** sidebar uses Ant Design Layout.Sider component
**And** sessions are displayed in Ant Design List component
**And** each session shows: title, last message preview, last updated time
**And** sessions are sorted by updated_at DESC (most recent first)
**And** active session is highlighted with distinct background color
**And** sidebar is collapsible on mobile devices
**And** "New Chat" button is prominently displayed at top

**When** I click on a session
**Then** that session becomes active
**And** chat interface loads that session's messages
**And** URL updates to /chat/[sessionId]
**And** input field is ready for new messages

**When** I hover over a session
**Then** delete button appears on the right
**And** edit/rename button appears
**And** hover state shows with subtle background change

**When** sessions list is long
**Then** sidebar scrolls independently from chat area
**And** scroll position is preserved when switching sessions

**Technical Implementation:**
- Create frontend/src/components/chat/SessionList.tsx
- Use Ant Design Layout.Sider with collapsible prop
- Use Ant Design List with dataSource from sessions state
- Each list item renders: session title, time ago formatter, preview text
- Implement active session highlighting: check currentSessionId === session.id
- Add "New Chat" button with PlusOutlined icon at top
- onClick handler for session item: navigate to /chat/{sessionId}
- Show delete button (DeleteOutlined) and edit button (EditOutlined) on hover
- Use CSS for hover effects and transitions
- Make responsive: collapse sidebar on mobile (< 768px breakpoint)
- Add loading skeleton while sessions are fetching
- Handle empty state: show message "No conversations yet. Start a new chat!"

**Prerequisites:** Story 3.6 (Chat page exists), Story 3.2 (Session API ready)

---

### Story 4.2: Create New Session and Switch Context

As a user,
I want to create a new chat session with one click,
So that I can start a fresh conversation on a different topic.

**Acceptance Criteria:**

**Given** I am viewing any chat session
**When** I click "New Chat" button
**Then** a new session is created via API

**And** new session has default title "New Conversation"
**And** new session appears at top of session list
**And** I am automatically switched to the new session
**And** chat interface shows empty message history
**And** input field is ready and focused
**And** URL updates to /chat/{newSessionId}

**When** session creation succeeds
**Then** Ant Design message.success("New chat created") is shown briefly
**And** sidebar updates with new session
**And** new session becomes active

**When** I switch between existing sessions
**Then** previous session's state is preserved
**And** new session's messages are loaded from API
**And** loading indicator shows during message fetch
**And** input field maintains focus
**And** scroll position resets to bottom of new conversation

**When** session creation fails
**Then** error message is shown with Ant Design message.error()
**And** I remain on current session
**And** I can retry creating new session

**Technical Implementation:**
- Add "New Chat" button to SessionList component
- Button uses Ant Design Button with type="primary" and PlusOutlined icon
- onClick handler calls chatService.createSession()
- On success: add new session to sessions state, navigate to /chat/{newSessionId}
- Update chat page to use dynamic route: app/chat/[sessionId]/page.tsx
- Load session messages in useEffect when sessionId changes
- Clear previous messages before loading new ones
- Show Spin component during message loading
- Update URL with router.push() or Next.js Link
- Handle race conditions: cancel previous message fetch if session changes
- Implement session state management: use React Context or local state
- Focus input field after session switch: use useRef and .focus()

**Prerequisites:** Story 4.1 (Sidebar exists), Story 3.2 (Create session API)

---

### Story 4.3: Delete Session with Confirmation

As a user,
I want to delete chat sessions I no longer need,
So that I can keep my session list clean and organized.

**Acceptance Criteria:**

**Given** I have chat sessions
**When** I hover over a session in the sidebar
**Then** delete button (trash icon) appears

**When** I click delete button
**Then** Ant Design Modal confirmation dialog appears
**And** modal shows: "Are you sure you want to delete this conversation? This action cannot be undone."
**And** modal has "Cancel" and "Delete" buttons
**And** "Delete" button is styled as danger (red)

**When** I click "Cancel"
**Then** modal closes
**And** session is not deleted
**And** session remains in list

**When** I click "Delete"
**Then** delete API call is made
**And** modal shows loading state
**And** on success, modal closes
**And** session is removed from sidebar
**And** Ant Design message.success("Conversation deleted") is shown

**When** deleted session was active
**Then** I am switched to most recent remaining session
**And** if no sessions remain, new session is auto-created

**When** delete fails
**Then** error message is shown
**And** session remains in list
**And** modal closes

**Technical Implementation:**
- Add delete button to SessionList item with DeleteOutlined icon
- Use Ant Design Modal.confirm() for confirmation dialog
- Configure modal: title, content, okText: "Delete", okType: "danger", cancelText: "Cancel"
- onClick handler calls chatService.deleteSession(sessionId)
- On success: remove session from state, show success message
- If deleted session === currentSession: switch to sessions[0] or create new
- Handle edge case: deleting last session creates new one automatically
- Use async/await with try-catch for error handling
- Add loading state to modal during API call
- Prevent multiple delete clicks with disabled state
- Log deletion events for audit trail

**Prerequisites:** Story 4.2 (Session switching works), Story 3.2 (Delete session API)

---

### Story 4.4: Rename Session Title

As a user,
I want to rename chat sessions with meaningful titles,
So that I can identify conversations easily.

**Acceptance Criteria:**

**Given** I have a chat session
**When** I click edit button (pencil icon) next to session title
**Then** title becomes editable inline

**And** current title is selected for easy overwriting
**And** input field has max length: 255 characters
**And** input field autofocuses
**And** I can press Enter to save or Escape to cancel

**When** I enter a new title and press Enter
**Then** title is updated via API: PATCH /api/chat/sessions/{sessionId}
**And** sidebar shows updated title immediately
**And** edit mode exits
**And** Ant Design message.success("Title updated") is shown

**When** I leave title empty
**Then** validation error shows: "Title cannot be empty"
**And** title reverts to previous value

**When** I press Escape
**Then** edit mode exits without saving
**And** title remains unchanged

**When** update fails
**Then** error message is shown
**And** title reverts to previous value
**And** edit mode exits

**Technical Implementation:**
- Add edit button to SessionList item with EditOutlined icon
- Use Ant Design Input component for inline editing
- Toggle isEditing state for specific session
- onClick edit: set isEditing[sessionId] = true, focus input
- onBlur: validate and save if changed
- onKeyDown: Enter → save, Escape → cancel
- Create backend endpoint: PATCH /api/chat/sessions/{sessionId} with {title: string}
- Validate title: required, max 255 chars
- Update chatService with updateSessionTitle(sessionId, title) method
- Optimistic update: update state immediately, revert on error
- Show validation errors inline with Ant Design Form.Item error state
- Handle edge cases: empty title, very long title, special characters

**Prerequisites:** Story 4.1 (Sidebar with session list), Story 3.2 (Session endpoints)

---

### Story 4.5: Session Search and Filter

As a user,
I want to search through my chat sessions,
So that I can quickly find specific conversations.

**Acceptance Criteria:**

**Given** I have many chat sessions
**When** I see the session sidebar
**Then** search input is displayed at the top (below "New Chat")

**And** search input uses Ant Design Input.Search component
**And** search input has placeholder: "Search conversations..."
**And** search is case-insensitive
**And** search filters by session title AND message content

**When** I type in search box
**Then** session list filters in real-time
**And** matching sessions are shown
**And** non-matching sessions are hidden
**And** search term is highlighted in results

**When** no sessions match
**Then** empty state shows: "No conversations found"
**And** I can clear search to see all sessions

**When** I clear search input
**Then** all sessions are displayed again
**And** previous sort order is maintained

**Technical Implementation:**
- Add Ant Design Input.Search component to SessionList
- Use useState for searchTerm
- Filter sessions in useMemo: sessions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
- For advanced search: also search in message content (optional: requires API support)
- Highlight matching text: wrap matches in <mark> tag with CSS styling
- Debounce search input for performance: use lodash debounce or custom hook
- Show clear button (X icon) when search has value
- Handle empty results: render empty state component
- Maintain active session highlighting in search results
- Consider pagination if session count is very high

**Prerequisites:** Story 4.1 (Session list component), Story 4.2 (Multiple sessions)

---

### Story 4.6: Session Context with React Context

As a developer,
I want centralized session state management,
So that session data is consistent across all chat components.

**Acceptance Criteria:**

**Given** chat application needs session state
**When** I create ChatContext
**Then** context provides: sessions, currentSession, isLoading, createSession, deleteSession, updateSession, switchSession

**And** ChatProvider wraps chat routes
**And** sessions are loaded from API on mount
**And** currentSession is determined from URL parameter
**And** state updates propagate to all consuming components

**When** createSession is called
**Then** API creates session
**And** new session is added to sessions array
**And** currentSession is set to new session

**When** deleteSession is called
**Then** API deletes session
**And** session is removed from sessions array
**And** if deleted was current, switch to another session

**When** component uses useChatContext hook
**Then** current context values are returned
**And** TypeScript types are properly inferred

**Technical Implementation:**
- Create frontend/src/contexts/ChatContext.tsx
- Define ChatContextType interface with all methods and state
- Create ChatContext with createContext<ChatContextType>()
- Implement ChatProvider with session state management
- useEffect on mount: load sessions from chatService.getSessions()
- Implement all session methods: create, delete, update, switch
- Export useChatContext() hook with error handling if used outside provider
- Wrap chat routes with ChatProvider in app/chat/layout.tsx
- Use 'use client' directive
- Handle loading and error states
- Integrate with AuthContext: only load sessions if authenticated
- Sync currentSession with URL parameter using useParams/useSearchParams

**Prerequisites:** Story 4.5 (Multiple session features), Story 2.7 (Auth Context pattern)

---

## Epic 5: Real-time Streaming Experience

**Epic Goal:** Enable real-time streaming of AI responses character-by-character via WebSocket, providing users with an engaging, interactive experience where they see the AI "thinking" and responding in real-time.

**User Value:** Users experience immediate feedback as AI responses stream in character-by-character, making conversations feel more natural and engaging, similar to typing in a live chat.

**FRs Covered:** FR4 (WebSocket Real-time Communication)

---

### Story 5.1: WebSocket Backend Endpoint Setup

As a developer,
I want a WebSocket endpoint for streaming AI responses,
So that frontend can receive messages in real-time.

**Acceptance Criteria:**

**Given** FastAPI backend is configured
**When** I create WebSocket endpoint
**Then** endpoint is available at /api/chat/ws/{session_id}

**And** WebSocket accepts connection with query parameter: ?token={access_token}
**And** token is validated before accepting connection
**And** session ownership is verified (session.user_id == token.user_id)
**And** connection is established and enters message loop
**And** connection remains open for bidirectional communication

**When** client sends message via WebSocket
**Then** message is received as JSON: {"type": "message", "content": "user text"}
**And** message is validated and saved to database
**And** AI response is generated with streaming enabled
**And** response chunks are sent as they're generated: {"type": "chunk", "content": "partial text"}
**And** completion signal is sent when done: {"type": "done", "messageId": 123}

**When** error occurs during streaming
**Then** error message is sent: {"type": "error", "message": "...", "code": "..."}
**And** connection remains open for retry

**When** client disconnects
**Then** connection is closed gracefully
**And** resources are cleaned up
**And** disconnect is logged

**Technical Implementation:**
- Create app/chat/websocket.py with WebSocket route
- Use FastAPI WebSocketRoute decorator: @router.websocket("/ws/{session_id}")
- Accept WebSocket connection: await websocket.accept()
- Extract token from query params: token = websocket.query_params.get("token")
- Validate token using jwt_handler.decode() and get user
- Verify session ownership: session.user_id == user.id
- Enter message loop: while True: data = await websocket.receive_json()
- Parse message type and content
- Save user message to database
- Stream AI response using LangChain async streaming callbacks
- Send chunks: await websocket.send_json({"type": "chunk", "content": chunk})
- Send done: await websocket.send_json({"type": "done", "messageId": ai_message.id})
- Handle WebSocketDisconnect exception for cleanup
- Add heartbeat/ping mechanism: send ping every 30 seconds
- Log all WebSocket events: connect, message, disconnect, errors

**Prerequisites:** Epic 3 complete (Chat works), Story 3.1 (LangChain streaming capable)

---

### Story 5.2: LangChain Streaming Callbacks

As a developer,
I want LangChain to stream AI responses token-by-token,
So that WebSocket can forward chunks to frontend in real-time.

**Acceptance Criteria:**

**Given** LangChain chain is configured
**When** I enable streaming
**Then** ChatOpenAI is initialized with streaming=True

**And** custom StreamingCallbackHandler is created
**And** handler implements on_llm_new_token(token: str) method
**And** handler sends tokens via WebSocket as they arrive
**And** handler accumulates full response for database storage

**When** AI generates response
**Then** tokens are received one at a time
**And** each token is immediately sent via WebSocket
**And** tokens are accumulated into complete response
**And** complete response is saved to database after streaming finishes

**When** streaming completes
**Then** final complete message is saved
**And** done signal is sent via WebSocket
**And** callback handler is cleaned up

**Technical Implementation:**
- Import AsyncCallbackHandler from langchain.callbacks.base
- Create custom StreamingCallbackHandler(AsyncCallbackHandler) class
- Implement __init__(self, websocket): store WebSocket instance
- Implement async on_llm_new_token(self, token: str): send token via WebSocket
- Implement async on_llm_end(): handle completion
- Store accumulated tokens in self.full_response
- Configure chain with callbacks=[StreamingCallbackHandler(websocket)]
- Invoke chain with streaming: await chain.apredict(input=user_message)
- After streaming completes, save full_response to database
- Handle errors during streaming: send error message and continue
- Test with various message types to ensure proper token handling

**Prerequisites:** Story 5.1 (WebSocket endpoint ready), Story 3.1 (LangChain configured)

---

### Story 5.3: Frontend WebSocket Client Connection

As a user,
I want real-time connection to the chat backend,
So that I can see AI responses stream in as they're generated.

**Acceptance Criteria:**

**Given** I am on an active chat session
**When** chat interface loads
**Then** WebSocket connection is established

**And** connection URL is: ws://localhost/api/chat/ws/{sessionId}?token={accessToken}
**And** connection includes JWT token for authentication
**And** connection establishes successfully
**And** onopen event is handled
**And** connection state is tracked in component

**When** connection opens
**Then** isConnected state is set to true
**And** status indicator shows "Connected" (optional)

**When** I send a message
**Then** message is sent via WebSocket instead of HTTP
**And** message is sent as JSON: {"type": "message", "content": "text"}
**And** sending indicator shows immediately

**When** connection closes unexpectedly
**Then** auto-reconnect is attempted (max 3 retries)
**And** retry delay increases exponentially: 1s, 2s, 4s
**And** user is notified if reconnection fails
**And** fallback to HTTP POST is used if WebSocket unavailable

**Technical Implementation:**
- Create frontend/src/lib/websocket.ts with WebSocket client class
- Initialize WebSocket: new WebSocket(url)
- Get token from localStorage: localStorage.getItem('access_token')
- Construct URL with token: `${wsUrl}?token=${token}`
- Handle onopen: set connected state, log event
- Handle onerror: log error, attempt reconnect
- Handle onclose: implement reconnect logic with exponential backoff
- Implement sendMessage(content: string) method
- Implement close() method for cleanup
- Export WebSocketClient class
- Use in ChatInterface component: create instance in useEffect
- Cleanup on unmount: close connection
- Handle edge cases: token expiration, network issues

**Prerequisites:** Story 5.1 (Backend WebSocket ready), Story 3.6 (Chat interface)

---

### Story 5.4: Real-time Message Streaming Display

As a user,
I want to see AI responses appear character-by-character in real-time,
So that I experience natural, engaging conversations.

**Acceptance Criteria:**

**Given** WebSocket connection is established
**When** I send a message
**Then** my message appears immediately in chat (optimistic update)

**And** AI response placeholder appears with typing indicator
**And** typing indicator shows animated dots: "AI is thinking..."

**When** AI starts responding
**Then** typing indicator is replaced by message bubble
**And** message content streams in character-by-character
**And** each chunk is appended to displayed message
**And** message bubble expands smoothly as content grows
**And** cursor blinks at end of streaming text (optional animation)

**When** streaming completes
**Then** done signal is received
**And** message is marked as complete
**And** typing indicator disappears
**And** send button is re-enabled for next message
**And** message is saved to local state with message ID

**When** streaming is interrupted
**Then** partial message remains visible
**And** error indicator shows
**And** retry option is available

**Technical Implementation:**
- Update ChatInterface to use WebSocket client
- Add state: streamingMessage (string), isStreaming (boolean)
- On WebSocket message event: handle different types
- Type "chunk": append content to streamingMessage state
- Type "done": finalize message, add to messages array, clear streamingMessage
- Type "error": show error, clear streamingMessage
- Render streaming message separately from completed messages
- Use CSS animation for typing indicator: three dots with stagger animation
- Smooth text insertion: use React state updates to trigger re-renders
- Auto-scroll to bottom as message streams in
- Add visual cue: pulsing cursor or blinking effect at end of streaming text
- Disable send button while isStreaming is true
- Test with various message lengths and streaming speeds

**Prerequisites:** Story 5.3 (WebSocket client), Story 3.4 (Message display component)

---

### Story 5.5: Nginx WebSocket Proxy Configuration

As a developer,
I want Nginx to properly proxy WebSocket connections,
So that WebSocket traffic routes correctly from frontend to backend.

**Acceptance Criteria:**

**Given** Nginx reverse proxy is configured
**When** WebSocket connection is initiated
**Then** Nginx recognizes WebSocket upgrade request

**And** Connection: Upgrade header is forwarded
**And** Upgrade: websocket header is forwarded
**And** HTTP version is set to 1.1
**And** Request is proxied to backend:8000
**And** Connection remains open for bidirectional communication
**And** Long-lived connections are supported (24 hour timeout)

**When** WebSocket traffic flows
**Then** messages pass through Nginx without modification
**And** No buffering occurs for real-time transmission
**And** Both client→server and server→client messages work

**Technical Implementation:**
- Update nginx/nginx.conf with WebSocket location block
- Add location /api/chat/ws:
  - proxy_pass http://backend:8000;
  - proxy_http_version 1.1;
  - proxy_set_header Upgrade $http_upgrade;
  - proxy_set_header Connection "upgrade";
  - proxy_set_header Host $host;
  - proxy_set_header X-Real-IP $remote_addr;
  - proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  - proxy_read_timeout 86400s;
  - proxy_send_timeout 86400s;
- Rebuild nginx container to apply configuration
- Test WebSocket connection through Nginx
- Verify messages flow in both directions
- Check for connection stability over time
- Monitor Nginx logs for WebSocket-related errors

**Prerequisites:** Story 5.1 (WebSocket backend), Epic 1 (Nginx configured)

---

### Story 5.6: WebSocket Connection Resilience

As a user,
I want WebSocket connection to reconnect automatically if dropped,
So that my chat experience is uninterrupted.

**Acceptance Criteria:**

**Given** WebSocket connection is active
**When** connection drops unexpectedly
**Then** frontend detects disconnect via onclose event

**And** automatic reconnect is attempted
**And** first retry happens after 1 second
**And** subsequent retries use exponential backoff: 2s, 4s, 8s
**And** maximum retry attempts is 3
**And** user sees reconnection status: "Reconnecting..."

**When** reconnection succeeds
**Then** chat functionality resumes normally
**And** user sees success message: "Reconnected"
**And** unsent messages are sent (if any)
**And** conversation continues seamlessly

**When** all retries fail
**Then** user sees fallback message: "Connection lost. Messages will be sent via HTTP."
**And** send button switches to HTTP mode
**And** messages are sent via POST API instead of WebSocket
**And** manual reconnect button is available

**When** network returns
**Then** user can click reconnect button
**And** WebSocket connection is re-established
**And** streaming mode is restored

**Technical Implementation:**
- Implement reconnection logic in WebSocket client class
- Track reconnect attempts: currentAttempt, maxAttempts = 3
- Implement exponential backoff: delay = Math.min(1000 * 2 ** attempt, 30000)
- Use setTimeout for delayed reconnect
- Reset attempt counter on successful connection
- Emit connection status events: "connecting", "connected", "disconnected", "reconnecting"
- Update UI based on status: show indicators, disable/enable features
- Implement fallback to HTTP: use chatService.sendMessage() when WebSocket unavailable
- Queue messages during reconnection: send after reconnect succeeds
- Add manual reconnect button in UI
- Test various disconnect scenarios: server restart, network drop, timeout

**Prerequisites:** Story 5.4 (Streaming display working), Story 5.3 (WebSocket client)

---

### Story 5.7: useWebSocket Custom Hook

As a developer,
I want a reusable WebSocket hook,
So that WebSocket functionality is easy to integrate in components.

**Acceptance Criteria:**

**Given** WebSocket functionality is needed
**When** I create useWebSocket hook
**Then** hook provides: sendMessage, isConnected, isReconnecting, streamingMessage, disconnect

**And** hook manages WebSocket connection lifecycle
**And** hook handles reconnection logic automatically
**And** hook provides connection status
**And** hook cleans up on unmount

**When** component uses useWebSocket(sessionId)
**Then** WebSocket connection is established
**And** messages can be sent via sendMessage(content)
**And** streaming messages are provided in real-time
**And** connection status is available
**And** cleanup happens automatically on unmount

**Technical Implementation:**
- Create frontend/src/hooks/useWebSocket.ts
- Accept sessionId as parameter
- Use useRef to store WebSocket instance
- Use useState for: isConnected, isReconnecting, streamingMessage, error
- Use useEffect to create connection on mount
- Implement message handlers: onopen, onmessage, onerror, onclose
- Implement sendMessage function: check connection, send JSON
- Implement disconnect function: close connection, cleanup
- Return object: { sendMessage, disconnect, isConnected, isReconnecting, streamingMessage, error }
- Add useEffect cleanup: disconnect on unmount
- Handle edge cases: component unmounts during reconnect, multiple messages sent rapidly
- Add TypeScript types for all return values

**Prerequisites:** Story 5.3 (WebSocket client logic), React hooks experience

---

## Final Validation & FR Coverage Matrix

### FR Coverage Matrix

| FR | Description | Epic Stories | Status |
|----|-------------|--------------|--------|
| FR1 | User Registration & Authentication | Epic 2 (2.1-2.9) | ✅ Complete |
| FR2 | Basic Chat Interface | Epic 3 (3.4, 3.6, 3.7) | ✅ Complete |
| FR3 | AI Integration with LangChain | Epic 3 (3.1, 3.3) | ✅ Complete |
| FR4 | WebSocket Real-time Communication | Epic 5 (5.1-5.7) | ✅ Complete |
| FR5 | Multi-Session Management | Epic 4 (4.1-4.6) | ✅ Complete |
| FR6 | Chat History Persistence | Epic 3 (3.2, 3.8), Epic 4 (4.1-4.6) | ✅ Complete |
| FR7 | Docker Deployment Infrastructure | Epic 1 (1.4, 1.5, 5.5) | ✅ Complete |
| FR8 | User Profile Management | Epic 2 (2.9) | ✅ Complete |
| FR9 | Error Handling & User Feedback | Epic 2 (All), Epic 3 (3.9), Epic 5 (5.6) | ✅ Complete |
| FR10 | Security Implementation | Epic 2 (All), Epic 1 (1.5) | ✅ Complete |
| FR11 | Database Migrations | Epic 1 (1.3) | ✅ Complete |
| FR12 | API Documentation | Epic 1 (1.7) | ✅ Complete |

**Total FR Coverage: 12/12 (100%)** ✅

---

### Architecture Integration Validation

**Core Architectural Decisions Applied:**

✅ **Decision 1.1:** Database Schema - Normalized relational (users, chat_sessions, messages)
✅ **Decision 1.2:** Conversation Memory - Database-backed with last 20 messages
✅ **Decision 1.3:** Database Migrations - Alembic for schema versioning
✅ **Decision 2.1:** JWT Storage - localStorage with 30-minute expiration
✅ **Decision 2.2:** Password Requirements - 8+ chars, mixed case, digit
✅ **Decision 3.1:** API Response Format - Pydantic models with error envelope
✅ **Decision 3.2:** Real-time Communication - WebSocket streaming
✅ **Decision 4.1:** State Management - React Context + Hooks
✅ **Decision 4.2:** API Client - Axios with interceptors
✅ **Decision 5.1:** Environment Variables - .env files with templates
✅ **Decision 5.2:** Logging Strategy - Python logging + console

**Implementation Patterns Applied:**

✅ Database naming: snake_case (users, chat_sessions, messages)
✅ API naming: RESTful with plural resources (/api/users, /api/chat/sessions)
✅ Frontend naming: PascalCase components, camelCase variables
✅ Backend naming: snake_case files/functions, PascalCase classes
✅ Error handling: try-catch-finally with Ant Design messages
✅ Loading states: isLoading boolean with Ant Design components
✅ Date/time format: ISO 8601 strings
✅ Test co-location: .test.tsx next to components

---

### User Journey Coverage

**Alex Nguyen (Student) Journey:**
✅ Registration with simple form (Story 2.4)
✅ First login experience (Story 2.5)
✅ "Aha!" moment - first AI conversation (Stories 3.4, 3.6)
✅ Multiple sessions for different topics (Story 4.2)
✅ Session persistence across visits (Story 3.8)

**Developer (You) Journey:**
✅ Foundation setup with Docker (Epic 1)
✅ Authentication implementation (Epic 2)
✅ LangChain integration magical moment (Story 3.1, 3.3)
✅ Real-time streaming breakthrough (Epic 5)
✅ Complete learning experience achieved

**Sarah Chen (DevOps) Journey:**
✅ Health check endpoints (Story 1.7)
✅ Structured logging (Story 1.6)
✅ Docker orchestration (Story 1.4)
✅ Environment management (Story 1.5)
✅ System reliability features

---

### Epic Summary

| Epic | Stories | User Value Delivered |
|------|---------|---------------------|
| Epic 1: Foundation & Infrastructure | 7 stories | Complete dev environment, one-command deployment |
| Epic 2: User Authentication | 9 stories | Secure accounts, JWT authentication, profile management |
| Epic 3: Basic AI Chat | 9 stories | Meaningful AI conversations with GPT-4, persistent history |
| Epic 4: Multi-Session Management | 6 stories | Organized conversations, easy context switching |
| Epic 5: Real-time Streaming | 7 stories | Engaging real-time AI responses, WebSocket communication |
| **Total** | **38 stories** | **Complete AI Chatbot Platform** |

---

### Implementation Roadmap

**Week 1-2: Foundation & Authentication (Epics 1-2)**
- Stories 1.1 → 1.7: Infrastructure setup
- Stories 2.1 → 2.9: Complete authentication system
- Milestone: Users can register, login, access protected routes

**Week 3-4: Core Chat Functionality (Epic 3)**
- Stories 3.1 → 3.9: Basic AI chat with GPT-4
- Milestone: Users can have AI conversations with persistent history

**Week 5: Multi-Session Features (Epic 4)**
- Stories 4.1 → 4.6: Session management and organization
- Milestone: Users can manage multiple conversation threads

**Week 6: Real-time Enhancement (Epic 5)**
- Stories 5.1 → 5.7: WebSocket streaming implementation
- Milestone: Real-time character-by-character AI responses

---

### Quality Metrics

**Test Coverage Targets:**
- Backend: 50% code coverage (MVP), focus on auth and LangChain integration
- Frontend: Component tests for critical paths (auth forms, chat interface)
- Integration: End-to-end user flows (registration → login → chat)

**Performance Targets:**
- AI response time: < 5 seconds (p95)
- Page load time: < 2 seconds (initial), < 500ms (subsequent)
- WebSocket latency: < 100ms per chunk
- Database queries: < 100ms (95%)

**Security Checklist:**
- ✅ OWASP Top 10 mitigation implemented
- ✅ JWT token security with 30-minute expiration
- ✅ Password hashing with bcrypt cost factor 12
- ✅ Input validation on all endpoints
- ✅ CORS configured for specific origins
- ✅ Environment variables for secrets

---

## 🎉 EPIC BREAKDOWN COMPLETE

**Project:** langchain - AI Chatbot Full-Stack Learning Playground

**Total Epics:** 5
**Total Stories:** 38
**FR Coverage:** 12/12 (100%)
**Architecture Integration:** Complete
**User Journeys:** Fully mapped

**Ready for:** Sprint Planning and Development Implementation

**Next Steps:**
1. Review and approve epic breakdown
2. Create sprint plan (2-week sprints recommended)
3. Assign stories to developers
4. Begin Epic 1 implementation
5. Use BMM `create-story` workflow for detailed implementation plans per story

---

_This comprehensive epic breakdown transforms PRD requirements and Architecture decisions into actionable, implementation-ready user stories. Each story includes complete acceptance criteria, technical implementation guidance, and proper prerequisites to ensure smooth development flow._

