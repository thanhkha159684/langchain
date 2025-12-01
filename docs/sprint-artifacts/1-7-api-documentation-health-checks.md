# Story 1.7: API Documentation and Health Checks

Status: ready-for-dev

## Story

As a developer,
I want auto-generated API documentation and health check endpoints,
So that API contracts are clear and service health is monitorable.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Configure FastAPI OpenAPI metadata (AC: Docs have proper title/description)
  - [ ] 1.1: Update app/main.py with OpenAPI configuration
  - [ ] 1.2: Set title: "LangChain Chatbot API"
  - [ ] 1.3: Set description: Multi-line description with features
  - [ ] 1.4: Set version: "1.0.0"
  - [ ] 1.5: Add contact information (optional)
  - [ ] 1.6: Add license information (optional)

- [ ] Task 2: Create health check endpoint (AC: Health endpoint works)
  - [ ] 2.1: Create app/routers/health.py
  - [ ] 2.2: Import FastAPI router and database session
  - [ ] 2.3: Create GET /api/health endpoint
  - [ ] 2.4: Test database connection with SELECT 1
  - [ ] 2.5: Return JSON: status, database, timestamp, version
  - [ ] 2.6: Handle database errors gracefully
  - [ ] 2.7: Include router in main.py

- [ ] Task 3: Add endpoint descriptions and examples (AC: API docs are comprehensive)
  - [ ] 3.1: Add docstrings to all endpoint functions
  - [ ] 3.2: Add response_model to all endpoints
  - [ ] 3.3: Add tags for grouping (auth, chat, users, health)
  - [ ] 3.4: Add status_code to all endpoints
  - [ ] 3.5: Add description parameter to @router decorators
  - [ ] 3.6: Add response examples using OpenAPI examples

- [ ] Task 4: Document Pydantic schemas (AC: Request/response schemas clear)
  - [ ] 4.1: Add Config class with schema_extra for examples
  - [ ] 4.2: Add Field descriptions to all schema fields
  - [ ] 4.3: Add examples to Pydantic models
  - [ ] 4.4: Verify auto-generated schemas in Swagger UI
  - [ ] 4.5: Add validation error examples

- [ ] Task 5: Configure Docker healthchecks (AC: Containers auto-restart if unhealthy)
  - [ ] 5.1: Add healthcheck to backend service in docker-compose.yml
  - [ ] 5.2: Test: curl http://localhost:8000/api/health
  - [ ] 5.3: Set interval: 30s, timeout: 10s, retries: 3
  - [ ] 5.4: Add healthcheck to db service: pg_isready
  - [ ] 5.5: Add healthcheck to frontend service: curl http://localhost:3000
  - [ ] 5.6: Add healthcheck to nginx service: curl http://localhost:80

- [ ] Task 6: Test API documentation and health checks (AC: All features work)
  - [ ] 6.1: Start all services with docker-compose
  - [ ] 6.2: Access http://localhost/api/docs (Swagger UI)
  - [ ] 6.3: Verify all endpoints listed and grouped by tags
  - [ ] 6.4: Test an endpoint directly from Swagger UI
  - [ ] 6.5: Access http://localhost/api/redoc (ReDoc)
  - [ ] 6.6: Access http://localhost/api/openapi.json (schema)
  - [ ] 6.7: Access http://localhost/api/health (health check)
  - [ ] 6.8: Verify health response includes database status
  - [ ] 6.9: Run docker-compose ps to see health status
  - [ ] 6.10: Test: Stop database, verify health check fails

## Dev Notes

### Technical Requirements from Architecture

**FastAPI OpenAPI Features:**
- Auto-generated Swagger UI at /docs
- Auto-generated ReDoc at /redoc
- OpenAPI JSON schema at /openapi.json
- Request/response validation from Pydantic
- Authentication scheme documentation
- Example requests/responses

**Health Check Requirements:**
- Endpoint: GET /api/health
- No authentication required
- Tests critical dependencies (database)
- Returns JSON with status information
- Used by Docker healthcheck
- Used by load balancers (future)

