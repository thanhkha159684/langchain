# Story 1.3: Database Setup with PostgreSQL and Alembic

Status: ready-for-dev

## Story

As a developer,
I want PostgreSQL running with Alembic migrations configured,
So that I have reliable database management with version-controlled schema changes.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Configure SQLAlchemy database connection (AC: Connection works)
  - [ ] 1.1: Create app/database/base.py with declarative_base
  - [ ] 1.2: Create app/database/session.py with async engine and SessionLocal
  - [ ] 1.3: Configure DATABASE_URL from environment variable
  - [ ] 1.4: Create get_db dependency function for FastAPI
  - [ ] 1.5: Test database connection

- [ ] Task 2: Create database models (AC: Three models defined)
  - [ ] 2.1: Create app/models/user.py with User model
  - [ ] 2.2: Define columns: id, username, email, hashed_password, is_active, created_at, updated_at
  - [ ] 2.3: Add UNIQUE constraints on username and email
  - [ ] 2.4: Create app/models/chat_session.py with ChatSession model
  - [ ] 2.5: Define columns: id, user_id FK, title, created_at, updated_at
  - [ ] 2.6: Create app/models/message.py with Message model
  - [ ] 2.7: Define columns: id, session_id FK, role ENUM, content TEXT, created_at
  - [ ] 2.8: Configure CASCADE DELETE on foreign keys

- [ ] Task 3: Initialize Alembic (AC: Alembic configured)
  - [ ] 3.1: Run `alembic init alembic` in backend directory
  - [ ] 3.2: Verify alembic/ directory created with env.py, script.py.mako
  - [ ] 3.3: Verify alembic.ini created

- [ ] Task 4: Configure Alembic for SQLAlchemy models (AC: Auto-generate works)
  - [ ] 4.1: Update alembic.ini: set sqlalchemy.url from config
  - [ ] 4.2: Update alembic/env.py: import Base and all models
  - [ ] 4.3: Set target_metadata = Base.metadata
  - [ ] 4.4: Configure async engine in env.py
  - [ ] 4.5: Test configuration with `alembic current`

- [ ] Task 5: Create initial migration (AC: Migration file generated)
  - [ ] 5.1: Run `alembic revision --autogenerate -m "Initial schema"`
  - [ ] 5.2: Verify migration file in alembic/versions/ directory
  - [ ] 5.3: Review migration file: check CREATE TABLE statements
  - [ ] 5.4: Verify foreign keys have ON DELETE CASCADE
  - [ ] 5.5: Verify indexes are created for username, email, user_id, session_id

- [ ] Task 6: Apply migration and verify (AC: Tables created in database)
  - [ ] 6.1: Ensure PostgreSQL is running
  - [ ] 6.2: Run `alembic upgrade head`
  - [ ] 6.3: Connect to PostgreSQL and verify tables exist
  - [ ] 6.4: Query alembic_version table to check migration applied
  - [ ] 6.5: Verify table structures match models

## Dev Notes

### Technical Requirements from Architecture

**Required Versions:**
- PostgreSQL: 15+ (latest stable)
- SQLAlchemy: 2.0+ with async support
- asyncpg: Latest (PostgreSQL async driver)
- Alembic: Latest (database migrations)

**Database Schema (from Architecture Decision 1.1):**

**Users Table:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

**Chat Sessions Table:**
```sql
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
```

