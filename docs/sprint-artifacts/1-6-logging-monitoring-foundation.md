# Story 1.6: Logging and Monitoring Foundation

Status: ready-for-dev

## Story

As a developer,
I want structured logging configured across all services,
So that debugging and troubleshooting are efficient.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Create backend logging configuration (AC: Python logger ready)
  - [ ] 1.1: Create app/utils/logger.py
  - [ ] 1.2: Import logging module
  - [ ] 1.3: Configure log format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
  - [ ] 1.4: Create StreamHandler for stdout
  - [ ] 1.5: Set log level from LOG_LEVEL environment variable
  - [ ] 1.6: Create get_logger(name) function
  - [ ] 1.7: Add context filter for user_id, request_id

- [ ] Task 2: Integrate logging into FastAPI app (AC: All routes log)
  - [ ] 2.1: Import logger in app/main.py
  - [ ] 2.2: Add startup event logging
  - [ ] 2.3: Add shutdown event logging
  - [ ] 2.4: Create logging middleware for requests
  - [ ] 2.5: Log INFO for successful requests
  - [ ] 2.6: Log ERROR for exceptions with exc_info=True
  - [ ] 2.7: Add request_id to each request

- [ ] Task 3: Add logging to all routers (AC: Business logic logged)
  - [ ] 3.1: Import logger in each router module
  - [ ] 3.2: Log INFO for successful operations (login, register, message sent)
  - [ ] 3.3: Log WARNING for validation failures
  - [ ] 3.4: Log ERROR for exceptions
  - [ ] 3.5: Include relevant context (user_id, session_id) in logs

- [ ] Task 4: Create frontend logging utility (AC: Consistent frontend logging)
  - [ ] 4.1: Create frontend/src/lib/logger.ts
  - [ ] 4.2: Wrap console.log, console.error, console.warn
  - [ ] 4.3: Add timestamp to each log
  - [ ] 4.4: Add context information (userId, sessionId) if available
  - [ ] 4.5: Disable DEBUG logs in production
  - [ ] 4.6: Export log, error, warn, debug functions

- [ ] Task 5: Configure Docker logging drivers (AC: Log rotation works)
  - [ ] 5.1: Update docker-compose.yml logging section
  - [ ] 5.2: Set driver: json-file for all services
  - [ ] 5.3: Set max-size: 10m
  - [ ] 5.4: Set max-file: 3
  - [ ] 5.5: Verify log files don't grow unbounded

- [ ] Task 6: Test logging functionality (AC: Logs work correctly)
  - [ ] 6.1: Start all services
  - [ ] 6.2: Generate test logs at all levels (DEBUG, INFO, WARNING, ERROR)
  - [ ] 6.3: View backend logs: docker-compose logs backend
  - [ ] 6.4: Verify log format is correct
  - [ ] 6.5: Verify ERROR logs include stack traces
  - [ ] 6.6: Check frontend browser console logs
  - [ ] 6.7: Test log rotation (generate large logs, verify rotation)

## Dev Notes

### Technical Requirements from Architecture

**Backend Logging Stack:**
- Python standard logging module (built-in, no dependencies)
- StreamHandler for stdout output
- Format: timestamp - module - level - message
- Configurable log level via LOG_LEVEL environment variable
- Context filters for user_id, request_id

**Frontend Logging Stack:**
- Browser console API (console.log, error, warn, debug)
- Wrapper utility for consistent formatting
- Context: userId, sessionId when available
- Production: Suppress DEBUG logs

**Log Levels:**
- **DEBUG:** Detailed diagnostic information (development only)
- **INFO:** General informational messages (user actions, API calls)
- **WARNING:** Warning messages (validation errors, retries)
- **ERROR:** Error messages (API failures, exceptions)
- **CRITICAL:** Critical errors (database connection lost)

### Architecture Compliance

**Decision References:**
- Logging Strategy: Python logging + Console (Decision 5.2)
- Error Handling: Structured logging for troubleshooting (Implementation Patterns)
- Production Readiness: Log rotation and management (NFR Requirements)

**Key Patterns:**
1. **Structured Format:** Consistent format across all logs
2. **Context Inclusion:** Add user_id, request_id, session_id for traceability
3. **Level Appropriateness:** Use correct level for each log type
4. **Exception Details:** Include stack traces with exc_info=True
5. **Stdout/Stderr:** Log to stdout for Docker capture

### Backend Logger Configuration Pattern

**app/utils/logger.py:**
```python
import logging
import sys
from app.config import settings

def setup_logging():
    """Configure application logging"""
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

def get_logger(name: str) -> logging.Logger:
    """Get logger instance for module"""
    return logging.getLogger(name)

# Context filter for adding user_id, request_id
class ContextFilter(logging.Filter):
    def filter(self, record):
        # Add context from request state if available
        record.user_id = getattr(record, 'user_id', None)
        record.request_id = getattr(record, 'request_id', None)
        return True
```

**Usage in modules:**
```python
from app.utils.logger import get_logger

logger = get_logger(__name__)

def some_function():
    logger.info("Function called")
    try:
        # Business logic
        logger.debug("Processing data...")
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}", exc_info=True)
```