**Docker Healthcheck Pattern:**
- Interval: How often to check (30s)
- Timeout: Max time for check (10s)
- Retries: Failures before unhealthy (3)
- Start period: Grace period on startup (30s)

### Architecture Compliance

**Decision References:**
- API Documentation: FastAPI auto-generated (FR12, Story 1.7)
- Health Checks: Monitoring foundation (FR7, Infrastructure)
- OpenAPI Standards: RESTful API design (Implementation Patterns)

**Key Patterns:**
1. **Comprehensive Docs:** Every endpoint documented with examples
2. **Schema Validation:** Pydantic models drive documentation
3. **Grouping:** Tags organize endpoints logically
4. **Health Monitoring:** Automated health checks for reliability
5. **Standard Responses:** Consistent response formats

### OpenAPI Configuration Pattern

**app/main.py OpenAPI setup:**
```python
from fastapi import FastAPI

app = FastAPI(
    title="LangChain Chatbot API",
    description="""
    AI-powered chatbot with GPT-4 integration via LangChain.
    
    ## Features
    * User authentication with JWT tokens
    * Multi-session chat management
    * Real-time AI responses via WebSocket
    * Conversation history persistence
    * OpenAI GPT-4 powered responses
    
    ## Authentication
    Most endpoints require JWT authentication. 
    Use /api/auth/login to obtain an access token.
    """,
    version="1.0.0",
    contact={
        "name": "LangChain Chatbot",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT",
    },
)
```

### Health Check Endpoint Pattern

**app/routers/health.py:**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime
from app.database.session import get_db

router = APIRouter(tags=["Health"])

