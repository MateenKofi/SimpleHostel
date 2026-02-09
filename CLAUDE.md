# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains **two separate applications** forming a complete hostel management system:

- **`mateen_hostel/`** - Backend API server (Node.js/Express + TypeScript + PostgreSQL + Prisma)
- **`SimpleHostel/`** - Frontend React application (React 18 + Vite + TypeScript)

The system manages hostel operations including: resident management, room bookings, payments, visitor management, maintenance requests, staff management, and analytics.

---

## Backend (mateen_hostel/)

### Development Commands

```bash
cd mateen_hostel

# Install dependencies (uses pnpm)
pnpm install

# Development server (port 2020)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database migrations
pnpm migrate

# Generate Prisma client
pnpm generate

# Vercel build
pnpm vercel-build
```

### Architecture

**Entry Point**: `src/index.ts` - Express server on port 2020

**Directory Structure**:
- `controller/` - Business logic layer
- `routes/` - API route definitions (mounted at `/api/v1`)
- `middleware/` - Auth, rate limiting (express-rate-limit)
- `utils/` - Prisma client, helpers
- `zodSchema/` - Input validation schemas
- `services/` - External service integrations (Paystack, Cloudinary, Nodemailer)
- `prisma/` - Database schema and migrations

**Database**: PostgreSQL with Prisma ORM. Schema includes:
- Role-based access: `super_admin`, `admin`, `staff`, `resident`
- Multi-hostel support with `Hostel` model
- Room management with types: `single`, `double`, `suite`, `quad`
- Payment processing via Paystack integration
- Visitor management, maintenance requests, announcements

**API Routes** (all under `/api/v1`):
- `/hostels` - Hostel CRUD
- `/rooms` - Room management
- `/residents` - Resident operations
- `/staffs` - Staff management
- `/payments` - Payment processing
- `/visitors` - Visitor logging
- `/calendar` - Calendar year management
- `/admin/*` - Admin endpoints (maintenance, announcements)
- `/analytics` - Analytics data
- `/services` - Hostel services
- `/exports` - Data exports

**Authentication**: JWT-based with role-based access control. Middleware validates tokens and enforces permissions.

---

## Frontend (SimpleHostel/)

### Development Commands

```bash
cd SimpleHostel

# Install dependencies (uses npm)
npm install

# Development server (port 2020)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview build
npm run preview
```

### Architecture

**Entry Point**: `src/main.tsx` → `src/App.tsx`

**Tech Stack**:
- React 18 with Vite
- TypeScript in strict mode
- Tailwind CSS + Shadcn UI (Radix primitives) + DaisyUI
- Zustand for global client state
- TanStack Query (React Query) for server state
- React Router DOM v6 for routing
- React Hook Form + Zod for validation
- Axios for HTTP client

**Directory Structure** (enforced):
- `api/` - API services & HTTP logic (Axios calls)
- `components/` - Shared components
  - `ui/` - Shadcn primitive components
- `pages/` - Route-level page components
  - `dashboard/` - Protected dashboard pages
  - `landing-page/` - Public pages
- `stores/` - Zustand state stores
- `schemas/` - Zod validation schemas
- `hooks/` - Custom React hooks
- `providers/` - React context providers
- `helper/` - Constants & helpers
- `lib/` - Shared utilities
- `utils/` - General utilities

**State Management**:
- **Server state**: TanStack Query (`useQuery`, `useMutation`) - never sync manually
- **Global client state**: Zustand stores (auth, selected room, calendar year)
- **Local UI state**: `useState`

**Path Aliases** (configured in `tsconfig.json`):
```typescript
@/*           → ./src/*
@components/* → src/components/*
@pages/*      → src/pages/*
@stores/*     → src/stores*
@lib/*        → src/lib/*
@assets/*     → src/assets/*
@providers/*  → src/providers/*
```

**Routing Structure**:
- Public: `/`, `/about`, `/contact`, `/find-hostel`, `/login`, `/register`
- Protected (under `/dashboard`): dashboard, room-management, resident-management, etc.

**Key Stores**:
- `useAuthStore` - Authentication state, token management, user data
- `useSelectedRoomStore` - Currently selected room
- `useSelectedCalendarYearStore` - Active calendar year
- `useAddedResidentStore` - Resident addition flow

---

## Design System & Color Scheme

### Color Palette

The application uses a **forest-green centered** color scheme defined in `tailwind.config.js` and `src/index.css`.

#### CSS Variables (Theme Tokens)