**Messages Table:**
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_messages_session_id ON messages(session_id);
```

### Architecture Compliance

**Decision References:**
- Database Schema Design: Normalized Relational (Decision 1.1)
- Database Migrations: Alembic for versioning (Decision 1.3)
- Naming Convention: snake_case for tables and columns (Implementation Patterns)
- Foreign Keys: CASCADE DELETE for data cleanup (Decision 1.1)

**Key Architecture Patterns:**
1. **Table Naming:** Plural nouns, snake_case (users, chat_sessions, messages)
2. **Column Naming:** snake_case (user_id, created_at, hashed_password)
3. **Foreign Keys:** {referenced_table_singular}_id format (user_id, session_id)
4. **Indexes:** idx_{table}_{column} format (idx_users_username)
5. **Timestamps:** created_at, updated_at on all tables

### SQLAlchemy Model Pattern

**User Model Example Structure:**
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### Database Connection Configuration

**Connection String Format:**
```
postgresql+asyncpg://username:password@host:port/database
```

**For Development:**
```
DATABASE_URL=postgresql+asyncpg://chatbot_user:password@localhost:5432/chatbot
```

**For Docker (later story):**
```
DATABASE_URL=postgresql+asyncpg://chatbot_user:password@db:5432/chatbot
```

### Alembic Configuration Pattern

**Key Configuration Files:**
- `alembic.ini` - Main configuration with database URL
- `alembic/env.py` - Environment setup, model imports
- `alembic/versions/*.py` - Migration scripts
- `alembic/script.py.mako` - Template for new migrations

**Important env.py Configuration:**
```python
from app.database.base import Base
from app.models import user, chat_session, message  # Import all models

target_metadata = Base.metadata
```

### Migration Commands Reference

**Common Alembic Commands:**
```bash
# Check current migration status
alembic current

# Create new migration (auto-detect changes)
alembic revision --autogenerate -m "Description"

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show migration history
alembic history

# View SQL without executing
alembic upgrade head --sql
```

### Testing Standards Summary

**For This Story:**
- Database connection test: Connect via asyncpg and query tables
- Migration test: Run upgrade, verify tables exist
- Rollback test: Run downgrade, verify tables removed
- Model test: Query each table, verify schema matches

**Verification Queries:**
```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check users table structure
\d users

-- Verify indexes
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users';

-- Check migration status
SELECT * FROM alembic_version;
```

### Validation Checklist

Before marking this story complete, verify:

- [ ] PostgreSQL 15+ is installed and running
- [ ] SQLAlchemy 2.0+ installed with asyncpg driver
- [ ] Alembic installed (`pip list | grep alembic`)
- [ ] app/database/base.py created with Base
- [ ] app/database/session.py created with async engine
- [ ] get_db dependency function created
- [ ] app/models/user.py created with User model
- [ ] app/models/chat_session.py created with ChatSession model
- [ ] app/models/message.py created with Message model
- [ ] All models have proper columns as per schema
- [ ] UNIQUE constraints on username and email
- [ ] Foreign keys configured with CASCADE DELETE
- [ ] Alembic initialized (`alembic init` executed)
- [ ] alembic.ini configured with DATABASE_URL
- [ ] alembic/env.py imports all models
- [ ] target_metadata set to Base.metadata
- [ ] Migration generated (`alembic revision --autogenerate`)
- [ ] Migration file exists in alembic/versions/
- [ ] Migration reviewed: CREATE TABLE statements correct
- [ ] Indexes included in migration
- [ ] Migration applied (`alembic upgrade head` successful)
- [ ] Tables exist in PostgreSQL database
- [ ] alembic_version table shows current migration
- [ ] Can query users, chat_sessions, messages tables
- [ ] Foreign key constraints working
- [ ] Test downgrade works (`alembic downgrade -1`)

### References

**Source Documents:**
- [PRD - Technical Requirements - Database](docs/prd.md#database-schema)
- [Architecture - Decision 1.1: Database Schema Design](docs/architecture.md#decision-11-database-schema-design-approach)
- [Architecture - Decision 1.3: Database Migrations](docs/architecture.md#decision-13-database-migrations-approach)
- [Epic 1: Foundation & Infrastructure Setup - Story 1.3](docs/epics.md#story-13-database-setup-with-postgresql-and-alembic)

### Project Context Reference

**Project:** langchain - AI Chatbot Full-Stack Learning Playground
**Epic:** Epic 1 - Foundation & Infrastructure Setup
**Story Position:** Third story (1.3) - Database foundation
**Dependencies:** Story 1.2 (Backend initialized)
**Blockers:** PostgreSQL must be installed/running
**Next Story:** 1.4 - Docker Compose Multi-Container Orchestration

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
