# Resident Features API Documentation (Frontend Ready)

This document provides a comprehensive guide for frontend developers to integrate the resident-related features of the Mateen Hostel management system.

## Base Configuration
- **Base URL**: `/api/v1/resident`
- **Authentication**: All endpoints (except `/register`) require a JWT token in the `Authorization` header as a Bearer token.
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

---

## 1. Resident Flow Overview
1. **Registration**: Resident signs up via `/register`.
2. **Setup**: Admin assigns a room and hostel via `/assign/:residentId`.
3. **Engagement**: Resident can view room details, roommates, billing, and announcements.
4. **Support**: Resident can submit maintenance requests and hostel feedback.

---

## 2. API Endpoints

### A. Maintenance Requests
Residents can report maintenance issues or request room changes.

| Feature | Endpoint | Method | Role | Payload Object |
| :--- | :--- | :--- | :--- | :--- |
| **Create Request** | `/requests` | `POST` | `resident` | `CreateMaintenanceRequestDto` |
| **Get My Requests** | `/requests` | `GET` | `resident` | `None` |

**Request Body (`CreateMaintenanceRequestDto`):**
```json
{
  "type": "maintenance", // "maintenance", "room_change", "item_replacement", "other"
  "subject": "String",    // e.g., "Leaking Pipe"
  "description": "String", 
  "priority": "low",      // "low", "medium", "high", "critical"
  "images": ["url1", "url2"] // Optional: Array of valid image URLs
}
```

---

### B. Billing & Payments
Access financial records and total balance status.

| Feature | Endpoint | Method | Role | Response data |
| :--- | :--- | :--- | :--- | :--- |
| **Billing Summary** | `/billing` | `GET` | `resident` | `billingInfo` object |
| **Confirm Payment** | `/api/payments/confirm` | `GET` | `Public` | Confirmation Object |

**Confirmation Endpoint Usage:**
- **URL**: `/api/payments/confirm?reference=<PAYSTACK_REFERENCE>`
- **Description**: Verifies a payment with Paystack and updates the resident's room/balance. Call this immediately when the user is redirected to the success page.

**Frontend Code Example (React/Next.js):**
```typescript
"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  async function verifyPayment(ref: string) {
    try {
      // Replace YOUR_BACKEND_URL with your actual API URL
      const res = await fetch(`YOUR_BACKEND_URL/api/payments/confirm?reference=${ref}`);
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  }

  if (status === 'verifying') return <p>Verifying payment...</p>;
  if (status === 'error') return <p>Payment verification failed. Please contact support.</p>;
  return <p>Payment Successful! Room assigned.</p>;
}
```

**Response Object Structure:**
```json
{
  "message": "Billing info fetched successfully",
  "data": {
    "payments": [
      {
        "id": "String",
        "amount": 100.0,
        "status": "confirmed",
        "calendarYear": { "name": "2024/2025" },
        "createdAt": "DateTime"
      }
    ],
    "summary": {
      "totalBalance": 500.0,
      "allowPartialPayment": true
    }
  }
}
```

---

### C. Communication & Feedback
Receive updates and provide feedback on the hostel experience.

| Feature | Endpoint | Method | Role | Payload Object |
| :--- | :--- | :--- | :--- | :--- |
| **Announcements** | `/announcements` | `GET` | `resident` | `None` |
| **Give Feedback** | `/feedback` | `POST` | `resident` | `CreateFeedbackDto` |

**Request Body (`CreateFeedbackDto`):**
```json
{
  "rating": 5,           // Number (1-5)
  "comment": "String",   // Optional
  "category": "String"   // Optional (e.g., "cleanliness", "staff", "food")
}
```

---

### D. Room & Roommates
View details about the assigned space and shared kitchen/bathrooms.

| Feature | Endpoint | Method | Role | Response data |
| :--- | :--- | :--- | :--- | :--- |
| **Room Details** | `/room` | `GET` | `resident` | `roomDetails` object |

**Response Object Structure:**
```json
{
  "message": "Room details fetched successfully",
  "data": {
    "resident": { ...ResidentProfile },
    "room": {
      "number": "A101",
      "floor": "1st",
      "amenities": [{ "name": "AC" }]
    },
    "roommates": [
      {
        "id": "String",
        "user": { "name": "John Doe", "email": "...", "avatar": "..." }
      }
    ]
  }
}
```

---

### E. Account Management (Registration)
Used during the onboarding phase.

| Feature | Endpoint | Method | Role | Payload Object |
| :--- | :--- | :--- | :--- | :--- |
| **Register** | `/register` | `POST` | `Public` | `ResidentRequestDto` |

**Request Body (`ResidentRequestDto`):**
```json
{
  "firstName": "String",
  "lastName": "String",
  "email": "String",
  "phone": "String",
  "password": "String", // Min 8 characters
  "studentId": "String",
  "course": "String",
  "roomId": "String",   // Optional during signup
  "gender": "male"      // "male", "female", "other"
}
```

---

## 3. Administrative Operations (For Admin Frontend)
These endpoints are used by hostel administrators to manage resident accounts.

| Feature | Endpoint | Method | Role | Payload |
| :--- | :--- | :--- | :--- | :--- |
| **Add Resident** | `/add` | `POST` | `admin` | `ResidentRequestDto` |
| **Update Resident** | `/update/:id` | `PUT` | `admin` | `UpdateResidentRequestDto` |
| **Assign Room** | `/assign/:id` | `PUT` | `admin` | `{"roomId": "ID"}` |
| **Get Hostel Residents**| `/hostel/:hostelId`| `GET`| `admin`| `None` |

---

## Technical Appendix
- **Error Handling**: All errors follow the standard format:
  ```json
  { "message": "Detailed error description" }
  ```
- **Prisma Integration**: Successfully synced `maintenanceRequest` model.
- **Client Sync**: Resolved discrepancies between database schema and generated client types.
