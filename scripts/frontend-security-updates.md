# Frontend Security Migration Guide

This guide covers updating the frontend to work with the backend security improvements.

## Files to Replace/Update

### 1. Auth API (`src/api/auth.ts`)

**Replace with:** `src/api/auth.secure.ts`

The new API adds:
- `requestPasswordReset()` - Request password reset (sends email with token)
- `confirmPasswordReset()` - Complete password reset with token
- `validateResetToken()` - Check if reset token is valid

```typescript
// OLD (deprecated)
export const resetPassword = async (data: { email: string }) => {
  const response = await axiosInstance.post("/users/reset-password", data);
  return response.data;
};

// NEW (secure)
export const requestPasswordReset = async (data: { email: string }) => {
  const response = await axiosInstance.post("/users/reset-password/request", data);
  return response.data;
};

export const confirmPasswordReset = async (data: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosInstance.post("/users/reset-password/confirm", data);
  return response.data;
};
```

### 2. Auth Store (`src/stores/useAuthStore.ts`)

**Replace with:** `src/stores/useAuthStore.secure.ts`

Key changes:
- Added `tokenExpiry` tracking
- Added `checkSession()` method
- Added `clearSession()` method
- Better session management

### 3. Registration Schema (`src/schemas/registrationSchema.ts`)

**Replace with:** `src/schemas/registrationSchema.secure.ts`

Password requirements updated:
- Minimum 12 characters (was 8)
- Must contain uppercase AND lowercase
- Must contain at least one number
- Must contain at least one special character
- Cannot contain common patterns

### 4. Forget Password Page

**Replace:** `src/pages/Authentication/forget-password/ForgetPassword.tsx`

**With:** `src/pages/Authentication/forget-password/ForgetPassword.secure.tsx`

### 5. NEW: Password Reset Page

**Create:** `src/pages/Authentication/reset-password/ResetPassword.secure.tsx`

This is a new page for the token-based reset flow.

## New Component to Add

### Password Strength Indicator

**Add:** `src/components/form/PasswordStrengthIndicator.tsx`

Import and use in registration and password reset forms:

```tsx
import { PasswordStrengthIndicator } from "@/components/form/PasswordStrengthIndicator";

// In your form
<PasswordInput {...register("password")} />
<PasswordStrengthIndicator password={watch("password")} />
```

## Route Updates

Add the new reset password route to your router:

```tsx
// App.tsx or router configuration
<Route
  path="/reset-password"
  element={<ResetPasswordSecure />}
/>
```

## Step-by-Step Migration

### Phase 1: Non-Breaking Changes (Can deploy now)

1. **Update imports** to use secure versions:
   ```tsx
   // In login form, registration form, etc.
   import { requestPasswordReset } from "@/api/auth.secure";
   ```

2. **Add password strength indicator** to registration:
   ```tsx
   import { PasswordStrengthIndicator } from "@/components/form/PasswordStrengthIndicator";

   // In your form, add after password input:
   <PasswordStrengthIndicator password={watch("password")} />
   ```

### Phase 2: Backend-Dependent Changes (Deploy after backend)

1. **Replace ForgetPassword page** when backend has `/users/reset-password/request` endpoint

2. **Add ResetPassword page** when backend has `/users/reset-password/confirm` endpoint

3. **Update auth store** when backend is fully ready

## Testing Checklist

- [ ] Registration shows password strength indicator
- [ ] Registration enforces 12+ character passwords
- [ ] Forget password requests reset (doesn't show old password message)
- [ ] Reset password page validates token
- [ ] Reset password page shows password requirements
- [ ] Session timeout warning works
- [ ] Logout clears all storage

## Optional: httpOnly Cookie Migration

When backend implements httpOnly cookies for JWT:

1. Update `src/api/axiosInstance.tsx`:
   ```tsx
   const axiosInstance = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
     withCredentials: true, // Add this
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     }
   });

   // REMOVE the token interceptor:
   // axiosInstance.interceptors.request.use((config) => {
   //   const token = localStorage.getItem('token');
   //   if (token) {
   //     config.headers.Authorization = `Bearer ${token}`;
   //   }
   //   return config;
   // });
   ```

2. Update auth store to not store token in localStorage

## Environment Variables

Add to `.env`:

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:2020/api/v1

# For production
VITE_API_BASE_URL=https://your-api.vercel.app/api/v1
```
