---
trigger: always_on
---

# SimpleHostel — Design Patterns Guide

This document defines the **approved design patterns** used in the SimpleHostel codebase.

These patterns exist to:

* keep the system predictable
* reduce bugs and regressions
* make onboarding painless
* prevent over‑engineering

This is **not theory**. Everything here is grounded in how SimpleHostel is built today.

---

## 1. Core Philosophy

* Patterns are tools, not religion
* Prefer clarity over cleverness
* Optimize for future readers
* If a pattern adds friction, question it

Rules define boundaries.
Patterns define craftsmanship.

---

## 2. Component Patterns

### 2.1 Container / Presentational Pattern

**When to use:**

* Pages
* Data‑driven views
* Anything touching APIs

**Why:**

* Separates data logic from UI
* Makes components reusable
* Improves testability

#### Example

**Container (data + logic)**

```tsx
// pages/residents/ResidentsPage.tsx
import { useResidents } from "@/hooks/useResidents"
import { ResidentsTable } from "@/components/residents/ResidentsTable"

export default function ResidentsPage() {
  const { data, isLoading, isError } = useResidents()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Failed to load residents</div>

  return <ResidentsTable residents={data} />
}
```

**Presentational (UI only)**

```tsx
// components/residents/ResidentsTable.tsx
interface ResidentsTableProps {
  residents: Resident[]
}

export function ResidentsTable({ residents }: ResidentsTableProps) {
  return (
    <table>
      {residents.map(r => (
        <tr key={r.id}>{r.name}</tr>
      ))}
    </table>
  )
}
```

🚫 **Anti‑pattern**: API calls inside UI components

---

### 2.2 Feature‑Based Composition

**When to use:**

* Large features (Booking, Residents, Payments)

**Why:**

* Prevents God components
* Encourages reuse

#### Example

```
BookingDetails
├── BookingSummary
├── BookingActions
├── BookingTimeline
└── BookingPayments
```

Each sub‑component owns **one responsibility**.

---

## 3. State Management Patterns

### 3.1 Server State → TanStack Query

**Use when:**

* Data comes from an API
* Needs caching or refetching

```ts
// hooks/useResidents.ts
import { useQuery } from "@tanstack/react-query"
import { getResidents } from "@/api/residents"

export function useResidents() {
  return useQuery({
    queryKey: ["residents"],
    queryFn: getResidents,
  })
}
```

🚫 **Anti‑pattern**: Storing API data in Zustand

---

### 3.2 Global Client State → Zustand

**Use when:**

* UI preferences
* Auth session
* Cross‑page UI state

```ts
// stores/useAuthStore.ts
import { create } from "zustand"

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  setUser: user => set({ user }),
}))
```

🚫 **Anti‑pattern**: Using Zustand for server responses

---

### 3.3 Local UI State → useState

**Use when:**

* Modal open/close
* Toggle states

```tsx
const [open, setOpen] = useState(false)
```

Keep it boring.

---

## 4. Data Fetching Patterns

### 4.1 Query Key Strategy

**Rule:** Query keys must reflect **what changes**.

```ts
["bookings", filters]
["resident", residentId]
```

🚫 **Anti‑pattern**: Flat keys that cause stale data

---

### 4.2 Mutations + Invalidation

```ts
const mutation = useMutation({
  mutationFn: createBooking,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] })
  },
})
```

🚫 Never manually update cached data unless necessary.

---

## 5. Form Patterns

### 5.1 Schema‑First Forms

**Flow:** Zod → React Hook Form

```ts
// schemas/residentSchema.ts
import { z } from "zod"

export const residentSchema = z.object({
  name: z.string().min(1),
  roomId: z.string(),
})
```

```tsx
const form = useForm<ResidentFormValues>({
  resolver: zodResolver(residentSchema),
})
```

🚫 **Anti‑pattern**: Inline validation logic

---

### 5.2 Reusable Form Fields

Encapsulate input + error logic.

```tsx
<FormInput name="name" label="Resident Name" />
```

---

## 6. Routing Patterns

### 6.1 Protected Routes

```tsx
function ProtectedRoute({ children }: Props) {
  const user = useAuthStore(state => state.user)

  if (!user) return <Navigate to="/login" />
  return children
}
```

---

### 6.2 Role‑Based Guards

```tsx
if (user.role !== "admin") {
  return <Forbidden />
}
```

🚫 UI checks alone are not security.

---

## 7. Error Handling Patterns

### 7.1 API Error Mapping

```ts
function mapApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "Server error"
  }
  return "Unexpected error"
}
```

---

### 7.2 User‑Safe Errors

* Never show stack traces
* Never expose raw backend errors

---

## 8. Security Patterns

### 8.1 Permission Gates

```tsx
<Can role="admin">
  <DeleteButton />
</Can>
```

### 8.2 Token Handling

* Tokens live in memory or http‑only cookies
* Never log tokens

---

## 9. Decision Table — When to Use What

| Problem         | Use This            | Do NOT Use     |
| --------------- | ------------------- | -------------- |
| API data        | TanStack Query      | Zustand        |
| Global UI state | Zustand             | Context abuse  |
| Forms           | RHF + Zod           | useState       |
| Styling         | Tailwind + Shadcn   | Inline CSS     |
| Validation      | Zod schemas         | Inline checks  |
| Side effects    | useEffect (minimal) | Business logic |

---

## 10. Anti‑Patterns (From Real Projects)

### ❌ God Components

```tsx
// 800 lines, API calls, modals, logic, UI mixed
```

Fix: Split by responsibility.

---

### ❌ Inline Axios Calls

```ts
axios.get("/api/residents")
```

Fix: Move to `src/api`.

---

### ❌ Duplicated Schemas

```ts
z.string().min(1)
```

Fix: Reuse schema definitions.

---

### ❌ Manual Cache Syncing

```ts
queryClient.setQueryData(...)
```

Fix: Invalidate queries.

---

## Final Note

Patterns are leverage.
Use them wisely.

Consistency compounds.
Discipline scales.

If a pattern isn’t here, it probably doesn’t belong.
