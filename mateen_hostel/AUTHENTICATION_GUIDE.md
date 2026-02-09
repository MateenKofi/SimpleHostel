# Authentication Guide

This guide explains how users (Admins, Staff, and Residents) log in to the Mateen Hostel system.

## 1. Login Endpoint

The system uses a single endpoint for all user types. The role-based access is determined by the data in the issued JWT token.

- **Endpoint**: `POST /api/v1/users/login`

## 2. Login Methods

The login controller supports two distinct workflows:

### A. Email/Password Login (Primary)
This is used for the initial login.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Process**:
  1. The system fetches the user (including hashed password).
  2. It compares the provided password with the stored hash using `bcrypt`.
  3. If matched, it generates a JWT token containing:
     - `id`: User's unique ID.
     - `role`: User's role (e.g., `resident`, `admin`).
     - `hostelId`: ID of the hostel the user is assigned to (if any).

### B. Token-based Login (Session Persistence)
This is used to resume a session without re-entering credentials.

- **Headers**:
  ```http
  Authorization: Bearer <your_jwt_token_here>
  ```
- **Process**:
  1. The system checks for the `Authorization` header.
  2. If found and valid (not expired), it decodes the token.
  3. It verifies the user still exists in the database.
  4. If successful, it returns the user's ID as a confirmation.

## 3. Post-Login Response

Successful login returns the user's ID and the JWT token.

- **Response**:
  ```json
  {
    "userId": "user_cuid_here",
    "message": "login successful",
    "token": "eyJhbGci... (JWT token)"
  }
  ```

## 4. Protected Routes

To access protected features (like booking, requests, etc.), the resident must include the token in all subsequent requests:
- **Header**: `Authorization: Bearer <token>`

## 5. Logout

- **Endpoint**: `POST /api/v1/users/logout`
- **What happens**: Invalidates the current session token logic (typically handled on the client-side by deleting the token, but the server also provides an endpoint for cleanup).
