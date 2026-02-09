# Comprehensive API Integration Guide

This guide details the end-to-end flows for the Mateen Hostel management system, divided by user role and functional area. Use this to map your frontend components to the backend API.

## Base Configuration
- **Base URL**: `/api/v1`
- **Auth**: `Authorization: Bearer <token>` (JWT)

---

## 🚀 1. Resident Features
These endpoints are specifically for users with the `resident` role.

### A. Room & Community
| Feature | Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Room Details** | `/residents/room` | `GET` | `None` | View assigned room, roommates, amenities, and hostel info. |
| **Announcements** | `/residents/announcements` | `GET` | `None` | Read hostel-wide notices, policy changes, and events. |
| **Give Feedback** | `/residents/feedback` | `POST` | `CreateFeedbackDto` | Submit ratings and suggestions for hostel services. |

**`CreateFeedbackDto`:**
```json
{
  "rating": 5,           // 1-5 scale
  "comment": "String",   // Suggest improvements
  "category": "String"   // "service", "cleanliness", etc.
}
```

### B. Requests & Reporting (Issue Tracking)
Integrated system for maintenance, roommate issues, and emergencies.

| Feature | Endpoint | Method | Payload | Category Hint |
| :--- | :--- | :--- | :--- | :--- |
| **Submit Request** | `/residents/requests` | `POST` | `CreateMaintenanceRequestDto` | Use for maintenance, room changes, or replacements. |
| **Track Requests** | `/residents/requests` | `GET` | `None` | Monitor status (pending, in-progress, resolved). |

**`CreateMaintenanceRequestDto`:**
```json
{
  "type": "maintenance", // "maintenance", "room_change", "item_replacement", "other"
  "subject": "String",    // e.g., "Emergency: Water Leak"
  "description": "String",
  "priority": "low",      // "low", "medium", "high", "critical"
  "images": ["url1"]     // Optional array of URLs
}
```

### C. Service & Facility Booking
Book extras like laundry, gym, or study rooms.

| Feature | Endpoint | Method | Payload |
| :--- | :--- | :--- | :--- |
| **List Services** | `/services/list/:hostelId` | `GET` | `None` |
| **Book Service** | `/services/book` | `POST` | `BookServiceDto` |
| **My Bookings** | `/services/bookings` | `GET` | `None` |

**`BookServiceDto`:**
```json
{
  "serviceId": "String",
  "bookingDate": "DateISO"
}
```

### D. Payments & Documents
| Feature | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Billing summary** | `/residents/billing` | `GET` | Balance owed, payment history, and partial payment settings. |
| **Export Status** | `/exports/payments/:hostelId` | `GET` | Download payment history as CSV (can be converted to Receipts). |

---

## 🛠️ 2. Administrative Features
These endpoints are for `admin` or `super_admin` roles to manage the hostel.

### A. Service & Facility Management
| Feature | Endpoint | Method | Role | Payload |
| :--- | :--- | :--- | :--- | :--- |
| **Create Service**| `/services/create` | `POST` | `Admin` | `CreateHostelServiceDto` |

**`CreateHostelServiceDto`:**
```json
{
  "name": "Gym Access",
  "description": "24/7 access to physical fitness center",
  "price": 50.0,         // Optional fee
  "availability": true
}
```

### B. Communication Control
| Feature | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Add Announcement**| `/admin/announcement/add` | `POST` | Post fire drills, events, or policy changes. |

### C. Resident Lifecycle
| Feature | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Add Resident** | `/residents/add` | `POST` | Manual onboarding by admin. |
| **Assign Room** | `/residents/assign/:id`| `PUT` | Link a resident to a specific room ID. |
| **Download Data** | `/exports/residents/:id`| `GET` | Export all resident data for allocation records. |

---

## 📂 3. Document Flow for Frontend
The backend currently handles data exports via `/exports`. For specific PDF generation (e.g., Allocation Letters):
1. **Receipts**: Use the `/residents/billing` data to generate a UI receipt.
2. **Allocation Letters**: Use `/residents/room` data (Resident Name + Room Number + Hostel Name) to populate a frontend PDF/Print template.
3. **Hostel Rules**: Typically served as a static asset or a specific "Policy" announcement in `/residents/announcements`.

---

## Summary of Casing & Types
- **Prisma Client**: Use camelCase for methods (e.g., `prisma.maintenanceRequest`).
- **Date Format**: ISO 8601 string (e.g., `"2025-12-26T10:00:00Z"`).
- **Amount/Price**: Float/Number values.