@router.get(
    "/api/health",
    summary="Health Check",
    description="Check API and database health status",
    response_description="Health status information"
)
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint for monitoring service status.
    
    Returns:
        - status: Overall health status
        - database: Database connection status
        - timestamp: Current server time
        - version: API version
    """
    # Test database connection
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
```

### Endpoint Documentation Pattern

**Adding rich documentation to endpoints:**
```python
from fastapi import APIRouter, HTTPException
from app.schemas.auth import UserRegister, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
    summary="Register New User",
    description="Create a new user account with username, email, and password",
    response_description="Created user information (password excluded)"
)
async def register_user(user_data: UserRegister):
    """
    Register a new user account.
    
    ## Request Body
    - **username**: 3-50 characters, alphanumeric + underscore
    - **email**: Valid email address (RFC 5322)
    - **password**: Minimum 8 characters with uppercase, lowercase, and digit
    
    ## Responses
    - **201 Created**: User successfully created
    - **400 Bad Request**: Validation error
    - **409 Conflict**: Username or email already exists
    
    ## Example Request
    ```json
    {
        "username": "johndoe",
        "email": "john@example.com",
        "password": "SecurePass123!"
    }
    ```
    """
    # Implementation...
```

### Pydantic Schema with Examples

**Adding examples to Pydantic models:**
```python
from pydantic import BaseModel, Field, EmailStr

class UserRegister(BaseModel):
    username: str = Field(
        ..., 
        min_length=3, 
        max_length=50,
        description="Username for the account",
        example="johndoe"
    )
    email: EmailStr = Field(
        ..., 
        description="Valid email address",
        example="john@example.com"
    )
    password: str = Field(
        ..., 
        min_length=8,
        description="Secure password (8+ chars, mixed case, digit)",
        example="SecurePass123!"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "password": "SecurePass123!"
            }
        }
```

### Docker Healthcheck Configuration

**docker-compose.yml healthcheck section:**
```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
  
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U chatbot_user -d chatbot"]
      interval: 10s
      timeout: 5s
      retries: 5
  
  frontend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
  
  nginx:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Testing API Documentation

**Manual Testing Steps:**

**1. Access Swagger UI:**
- URL: http://localhost/api/docs
- Verify: All endpoints listed
- Verify: Grouped by tags (Auth, Chat, Users, Health)
- Verify: Descriptions present

**2. Test Endpoint from Swagger:**
- Click on GET /api/health
- Click "Try it out"
- Click "Execute"
- Verify: 200 response with JSON body

**3. Access ReDoc:**
- URL: http://localhost/api/redoc
- Verify: Alternative documentation format
- Verify: Same endpoints, different UI

**4. View OpenAPI Schema:**
- URL: http://localhost/api/openapi.json
- Verify: Valid JSON schema
- Contains: paths, components, schemas

**5. Test Health Check:**
```bash
curl http://localhost/api/health
# Expected output:
# {
#   "status": "healthy",
#   "database": "connected",
#   "timestamp": "2025-12-02T10:00:00.000000",
#   "version": "1.0.0"
# }
```

**6. Check Container Health:**
```bash
docker-compose ps
# Should show (healthy) status for all services
```

### Testing Standards Summary

**For This Story:**
- Documentation completeness: All endpoints in Swagger UI
- Schema validation: Request/response examples work
- Health check functionality: Endpoint returns correct status
- Docker healthcheck: Containers marked healthy/unhealthy
- Error handling: Health check gracefully handles database errors

**Verification Commands:**
```bash
# View API docs
open http://localhost/api/docs

# Test health check
curl http://localhost/api/health | jq

# Check container health
docker-compose ps

# View health check logs
docker-compose logs backend | grep health

# Test unhealthy scenario (stop database)
docker-compose stop db
# Wait 30s, check backend health
docker-compose ps
# Should show backend as unhealthy
```

### Validation Checklist

Before marking this story complete, verify:

- [ ] app/main.py has OpenAPI configuration
- [ ] Title set to "LangChain Chatbot API"
- [ ] Description includes features and auth info
- [ ] Version set to "1.0.0"
- [ ] app/routers/health.py created
- [ ] GET /api/health endpoint implemented
- [ ] Health check tests database connection
- [ ] Returns JSON with status, database, timestamp, version
- [ ] Health endpoint doesn't require authentication
- [ ] Health router included in app/main.py
- [ ] All endpoints have docstrings
- [ ] All endpoints have response_model
- [ ] All endpoints have tags for grouping
- [ ] All endpoints have status_code
- [ ] Pydantic schemas have Field descriptions
- [ ] Pydantic schemas have examples
- [ ] docker-compose.yml has healthcheck for backend
- [ ] docker-compose.yml has healthcheck for db
- [ ] docker-compose.yml has healthcheck for frontend
- [ ] docker-compose.yml has healthcheck for nginx
- [ ] Healthcheck intervals set correctly
- [ ] Test: Access http://localhost/api/docs
- [ ] Test: Swagger UI shows all endpoints
- [ ] Test: Can execute endpoint from Swagger UI
- [ ] Test: Access http://localhost/api/redoc
- [ ] Test: Access http://localhost/api/openapi.json
- [ ] Test: Access http://localhost/api/health returns 200
- [ ] Test: Health response includes all required fields
- [ ] Test: docker-compose ps shows (healthy) status
- [ ] Test: Stop database, backend becomes unhealthy
- [ ] Test: Restart database, backend becomes healthy again

### References

**Source Documents:**
- [PRD - Technical Requirements - API Documentation](docs/prd.md#api-specifications)
- [Architecture - Infrastructure - Monitoring](docs/architecture.md#infrastructure--deployment)
- [Epic 1: Foundation & Infrastructure Setup - Story 1.7](docs/epics.md#story-17-api-documentation-and-health-checks)

### Project Context Reference

**Project:** langchain - AI Chatbot Full-Stack Learning Playground
**Epic:** Epic 1 - Foundation & Infrastructure Setup
**Story Position:** Seventh story (1.7) - Final story of Epic 1
**Dependencies:** Story 1.2 (FastAPI), Story 1.3 (Database), Story 1.4 (Docker)
**Blockers:** None
**Next Story:** Epic 1 Complete → Move to Epic 2 (Authentication)

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