### FastAPI Logging Middleware Pattern

**Middleware for request logging:**
```python
import uuid
from fastapi import Request
import time

@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    logger.info(f"Request started: {request.method} {request.url.path}", extra={"request_id": request_id})
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(
            f"Request completed: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.2f}s",
            extra={"request_id": request_id}
        )
        return response
    except Exception as e:
        logger.error(f"Request failed: {request.method} {request.url.path}", exc_info=True, extra={"request_id": request_id})
        raise
```

### Frontend Logger Pattern

**frontend/src/lib/logger.ts:**
```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: LogContext) {
    console.error(this.formatMessage('error', message, context));
    if (error) {
      console.error('Error details:', error);
    }
  }
}

export const logger = new Logger();
```

**Usage:**
```typescript
import { logger } from '@/lib/logger';

// Simple log
logger.info('User logged in');

// With context
logger.info('Message sent', { userId: '123', sessionId: '456' });

// Error with exception
try {
  await apiCall();
} catch (error) {
  logger.error('API call failed', error, { endpoint: '/api/chat' });
}
```

### Docker Logging Configuration

**docker-compose.yml logging section:**
```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Why json-file driver:**
- Structured log format
- Easy parsing with tools
- Built-in rotation with max-size
- Preserves multiple files with max-file

**Log file location:**
```bash
# Find container ID
docker ps

# View log file location
docker inspect <container-id> | grep LogPath

# Typical location: /var/lib/docker/containers/<container-id>/<container-id>-json.log
```

### Log Level Guidelines

**When to use each level:**

**DEBUG:**
- Variable values during processing
- Detailed flow information
- Query parameters and responses
- Only in development

**INFO:**
- User actions (login, logout, message sent)
- API calls (endpoint, method)
- Service startup/shutdown
- Configuration loaded

**WARNING:**
- Validation failures (user input)
- Rate limit approaching
- Retry attempts
- Deprecated feature usage

**ERROR:**
- API failures (OpenAI, database)
- Unexpected exceptions
- Authentication failures
- Data inconsistencies

**CRITICAL:**
- Database connection lost
- Service unavailable
- System failure
- Data corruption

### Testing Standards Summary

**For This Story:**
- Log format test: Verify timestamp, module, level, message present
- Log level test: Set LOG_LEVEL, verify only appropriate logs appear
- Exception test: Trigger error, verify stack trace in logs
- Context test: Verify user_id, request_id included when available
- Rotation test: Generate large logs, verify rotation works
- Frontend test: Check browser console logs format

**Test Scenarios:**
```python
# Backend test
logger.debug("Debug message")  # Only in DEBUG mode
logger.info("Info message", extra={"user_id": 123})
logger.warning("Warning message")
logger.error("Error message", exc_info=True)

# Verify output format
# 2025-12-02 10:30:00,123 - app.auth.router - INFO - User logged in
```

### Validation Checklist

Before marking this story complete, verify:

- [ ] app/utils/logger.py created
- [ ] setup_logging() function configured
- [ ] get_logger(name) function works
- [ ] Log format includes timestamp, module, level, message
- [ ] LOG_LEVEL environment variable controls logging
- [ ] StreamHandler outputs to stdout
- [ ] ContextFilter adds user_id, request_id
- [ ] Logging middleware added to FastAPI
- [ ] Request start/end logged
- [ ] Exceptions logged with stack traces (exc_info=True)
- [ ] All routers import and use logger
- [ ] INFO logs for successful operations
- [ ] ERROR logs for failures
- [ ] frontend/src/lib/logger.ts created
- [ ] Logger class wraps console methods
- [ ] Timestamp added to frontend logs
- [ ] DEBUG logs disabled in production
- [ ] Context (userId, sessionId) included in logs
- [ ] docker-compose.yml has logging configuration
- [ ] json-file driver configured
- [ ] max-size: 10m set
- [ ] max-file: 3 set
- [ ] Test: Start services, generate logs
- [ ] Test: View logs with docker-compose logs
- [ ] Test: All log levels work correctly
- [ ] Test: ERROR logs include stack traces
- [ ] Test: Frontend console logs formatted correctly
- [ ] Test: Log rotation works (files don't grow unbounded)

### References

**Source Documents:**
- [PRD - Technical Requirements - Error Handling & Logging](docs/prd.md#error-handling-strategy)
- [Architecture - Decision 5.2: Logging Strategy](docs/architecture.md#decision-52-logging-strategy)
- [Epic 1: Foundation & Infrastructure Setup - Story 1.6](docs/epics.md#story-16-logging-and-monitoring-foundation)

### Project Context Reference

**Project:** langchain - AI Chatbot Full-Stack Learning Playground
**Epic:** Epic 1 - Foundation & Infrastructure Setup
**Story Position:** Sixth story (1.6) - Observability foundation
**Dependencies:** Story 1.2 (Backend), Story 1.4 (Docker Compose)
**Blockers:** None
**Next Story:** 1.7 - API Documentation and Health Checks

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
