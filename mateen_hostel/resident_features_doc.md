# Resident Features Documentation

This document outlines the resident-facing features implemented for the Mateen Hostel management system, including API endpoints, access roles, and data structures.

## Overview
Recent updates have addressed synchronization issues between the Prisma schema and the generated client, enabling full support for maintenance requests, feedback, billing, and announcement systems.

---

## 1. Authentication & Roles
- **Resident**: Primary user for room-related services.
- **Admin / Super Admin**: Staff users responsible for resident management.

All endpoints (except registration) require a valid JWT token in the `Authorization` header:
`Authorization: Bearer <your_token>`

---

## 2. Maintenance Requests Flow
Residents can report issues within their rooms or the hostel.

### Create Maintenance Request
- **Endpoint**: `POST /api/v1/resident/requests`
- **Role**: `resident`
- **Request Body**:
```json
{
  "type": "maintenance", // "maintenance", "room_change", "item_replacement", "other"
  "subject": "Broken Tap",
  "description": "The kitchen tap is leaking since morning.",
  "priority": "medium",    // "low", "medium", "high", "critical"
  "images": [             // Optional
    "https://example.com/image1.jpg"
  ]
}
```

### View My Requests
- **Endpoint**: `GET /api/v1/resident/requests`
- **Role**: `resident`
- **Description**: Returns all maintenance requests submitted by the logged-in resident.

---

## 3. Billing & Payments
Residents can track their financial status and payment history.

### View Billing Summary
- **Endpoint**: `GET /api/v1/resident/billing`
- **Role**: `resident`
- **Response Shape**:
```json
{
  "payments": [...],
  "summary": {
    "totalBalance": 1200.0,
    "allowPartialPayment": true
  }
}
```

---

## 4. Hostel Communication
Stay updated with hostel-wide announcements.

### View Announcements
- **Endpoint**: `GET /api/v1/resident/announcements`
- **Role**: `resident`
- **Description**: Fetches all announcements relevant to the resident's hostel.

---

## 5. Feedback System
Submit ratings and comments about the hostel experience.

### Create Feedback
- **Endpoint**: `POST /api/v1/resident/feedback`
- **Role**: `resident`
- **Request Body**:
```json
{
  "rating": 5,           // 1-5 scale
  "comment": "Great service!",
  "category": "service"  // Optional: "room", "wifi", "cleanliness", etc.
}
```

---

## 6. Room & Roommates
View details about the assigned room and shared occupants.

### Get Room Details
- **Endpoint**: `GET /api/v1/resident/room`
- **Role**: `resident`
- **Description**: Provides details about the room (amenities, floor) and a list of current roommates.

---

## 7. Administrative Management
Endpoints used by Admins to manage residents.

| Endpoint | Method | Role | Object to Pass |
|----------|--------|------|----------------|
| `/resident/add` | POST | Admin/Super | `ResidentRequestDto` |
| `/resident/update/:id` | PUT | Admin/Super | `UpdateResidentRequestDto` |
| `/resident/assign/:id` | PUT | Admin/Super | `{"roomId": "..."}` |
| `/resident/delete/:id` | DELETE | Admin/Super | N/A |

---

## Technical Changes Summary
- **Prisma Client Sync**: Fixed the error `Property 'maintenanceRequest' does not exist` by regenerating the client using `npx prisma generate`.
- **Model Validation**: Ensured `MaintenanceRequest` model maps correctly to the camelCase `prisma.maintenanceRequest` property.
- **Type Safety**: Integrated Zod schemas (`requestSchema.ts`, `feedbackSchema.ts`) for all new resident endpoints.