| Variable | Usage | HSL Value |
|----------|-------|-----------|
| `--primary` | Primary brand color | `hsl(160, 30%, 38%)` |
| `--primary-foreground` | Text on primary | `hsl(0, 0%, 98%)` |
| `--secondary` | Secondary backgrounds | `hsl(30, 15%, 85%)` |
| `--secondary-foreground` | Text on secondary | `hsl(30, 10%, 15%)` |
| `--destructive` | Error/danger states | `hsl(5, 75%, 55%)` |
| `--destructive-foreground` | Text on destructive | `hsl(0, 0%, 98%)` |
| `--muted` | Disabled/subtle backgrounds | `hsl(30, 10%, 85%)` |
| `--muted-foreground` | Subtle text | `hsl(30, 5%, 40%)` |
| `--accent` | Accent highlights | `hsl(155, 25%, 45%)` |
| `--accent-foreground` | Text on accent | `hsl(0, 0%, 98%)` |
| `--background` | Page background | `hsl(0, 0%, 100%)` |
| `--foreground` | Primary text | `hsl(30, 5%, 15%)` |
| `--card` | Card backgrounds | `hsl(0, 0%, 100%)` |
| `--card-foreground` | Text on cards | `hsl(30, 5%, 15%)` |
| `--border` | Border colors | `hsl(30, 10%, 85%)` |
| `--input` | Input borders | `hsl(30, 10%, 80%)` |
| `--ring` | Focus rings | `hsl(160, 30%, 38%)` |
| `--popover` | Dropdown/popover backgrounds | `hsl(0, 0%, 100%)` |
| `--popover-foreground` | Text on popovers | `hsl(30, 5%, 15%)` |

#### Extended Color Palette

**Forest Green** (primary brand colors):
- `forest-green-50`: `#f6fcf9` → `forest-green-950`: `#0b100d`

**Teal Green** (secondary accent):
- `teal-green-50`: `#f0fdf9` → `teal-green-950`: `#042f2e`

**Sage Green** (tertiary accent):
- `sage-green-50`: `#f7f9f6` → `sage-green-950`: `#0c180d`

**Warm Gray** (neutral backgrounds):
- `warm-gray-50`: `#faf9f7` → `warm-gray-950`: `#13100e`

**Warm Red** (destructive actions):
- `warm-red-50`: `#fef2f2` → `warm-red-950`: `#450a0a`

### Color Usage Guidelines

**When adding/modifying components:**

1. **Always use theme variables** for UI primitives:
   - Backgrounds: `bg-background`, `bg-card`, `bg-muted`, `bg-popover`
   - Text: `text-foreground`, `text-muted-foreground`, `text-card-foreground`
   - Borders: `border-border`, `border-input`
   - Primary actions: `bg-primary`, `text-primary-foreground`
   - Destructive actions: `bg-destructive`, `text-destructive-foreground`

2. **Use extended palette** for accent elements:
   - Forest green shades for primary branding
   - Teal/sage green for secondary accents
   - Warm gray for neutral elements

3. **Never hardcode** colors like:
   - ❌ `bg-white`, `bg-gray-100`, `text-gray-900`
   - ❌ `bg-zinc-*`, `text-zinc-*`
   - ✅ `bg-card`, `text-foreground`, `text-muted-foreground`

4. **Focus states** should use:
   - `focus:ring-ring` for focus rings
   - `focus:bg-muted` for interactive elements

### Component Color Reference

| Component | Primary Classes |
|-----------|-----------------|
| Button | `bg-primary text-primary-foreground` |
| Badge | `bg-primary text-primary-foreground` |
| Card | `bg-card text-card-foreground border-border` |
| Input | `border-input bg-background` |
| Dialog/Sheet | `bg-card` |
| Dropdown/Select | `bg-popover text-popover-foreground` |
| Sidebar (active) | `bg-forest-green-300 text-forest-green-800` |
| Sidebar (hover) | `bg-forest-green-100 text-forest-green-700` |

---

## Engineering Standards (Frontend)

From `.agent/rules/simplehostelfrontend.md`:

**Core Principles**:
- Do not break existing functionality
- Do not introduce unnecessary complexity
- Do not add dependencies without justification
- Do not duplicate logic

**Technology Constraints**:
- Use only approved stack (React, Tailwind, Shadcn UI, Zustand, TanStack Query)
- No new dependencies without justification
- Frontend role checks ≠ security (backend enforces permissions)

**Must-Not-Do**:
- Never break existing functionality
- Never introduce new dependencies unnecessarily
- Never duplicate logic
- Never hardcode values (use constants/env)
- Never mutate server data manually (use `invalidateQueries`)

**Pre-commit**: Run `npm run lint` before committing.

---

## Environment Configuration

**Backend** (`.env` in `mateen_hostel/`):
- `Simplehostel_v1_PRISMA_DATABASE_URL` - PostgreSQL connection
- `Simplehostel_v1_POSTGRES_URL` - Direct PostgreSQL URL
- `PORT` - Server port (default 2020)
- JWT secret, Paystack keys, Cloudinary credentials, email config

**Frontend** (`.env` in `SimpleHostel/`):
- `VITE_API_URL` - Backend API base URL

---

## Database Migrations

When modifying the Prisma schema:
1. Edit `mateen_hostel/prisma/schema.prisma`
2. Run `pnpm migrate` to create and apply migration
3. Run `pnpm generate` to regenerate Prisma client

---

## Testing

No formal test framework is currently configured. ESLint is used for code quality on the frontend. Backend has TypeScript compilation (`tsc`) for type checking.

---

## Deployment

Both applications deploy to Vercel:
- Backend: Serverless functions via `vercel-build`
- Frontend: Static build with sitemap generation

Backend runs the `createSuperAdminUser()` function on deployment to ensure admin exists.
