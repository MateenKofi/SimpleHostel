# Resident Booking and Payment Guide

This guide explains the step-by-step process for a resident to book a room and complete their payment in the Mateen Hostel system.

## 1. Resident Registration (Booking)

To book a room, a resident must register through the system. This process creates their user account and links them to a specific room.

- **Endpoint**: `POST /api/v1/residents/register`
- **Payload**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword",
    "gender": "male",
    "phone": "0240000000",
    "roomId": "room_cuid_here",
    "hostelId": "hostel_cuid_here",
    "studentId": "ID12345",
    "course": "Computer Science"
  }
  ```
- **What happens**:
  1. Validates the room exists and has capacity.
  2. Ensures the resident's gender matches the room's designated gender.
  3. Creates a `User` record with the `resident` role.
  4. Creates a `ResidentProfile` linked to the user, room, and hostel.

## 2. Payment Initiation

Once registered, the resident needs to make an initial payment to secure their place.

- **Endpoint**: `POST /api/v1/payment/init`
- **Payload**:
  ```json
  {
    "roomId": "room_cuid_here",
    "residentId": "resident_profile_cuid_here",
    "initialPayment": 1500.00
  }
  ```
- **What happens**:
  1. The system checks for an active calendar year for the hostel.
  2. It initializes a transaction with **Paystack**.
  3. A `Payment` record is created in the database with a `pending` status.
  4. Returns a `authorizationUrl` (Paystack checkout page) and a `reference`.

## 3. Completing Payment

The resident follows the `authorizationUrl` to pay via Mobile Money, Card, or Bank Transfer.

- **Handled by**: Paystack checkout page.
- **Verification**: After payment, the resident is redirected back to the app, or Paystack sends a webhook.
- **Endpoint for Manual Confirmation**: `GET /api/v1/payment/confirm?reference=PAYSTACK_REF_HERE`

- **Finalization**:
  1. The system verifies the payment with Paystack.
  2. The `Payment` status is updated to `confirmed`.
  3. The `ResidentProfile` is updated with the assigned room.
  4. The **Room Capacity** (currentResidentCount) is incremented.
  5. If the room is now full, its status changes to `occupied`.

## 4. Top-Up Payments (Partial Payments)

If the hostel allows partial payments, residents can pay the remaining balance later.

- **Endpoint**: `POST /api/v1/payment/topup`
- **Payload**: Same as initiation, but used for balance clearance.
- **Workflow**: Similar to the initiation flow, updating the `balanceOwed` in the system upon completion.
