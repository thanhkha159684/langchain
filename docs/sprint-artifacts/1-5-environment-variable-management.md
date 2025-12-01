# Story 1.5: Environment Variable Management

Status: ready-for-dev

## Story

As a developer,
I want secure environment variable management with clear templates,
So that secrets are never committed to git and configuration is straightforward.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Create root .env.example (AC: Complete template for docker-compose)
  - [ ] 1.1: Add comprehensive header comments
  - [ ] 1.2: Add Database section: DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
  - [ ] 1.3: Add JWT section: SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
  - [ ] 1.4: Add OpenAI section: OPENAI_API_KEY
  - [ ] 1.5: Add CORS section: ALLOWED_ORIGINS
  - [ ] 1.6: Add Application section: DEBUG, LOG_LEVEL
  - [ ] 1.7: Add Frontend section: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL
  - [ ] 1.8: Add usage instructions and SECRET_KEY generation command

- [ ] Task 2: Create backend/.env.example (AC: Backend-specific template)
  - [ ] 2.1: Copy relevant backend variables from root template
  - [ ] 2.2: Add detailed comments for each variable
  - [ ] 2.3: Specify required vs optional variables
  - [ ] 2.4: Add example values (with placeholders for secrets)

- [ ] Task 3: Create frontend/.env.example (AC: Frontend-specific template)
  - [ ] 3.1: Add NEXT_PUBLIC_API_URL with development value
  - [ ] 3.2: Add NEXT_PUBLIC_WS_URL with development value
  - [ ] 3.3: Add comments explaining NEXT_PUBLIC_ prefix requirement
  - [ ] 3.4: Document build-time vs runtime variable behavior

- [ ] Task 4: Update .gitignore (AC: Secrets never committed)
  - [ ] 4.1: Add .env to root .gitignore
  - [ ] 4.2: Add .env to frontend/.gitignore
  - [ ] 4.3: Add .env to backend/.gitignore
  - [ ] 4.4: Verify .env.example is NOT in .gitignore
  - [ ] 4.5: Add .env.local, .env.*.local patterns

- [ ] Task 5: Update backend config.py (AC: Pydantic loads env vars)
  - [ ] 5.1: Import BaseSettings from pydantic_settings
  - [ ] 5.2: Create Settings class with all environment variables
  - [ ] 5.3: Add validation for required fields
  - [ ] 5.4: Add default values where appropriate
  - [ ] 5.5: Create global settings instance
  - [ ] 5.6: Add environment variable name mapping if needed

- [ ] Task 6: Create setup documentation (AC: Clear setup instructions)
  - [ ] 6.1: Create docs/setup-guide.md
  - [ ] 6.2: Document step-by-step environment setup
  - [ ] 6.3: Explain SECRET_KEY generation: `openssl rand -hex 32`
  - [ ] 6.4: Document how to get OPENAI_API_KEY
  - [ ] 6.5: Add troubleshooting section for common issues

- [ ] Task 7: Test environment variable loading (AC: All services read config correctly)
  - [ ] 7.1: Copy .env.example to .env
  - [ ] 7.2: Generate SECRET_KEY with openssl
  - [ ] 7.3: Fill in placeholder values
  - [ ] 7.4: Start services with docker-compose
  - [ ] 7.5: Verify backend connects to database
  - [ ] 7.6: Verify frontend can call backend API
  - [ ] 7.7: Check logs for missing environment variable errors

## Dev Notes

### Technical Requirements from Architecture

**Environment Variable Categories:**

**1. Database Configuration:**
- DATABASE_URL: Full connection string for SQLAlchemy
- POSTGRES_USER: PostgreSQL username
- POSTGRES_PASSWORD: PostgreSQL password
- POSTGRES_DB: Database name

**2. JWT Authentication:**
- SECRET_KEY: 32+ character secret for JWT signing (generate with openssl)
- ALGORITHM: HS256 (default, can be changed)
- ACCESS_TOKEN_EXPIRE_MINUTES: Token lifetime (default 30)

**3. OpenAI Integration:**
- OPENAI_API_KEY: API key from OpenAI dashboard (required)

**4. CORS Configuration:**
- ALLOWED_ORIGINS: Comma-separated list of allowed frontend origins

**5. Application Settings:**
- DEBUG: true/false for debug mode
- LOG_LEVEL: DEBUG, INFO, WARNING, ERROR, CRITICAL

**6. Frontend Configuration:**
- NEXT_PUBLIC_API_URL: Backend API base URL (must start with NEXT_PUBLIC_)
- NEXT_PUBLIC_WS_URL: WebSocket URL (must start with NEXT_PUBLIC_)

### Architecture Compliance

**Decision References:**
- Environment Management: .env files with templates (Decision 5.1)
- Security: Never commit secrets (OWASP Security Requirements)
- Configuration: Pydantic BaseSettings (Backend starter pattern)

**Key Security Patterns:**
1. **Secret Generation:** Use cryptographically secure methods (openssl)
2. **Git Safety:** .env in .gitignore, .env.example committed
3. **Validation:** Pydantic validates on startup, fails fast if misconfigured
4. **Separation:** Development vs production configurations
5. **Documentation:** Clear comments explaining each variable

### Root .env.example Template Structure

