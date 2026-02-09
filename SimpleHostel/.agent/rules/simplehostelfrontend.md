---
trigger: always_on
---

SimpleHostel
Development Rules, Guidelines & Engineering Standards

Build once. Scale clean. Sleep at night.

This document defines how code is written, reviewed, extended, and protected in the SimpleHostel project.
Every contributor must follow this to preserve stability, security, and velocity.

1. Core Principles

These are not suggestions.

Do not break existing functionality

Do not introduce unnecessary complexity

Do not add dependencies without justification

Do not duplicate logic

Do not guess — read the existing code

Respect the system. It remembers everything you change.

2. Technology Stack (Approved Only)
Frontend

React v18+ (Vite)

TypeScript (Strict Mode — mandatory)

Styling & UI

Tailwind CSS

Shadcn UI (Radix Primitives)

Lucide React (icons)

State & Data

Zustand → global client state

TanStack Query (React Query) → server state

Axios → HTTP client

Routing & Forms

React Router DOM v6

React Hook Form

Zod (schema validation)

Dates

date-fns or dayjs

🚫 If it’s not here, it doesn’t belong.

3. Project Structure (Non-Negotiable)
src/
├── api/            # API services & HTTP logic
├── assets/         # Images, fonts, static files
├── components/     # Shared components
│   ├── ui/         # Shadcn primitives
│   └── ...
├── controllers/    # Business logic (when needed)
├── helper/         # Constants & helpers
├── hooks/          # Custom hooks
├── lib/            # Shared utilities & configs
├── pages/          # Route-level pages
│   ├── dashboard/
│   └── ...
├── providers/      # Context providers
├── schemas/        # Zod schemas
├── stores/         # Zustand stores
└── utils/          # General utilities


Structure is stability.
Freestyling creates bugs you’ll meet later.

4. Naming Conventions
Files & Folders

Components → PascalCase.tsx

Folders → kebab-case

Hooks → useSomething.ts

Utilities → camelCase.ts

Constants → UPPER_SNAKE_CASE

Code

Components → PascalCase

Variables & functions → camelCase

Types & interfaces → PascalCase

Props → ComponentNameProps

Names should explain themselves without comments.

5. TypeScript Rules

Strict typing only

No any

No implicit unknown

All API responses must be typed

Props, state, and store slices must be typed

If TypeScript is quiet, you earned it.

6. Import Rules

Use path aliases. Always.

@/components
@/lib
@/pages
@/api


No ../../../ nonsense.
Clean imports, clear thinking.

7. Component Rules

Functional components only

Small, composable components

Pages → export default

Reusable components → named exports

No business logic inside JSX

Components should read like poetry, not puzzles.

8. State Management Rules
Local UI State

useState

useDisclosure-style hooks if needed

Global Client State

Zustand only

Examples:

auth session

sidebar state

UI preferences

Server State

TanStack Query always

useQuery, useMutation

No API data in Zustand unless absolutely necessary

🚫 Never sync server state manually.

9. API Rules

Axios calls live in src/api

Components must never call Axios directly

One responsibility per API function

No inline URLs

No duplicated endpoints

If the API changes, it should change in one place.

10. Styling Rules (Tailwind + Shadcn)

Utility-first Tailwind

Mobile-first design

Respect breakpoints: sm, md, lg

Use cn() for conditional classes

import { cn } from "@/lib/utils"


Design should breathe.
Over-styling is noise.

11. Form & Validation Rules

React Hook Form for state

Zod for validation

Schemas live in src/schemas

No inline validation logic

Forms must fail gracefully and clearly.

12. ❌ Must-Not-Do Rules (Hard Stops)
Never break existing functionality

Understand current behavior first

Preserve outputs

Test affected flows

Never introduce new dependencies unnecessarily

Ask:

Can Tailwind handle this?

Can Shadcn handle this?

Can Zustand or React Query handle this?

If yes → stop.

Never duplicate logic

Reuse helpers

Reuse schemas

Reuse components

Duplication is silent debt.

Never hardcode values

No roles

No URLs

No magic strings

Use constants or env variables.

Never mutate server data manually

Use invalidateQueries

Let TanStack Query work

13. Security Rules (Zero Compromise)
Authentication

Assume the user is untrusted

Frontend role checks ≠ security

Backend must enforce permissions

Input Handling

Validate everything with Zod

Sanitize user-generated content

Never trust form input

Secrets

No secrets in frontend code

No tokens in logs

No sensitive data in console

Security is not optional.
It’s a feature.

14. Error Handling Rules
API Errors

Handle:

loading

error

success

Never leave users guessing.

User Errors

Clear

Human

Actionable

Developer Errors

Log context

Avoid console spam

No swallowed errors

Fail loud in dev.
Fail calm in prod.

15. Logging & Observability

Log:

failed mutations

unexpected states

permission violations

Never log:

passwords

tokens

personal data

Logs should tell a story — not gossip.

16. Testing Rules
What Must Be Tested

Business logic

Validation schemas

Critical flows

What Must NOT Be Tested

React internals

Third-party libraries

Implementation details

Test behavior.
Confidence lives there.

17. Feature Development Rules

Before building anything, answer:

What existing code does this touch?

What must not change?

How does this fail?

Where does this plug in?

Anchoring Rule

Every feature must:

reuse existing components

respect current API contracts

align with current flows

No floating features.
Everything connects.

18. Git & Workflow

Clear commit messages

Feature branches only

Run npm run lint before committing

Fix warnings — don’t ignore them

Clean history. Calm future.

19. Pre-Merge Checklist

Before merging:

App runs

Affected flows tested

No regressions

No unused code

No console noise

If you didn’t test it, you didn’t finish it.

Final Words

SimpleHostel is a living system.
Every line you write echoes forward.

Build with care.
Move with intention.
Leave the code better than you found it.