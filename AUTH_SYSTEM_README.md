# Authentication System Documentation

## Overview

This document describes the complete authentication system implemented for the Amvrakikos Fishing Trip website.

## Features

### 1. User Authentication
- **Email/Password Login**: Users can sign in with their email and password
- **User Registration**: New users can create accounts with email verification
- **Password Reset**: Users can reset their password via email link
- **Social Login**: Google OAuth integration (optional)
- **Session Management**: JWT-based session strategy

### 2. User Roles
- **CUSTOMER**: Regular users who can book trips
- **ADMIN**: Administrators with full access to management features

### 3. Security Features
- **Password Hashing**: Using bcrypt with 12 salt rounds
- **Strong Password Validation**: Enforces uppercase, lowercase, numbers, and minimum length
- **Secure Sessions**: HTTP-only cookies for session tokens
- **CSRF Protection**: Built-in with NextAuth.js
- **Email Verification**: Required for new accounts (prepared)

### 4. Pages Created
- `/[locale]/login` - User login page
- `/[locale]/register` - User registration page
- `/[locale]/forgot-password` - Password reset request
- `/[locale]/reset-password` - Password reset form
- `/[locale]/verify-email` - Email verification page
- `/[locale]/dashboard` - User dashboard
- `/[locale]/admin` - Admin dashboard (protected)

### 5. Components Created
- `LoginForm` - Email/password login form
- `RegisterForm` - User registration form with password strength indicator
- `ForgotPasswordForm` - Password reset request form
- `ResetPasswordForm` - Password reset form
- `ProtectedRoute` - Wrapper for protected routes
- `AuthGuard` - Component to redirect authenticated users
- `SessionProvider` - NextAuth session provider

### 6. Server Actions
- `registerUser()` - User registration
- `verifyEmail()` - Email verification
- `forgotPassword()` - Password reset request
- `resetPassword()` - Password reset
- `changePassword()` - Change password for logged-in users
- `updateUserProfile()` - Update user profile
- `getUserById()` - Get user by ID
- `getUserByEmail()` - Get user by email

### 7. Database Schema

#### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  bookings      Booking[]
  accounts      Account[]
  sessions      Session[]
  passwordReset PasswordReset[]
}
```

#### Account Model (OAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

#### Session Model
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### PasswordReset Model
```prisma
model PasswordReset {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([expires])
}
```

### 8. Internationalization

All authentication pages and messages are available in three languages:
- English (en)
- German (de)
- Greek (el)

Email templates are also multilingual.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Optional (Google OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Required (for email functionality)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@amvrakikosfishing.com
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

### 2. Generate Database Migration

```bash
npx prisma migrate dev --name add-auth-models
```

### 3. Update Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

### 4. (Optional) Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Client Secret to your `.env.local`

### 5. (Optional) Set Up Resend for Emails

1. Sign up at [Resend](https://resend.com/)
2. Get your API key
3. Add it to `.env.local`

## Usage Examples

### Protecting a Route

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function MyPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  );
}
```

### Protecting Admin Routes

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@prisma/client";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminContent />
    </ProtectedRoute>
  );
}
```

### Getting Session Data

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please sign in</p>;

  return <p>Welcome, {session?.user?.name}</p>;
}
```

### Signing In

```tsx
import { signIn } from "next-auth/react";

// Email/Password
await signIn("credentials", {
  email: "user@example.com",
  password: "password123",
  callbackUrl: "/dashboard",
});

// Google OAuth
await signIn("google", { callbackUrl: "/dashboard" });
```

### Signing Out

```tsx
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";

const locale = useLocale();

await signOut({ callbackUrl: `/${locale}` });
```

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

## Email Templates

### Verification Email
- Sent when user registers
- Contains a verification link
- Available in EN, DE, EL

### Password Reset Email
- Sent when user requests password reset
- Contains a reset link valid for 1 hour
- Available in EN, DE, EL

## Middleware

The middleware automatically:
- Redirects unauthenticated users to login for protected routes
- Redirects authenticated users away from auth pages (login/register)
- Handles locale prefixes
- Protects admin routes

## Security Considerations

1. **Never commit `.env.local` to version control**
2. **Always use strong `NEXTAUTH_SECRET` in production**
3. **Enable HTTPS in production**
4. **Regularly update dependencies**
5. **Monitor for suspicious login attempts**
6. **Implement rate limiting for login attempts** (can be added)
7. **Keep bcrypt salt rounds high** (currently 12)

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login with more providers (Facebook, GitHub)
- [ ] Email verification implementation
- [ ] Rate limiting for login attempts
- [ ] Account lockout after failed attempts
- [ ] OAuth user profile updates
- [ ] User activity logging
- [ ] Admin user management UI
- [ ] Bulk user operations

## Troubleshooting

### Login fails with "Invalid credentials"
- Check that the user exists in the database
- Verify the password is hashed correctly
- Ensure the email is verified (if required)

### Google OAuth not working
- Check that Google Client ID and Secret are correct
- Verify the redirect URL matches what's in Google Console
- Ensure Google+ API is enabled

### Emails not sending
- Verify Resend API key is correct
- Check that the from email is verified in Resend
- Ensure domain is properly configured

### Session not persisting
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Check cookie settings in browser

## Testing

### Test User Creation

1. Go to `/en/register`
2. Fill in the form with valid data
3. Submit and check for success message

### Test Login

1. Go to `/en/login`
2. Enter email and password
3. Verify you're redirected to dashboard

### Test Password Reset

1. Go to `/en/forgot-password`
2. Enter your email
3. Check your email for reset link
4. Click the link and set new password

### Test Admin Access

1. Create a user and set role to ADMIN in database
2. Login as admin user
3. Try to access `/en/admin`
4. Verify admin dashboard loads

## Support

For issues or questions, please refer to:
- NextAuth.js Documentation: https://authjs.dev/
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs
