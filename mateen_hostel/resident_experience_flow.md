# Resident Experience & Admin Integration Guide

This guide maps the specific features of the Mateen Hostel apps to the backend API, covering both Resident and Admin workflows.

---

## 🚀 Resident App Features

### 1. View Room Details
**Goal**: See assigned room, roommates, facilities, and rules.
- **Endpoint**: `GET /api/residents/room`
- **Role**: `resident`
- **Frontend Use**: 
    - Display room number, floor, and amenities from `data.room`.
    - List roommates from `data.roommates`.
    - Rules and Curfew are typically served as a "Policy" type Announcement or static content.

### 2. Make Requests & Report Issues
**Goal**: Submit maintenance, room changes, misconduct, or emergencies.
- **Endpoint**: `POST /api/residents/requests`
- **Role**: `resident`
- **Payload (`CreateMaintenanceRequestDto`)**:
    - **Maintenance/Replacement**: `type: "maintenance"` or `type: "item_replacement"`.
    - **Room Change**: `type: "room_change"`.
    - **Misconduct/Roommate Issues**: `type: "other"` with subject "Misconduct Report".
    - **Emergencies**: `type: "other"` with `priority: "critical"` and subject "EMERGENCY".
- **Tracking**: `GET /api/residents/requests` to check if staff has updated the status.

### 3. Payments & Billing
**Goal**: View owed fees, history, and pay digitally.
- **Endpoint**: `GET /api/residents/billing`
- **Role**: `resident`
- **Digital Payment**: 
    - Use `POST /api/payments/initiate` to get a `paymentUrl` (Paystack integrated).
    - Resident pays via Momo/Card on the provided URL.
- **Frontend Use**: Display `totalBalance` and the `payments` array.

### 4. Book Services & Facilities
**Goal**: Book laundry, gym, study rooms, or parking.
- **Endpoints**:
    - `GET /api/services/list/:hostelId`: View allowed features (Gym, Laundry, etc.) and their prices.
    - `POST /api/services/book`: Submit a booking for a specific date.
    - `GET /api/services/bookings`: Track usage history.

### 5. View Announcements
**Goal**: Get instant notifications on Fire Drills, Notices, and Events.
- **Endpoint**: `GET /api/residents/announcements`
- **Role**: `resident`
- **Types**: General, Event, Notice, Emergency, Policy (Policy changes).

### 6. Feedback System
**Goal**: Rate services and suggest improvements.
- **Endpoint**: `POST /api/residents/feedback`
- **Role**: `resident`
- **Payload**: `rating` (1-5), `comment` (suggestions), `category` (service name).

### 7. Download Documents
**Goal**: Get PDF Receipts, Allocation Letters, and Rules.
- **Receipts**: Generate on frontend using data from `GET /api/residents/billing`.
- **Allocation Letters**: Generate on frontend using data from `GET /api/residents/room` (combining User Name + Room Details).
- **Hostel Rules**: Serve as a "Policy" announcement in the Announcements list.

---

## 🛠️ Admin App Features (Hostel Management)

### 1. Service/Facility Creation
**Goal**: Set up extras like Gym, Laundry, or Guest rooms.
- **Endpoint**: `POST /api/services/create`
- **Role**: `admin` / `super_admin`
- **Fields**: Name, Description, Price (per use), and Availability toggle.

### 2. Communication Dashboard (Announcements)
**Goal**: Push fire drills, events, and policy changes to all residents.
- **Endpoint**: `POST /api/admin/announcement/add`
- **Role**: `admin` / `super_admin`
- **Hint**: Use the `type` field ("emergency", "notice", "event", "policy") to color-code the cards on the resident frontend.

### 3. Resident Lifecycle
- **Add Resident**: `POST /api/residents/add`
- **Assign Room**: `PUT /api/residents/assign/:id`
- **Export Data**: `GET /api/exports/residents/:hostelId` (Download CSV for offline records).

---

## Technical Notes for Developers
1. **Status Codes**: 
    - `200 OK`: Success.
    - `404 Not Found`: Resident profile missing.
    - `403 Forbidden`: Role mismatch (e.g., Admin trying to hit Resident room details).
2. **Error Handling**: I have updated the backend to return an empty array `[]` for announcements if a resident hasn't been assigned to a hostel yet, preventing unnecessary 404 errors during onboarding.
3. **Synchronization**: Ensure you have run `npx prisma generate` to keep models like `MaintenanceRequest` and `Announcement` in sync.
