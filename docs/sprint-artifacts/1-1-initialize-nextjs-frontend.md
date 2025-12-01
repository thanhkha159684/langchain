# Story 1.1: Initialize Next.js Frontend Project

Status: ready-for-dev

## Story

As a developer,
I want to initialize a Next.js 14+ frontend project with TypeScript and Ant Design,
So that I have a modern React foundation for building the chat UI.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Run Next.js initialization command (AC: Project created with all configurations)
  - [ ] 1.1: Execute `npx create-next-app@latest frontend --typescript --tailwind --app --eslint --import-alias "@/*"`
  - [ ] 1.2: Verify Next.js 14+ is installed
  - [ ] 1.3: Verify TypeScript 5.1+ is configured
  - [ ] 1.4: Check App Router structure is created

- [ ] Task 2: Install Ant Design dependencies (AC: Ant Design v5 ready to use)
  - [ ] 2.1: Run `cd frontend && npm install antd @ant-design/nextjs-registry`
  - [ ] 2.2: Verify antd v5.x is installed in package.json
  - [ ] 2.3: Verify @ant-design/nextjs-registry is installed

- [ ] Task 3: Create project directory structure (AC: All required folders exist)
  - [ ] 3.1: Create `src/components/` directory
  - [ ] 3.2: Create `src/lib/` directory
  - [ ] 3.3: Create `src/hooks/` directory
  - [ ] 3.4: Create `src/types/` directory
  - [ ] 3.5: Create `src/utils/` directory

- [ ] Task 4: Configure app/layout.tsx with AntdRegistry (AC: Ant Design works in app)
  - [ ] 4.1: Import AntdRegistry from @ant-design/nextjs-registry
  - [ ] 4.2: Wrap children with AntdRegistry in layout
  - [ ] 4.3: Configure metadata (title, description)
  - [ ] 4.4: Test Ant Design Button renders correctly

- [ ] Task 5: Configure globals.css with Tailwind directives (AC: Tailwind classes work)
  - [ ] 5.1: Add @tailwind base, components, utilities
  - [ ] 5.2: Test basic Tailwind classes (bg-blue-500, text-white)

- [ ] Task 6: Verify development server (AC: All features work)
  - [ ] 6.1: Run `npm run dev` and confirm server starts on port 3000
  - [ ] 6.2: Access http://localhost:3000 and see default page
  - [ ] 6.3: Test Hot Module Replacement by editing page.tsx
  - [ ] 6.4: Verify no console errors

## Dev Notes

### Technical Requirements from Architecture

**Required Versions:**
- Next.js: 14+ (latest stable)
- React: 18+ (comes with Next.js 14)
- TypeScript: 5.1+
- Node.js: 20.9+ (prerequisite)
- Ant Design: v5.x (latest)
- Tailwind CSS: v3.x (comes with Next.js)

**Key Configuration Points:**
- App Router architecture (not Pages Router)
- TypeScript strict mode enabled
- Import aliases `@/*` for clean imports
- Turbopack bundler for development (faster than Webpack)
- ESLint with Next.js recommended rules

**Project Structure Pattern (from Architecture Decision):**
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with AntdRegistry
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Tailwind directives
│   ├── components/            # React components (Ant Design based)
│   ├── lib/                   # Core utilities
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Helpers
├── public/                    # Static assets
└── package.json
```

### Architecture Compliance

**Decision References:**
- Starter Template: Next.js Official CLI (Architecture Doc, Starter Template Evaluation section)
- Naming Convention: PascalCase for components, kebab-case for utilities (Implementation Patterns)
- Ant Design as Primary UI Library (PRD Technical Requirements, Architecture Fixed Choices)
- TypeScript strict mode (Architecture Starter Template section)

**Key Architecture Patterns to Apply:**
1. **Component Naming:** PascalCase for .tsx files (ChatInterface.tsx, MessageBubble.tsx)
2. **Utility Naming:** kebab-case for .ts files (api-client.ts, auth.ts)
3. **Import Aliases:** Use `@/*` for clean imports: `import { Button } from '@/components/ui/Button'`
4. **Ant Design Usage:** Primary UI components, theme via ConfigProvider
5. **Tailwind:** Complementary utility classes, not replacing Ant Design

### File Structure Requirements

**Must Create Directories:**
- `src/components/` - For React components using Ant Design
- `src/lib/` - For core utilities (api-client, auth, websocket)
- `src/hooks/` - For custom hooks (useAuth, useChat, useWebSocket)
- `src/types/` - For TypeScript interfaces (auth.types.ts, chat.types.ts)
- `src/utils/` - For helper functions (validators, formatters)

**Critical Files to Configure:**
- `app/layout.tsx` - Must wrap with AntdRegistry
- `app/globals.css` - Must include Tailwind directives
- `tsconfig.json` - Verify strict mode and @/* alias
- `next.config.js` - Default Next.js config is sufficient for MVP

### Testing Standards Summary

**For This Story:**
- Manual testing: Run dev server, access homepage, verify HMR
- Visual check: Ant Design Button renders with correct styling
- Tailwind check: Test utility classes work (bg-blue-500, etc.)

**Future Stories Will Add:**
- Component tests with React Testing Library
- Jest configuration for unit tests
- Playwright/Cypress for E2E (growth phase)

### Validation Checklist

Before marking this story complete, verify:

- [ ] `npx create-next-app` command executed successfully
- [ ] Node.js version is 20.9+ (`node --version`)
- [ ] Next.js version is 14+ (check package.json)
- [ ] TypeScript version is 5.1+ (check package.json)
- [ ] Ant Design v5 installed (check package.json: "antd": "^5.x.x")
- [ ] @ant-design/nextjs-registry installed
- [ ] All required directories exist (components, lib, hooks, types, utils)
- [ ] app/layout.tsx has AntdRegistry wrapper
- [ ] Development server runs without errors (`npm run dev`)
- [ ] Homepage accessible at http://localhost:3000
- [ ] HMR works (edit page.tsx, see instant update)
- [ ] No console errors in browser developer tools
- [ ] Ant Design Button component renders correctly
- [ ] Tailwind utility classes work (test with bg-blue-500 etc.)

### References

**Source Documents:**
- [PRD - Technical Requirements - Tech Stack](docs/prd.md#technical-requirements)
- [Architecture - Starter Template Evaluation - Frontend: Next.js Official CLI](docs/architecture.md#starter-template-evaluation)
- [Architecture - Implementation Patterns - Naming Patterns](docs/architecture.md#implementation-patterns--consistency-rules)
- [Epic 1: Foundation & Infrastructure Setup - Story 1.1](docs/epics.md#story-11-initialize-nextjs-frontend-project)

### Project Context Reference

**Project:** langchain - AI Chatbot Full-Stack Learning Playground
**Epic:** Epic 1 - Foundation & Infrastructure Setup
**Story Position:** First story (1.1) - Foundation for all frontend work
**Dependencies:** None (this is the first story)
**Blockers:** None
**Next Story:** 1.2 - Initialize FastAPI Backend Project

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