```bash
# ============================================
# LangChain Chatbot - Environment Configuration
# ============================================
# 
# SETUP INSTRUCTIONS:
# 1. Copy this file: cp .env.example .env
# 2. Generate SECRET_KEY: openssl rand -hex 32
# 3. Get OPENAI_API_KEY from https://platform.openai.com/api-keys
# 4. Fill in other values as needed
# 5. NEVER commit .env file to git
#
# ============================================

# Database Configuration
# ======================
DATABASE_URL=postgresql+asyncpg://chatbot_user:your_secure_password@db:5432/chatbot
POSTGRES_USER=chatbot_user
POSTGRES_PASSWORD=your_secure_password_change_this
POSTGRES_DB=chatbot

# JWT Authentication
# ==================
# Generate with: openssl rand -hex 32
SECRET_KEY=your-secret-key-minimum-32-characters-generate-with-openssl
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI API
# ==========
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS Configuration
# ==================
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost

# Application Settings
# ====================
DEBUG=true
LOG_LEVEL=INFO

# Frontend Configuration
# ======================
# Must start with NEXT_PUBLIC_ to be accessible in browser
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_WS_URL=ws://localhost/api/chat/ws
```

### Pydantic Settings Pattern

**backend/app/config.py:**
```python
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # Database
    database_url: str = Field(..., env="DATABASE_URL")
    
    # JWT
    secret_key: str = Field(..., env="SECRET_KEY")
    algorithm: str = Field(default="HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # OpenAI
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    
    # CORS
    allowed_origins: str = Field(default="http://localhost:3000", env="ALLOWED_ORIGINS")
    
    # Application
    debug: bool = Field(default=True, env="DEBUG")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
```

### Docker Compose Environment Injection

**Three methods of passing environment variables:**

**Method 1: env_file (recommended):**
```yaml
services:
  backend:
    env_file:
      - .env
```

**Method 2: environment (explicit):**
```yaml
services:
  backend:
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
```

**Method 3: .env auto-load:**
Docker Compose automatically loads .env from project root

### Frontend Environment Variable Rules

**Next.js Environment Variable Types:**

**1. NEXT_PUBLIC_* variables:**
- Exposed to browser
- Embedded at build time
- Can be used in client components
- Example: NEXT_PUBLIC_API_URL

**2. Server-only variables:**
- No NEXT_PUBLIC_ prefix
- Only available in server components and API routes
- Not exposed to browser
- Example: DATABASE_URL (if frontend had backend)

**Access in code:**
```typescript
// Client component
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server component
const secretKey = process.env.SECRET_KEY; // Works only server-side
```

### Security Best Practices

**SECRET_KEY Generation:**
```bash
# Generate 32-byte (256-bit) random hex string
openssl rand -hex 32

# Example output: 
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**POSTGRES_PASSWORD Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, special characters
- Different from any default passwords
- Unique to this project

**OPENAI_API_KEY:**
- Get from OpenAI dashboard
- Keep confidential - has cost implications
- Set usage limits on OpenAI dashboard
- Monitor usage regularly

### Testing Standards Summary

**For This Story:**
- Template completeness: All required variables documented
- Gitignore test: Verify .env not tracked by git
- Loading test: Start services, check logs for missing variables
- Validation test: Try invalid values, ensure Pydantic catches errors
- Access test: Backend and frontend can read their respective variables

**Verification Commands:**
```bash
# Check .gitignore includes .env
git check-ignore .env
# Should output: .env

# Check .env is not tracked
git status
# Should not show .env

# Test SECRET_KEY generation
openssl rand -hex 32

# Verify environment variables loaded
docker-compose up backend
# Check logs for successful config loading
```

### Validation Checklist

Before marking this story complete, verify:

- [ ] .env.example created at project root with all variables
- [ ] backend/.env.example created with backend variables
- [ ] frontend/.env.example created with NEXT_PUBLIC_ variables
- [ ] .env added to .gitignore in all locations (root, frontend/, backend/)
- [ ] .env.example NOT in .gitignore (should be committed)
- [ ] All variables have descriptive comments
- [ ] SECRET_KEY generation command documented
- [ ] OPENAI_API_KEY instructions included
- [ ] backend/app/config.py uses Pydantic BaseSettings
- [ ] Settings class has all required fields
- [ ] settings instance exported
- [ ] docker-compose.yml loads .env file
- [ ] Documentation created: docs/setup-guide.md
- [ ] Test: Copy .env.example to .env
- [ ] Test: Generate SECRET_KEY with openssl
- [ ] Test: Fill in all placeholder values
- [ ] Test: Start docker-compose, all services start
- [ ] Test: Backend logs show config loaded successfully
- [ ] Test: Backend connects to database
- [ ] Test: Frontend can access NEXT_PUBLIC_ variables
- [ ] Test: Try invalid config, Pydantic validation catches it
- [ ] Test: git status doesn't show .env file

### References

**Source Documents:**
- [PRD - Technical Requirements - Environment Variables](docs/prd.md#environment-variables)
- [Architecture - Decision 5.1: Environment Variable Management](docs/architecture.md#decision-51-environment-variable-management)
- [Epic 1: Foundation & Infrastructure Setup - Story 1.5](docs/epics.md#story-15-environment-variable-management)

### Project Context Reference

**Project:** langchain - AI Chatbot Full-Stack Learning Playground
**Epic:** Epic 1 - Foundation & Infrastructure Setup
**Story Position:** Fifth story (1.5) - Configuration management
**Dependencies:** Story 1.4 (Docker Compose ready), Story 1.2 (Backend config.py)
**Blockers:** None
**Next Story:** 1.6 - Logging and Monitoring Foundation

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
