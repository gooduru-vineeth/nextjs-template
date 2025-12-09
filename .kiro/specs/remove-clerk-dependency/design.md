# Design Document: Remove Clerk Dependency

## Overview

This design outlines the approach for removing Clerk authentication dependencies from the Next.js application. The application already has a complete custom JWT-based authentication system implemented, including user registration, login, session management, and profile updates. The migration focuses on removing Clerk references from environment validation, dependencies, documentation, and marketing materials while ensuring the existing custom authentication system continues to function correctly.

## Architecture

The application uses a custom JWT-based authentication architecture:

### Current Authentication Flow
1. **User Registration**: User submits credentials → Password hashed with bcrypt → User stored in PostgreSQL → JWT token created → Session cookie set
2. **User Login**: User submits credentials → Password verified → JWT token created → Session cookie set
3. **Session Management**: JWT stored in httpOnly cookie → Token verified on protected routes → User data retrieved from database
4. **Profile Updates**: Authenticated user submits changes → Validation → Database update

### Components Affected by Migration
1. **Environment Validation** (`src/libs/Env.ts`): Remove Clerk variable requirements
2. **Package Dependencies** (`package.json`, `knip.config.ts`): Remove Clerk packages
3. **Marketing Content** (`src/components/Sponsors.tsx`, `src/app/[locale]/(marketing)/page.tsx`): Remove Clerk references
4. **Documentation** (`.env`, `.env.production`, `README.md`): Update authentication documentation

## Components and Interfaces

### Environment Configuration (`src/libs/Env.ts`)

**Current State:**
```typescript
const config = {
  server: {
    CLERK_SECRET_KEY: z.string().min(1), // Required
    DATABASE_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1), // Required
  },
};
```

**Target State:**
```typescript
const config = {
  server: {
    JWT_SECRET: z.string().min(1).default('dev-secret-change-in-production'),
    DATABASE_URL: z.string().min(1),
  },
  // No Clerk variables
};
```

### Authentication System (No Changes Required)

The existing authentication system is complete and functional:
- **Auth Library** (`src/libs/Auth.ts`): JWT creation, verification, session management
- **API Routes**: `/api/auth/login`, `/api/auth/signup`, `/api/auth/profile`, `/api/auth/logout`
- **UI Components**: `SignInForm`, `SignUpForm`
- **Database Schema**: User table with email, password, name fields

## Data Models

No changes to data models are required. The existing user schema supports the custom authentication system:

```typescript
const userSchema = {
  id: number, // serial (primary key)
  email: string, // varchar(255) unique not null
  password: string, // varchar(255) not null, bcrypt hashed
  name: string | null, // varchar(255) nullable
  createdAt: Date, // timestamp
  updatedAt: Date, // timestamp
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Environment validation succeeds without Clerk variables
*For any* environment configuration that includes DATABASE_URL and optionally JWT_SECRET (but excludes CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY), the environment validation should succeed and the application should start.
**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Clerk references are removed from source files
*For any* source file in the codebase (excluding node_modules, .git, and build artifacts), searching for "clerk", "Clerk", or "CLERK" should return no matches.
**Validates: Requirements 2.1, 2.4, 2.5, 4.5**

### Property 3: Login creates valid sessions
*For any* valid user credentials (email and password), submitting them to the login endpoint should create a session cookie and return the user data.
**Validates: Requirements 3.1**

### Property 4: Signup creates users and sessions
*For any* valid signup data (email, password, optional name), submitting it to the signup endpoint should create a new user in the database and establish a session.
**Validates: Requirements 3.2**

### Property 5: Authenticated profile access works
*For any* authenticated user with a valid session, requesting their profile should return the current user data from the database.
**Validates: Requirements 3.3**

### Property 6: Logout clears sessions
*For any* authenticated user session, calling the logout endpoint should delete the session cookie.
**Validates: Requirements 3.4**

### Property 7: Unauthenticated access is denied
*For any* protected route, requests without a valid session cookie should be denied access.
**Validates: Requirements 3.5**

## Error Handling

### Environment Variable Errors
- **Missing JWT_SECRET**: Use default value in development, log warning in production
- **Invalid JWT_SECRET format**: Application should start but log warning about security

### Authentication Errors (Existing System)
- **Invalid credentials**: Return 401 with generic error message
- **Duplicate email**: Return 400 with specific error message
- **Invalid token**: Return 401 and clear session cookie
- **Database errors**: Return 500 with generic error message

## Testing Strategy

### Unit Tests

1. **Environment Validation Tests**
   - Test that environment validation succeeds without Clerk variables
   - Test that JWT_SECRET defaults correctly in development
   - Test that all required variables are validated

2. **Authentication Flow Tests** (Existing)
   - Test login with valid credentials
   - Test login with invalid credentials
   - Test signup with new email
   - Test signup with duplicate email
   - Test profile update
   - Test logout

### Property-Based Tests

The testing approach will use **fast-check** for JavaScript/TypeScript property-based testing. Each property-based test will run a minimum of 100 iterations.

1. **Property Test: Environment validation without Clerk**
   - Generate random environment configurations with DATABASE_URL and optional JWT_SECRET
   - Verify environment validation succeeds without Clerk variables
   - **Feature: remove-clerk-dependency, Property 1: Environment validation succeeds without Clerk variables**

2. **Property Test: No Clerk references in source files**
   - Search all source files for "clerk", "Clerk", "CLERK"
   - Verify no matches found in source code
   - **Feature: remove-clerk-dependency, Property 2: Clerk references are removed from source files**

3. **Property Test: Login session creation**
   - Generate random valid user credentials
   - Test login endpoint
   - Verify session cookie is created and user data is returned
   - **Feature: remove-clerk-dependency, Property 3: Login creates valid sessions**

4. **Property Test: Signup user and session creation**
   - Generate random valid signup data
   - Test signup endpoint
   - Verify user is created in database and session is established
   - **Feature: remove-clerk-dependency, Property 4: Signup creates users and sessions**

5. **Property Test: Authenticated profile retrieval**
   - Generate random authenticated users
   - Test profile endpoint
   - Verify correct user data is returned
   - **Feature: remove-clerk-dependency, Property 5: Authenticated profile access works**

6. **Property Test: Logout session deletion**
   - Create random authenticated sessions
   - Call logout endpoint
   - Verify session cookie is deleted
   - **Feature: remove-clerk-dependency, Property 6: Logout clears sessions**

7. **Property Test: Unauthenticated access denial**
   - Generate requests without valid sessions
   - Test protected routes
   - Verify access is denied
   - **Feature: remove-clerk-dependency, Property 7: Unauthenticated access is denied**

### Integration Tests

1. **Full Authentication Flow**
   - Complete signup → login → profile access → logout flow
   - Verify each step works correctly

2. **Protected Route Access**
   - Test authenticated access to dashboard
   - Test unauthenticated access denial

### Testing Framework

- **Unit Testing**: Vitest (already configured)
- **Property-Based Testing**: fast-check library
- **Integration Testing**: Playwright (already configured)

## Implementation Notes

### Files to Modify

1. **Environment Configuration**
   - `src/libs/Env.ts`: Remove Clerk variables, add JWT_SECRET validation
   - `.env`: Add JWT_SECRET documentation
   - `.env.production`: Add JWT_SECRET documentation

2. **Dependencies**
   - `package.json`: Remove @clerk/* packages (if any)
   - `knip.config.ts`: Remove @clerk/types from ignoreDependencies

3. **Marketing Content**
   - `src/components/Sponsors.tsx`: Remove Clerk sponsor entry
   - `src/app/[locale]/(marketing)/page.tsx`: Remove Clerk reference

4. **Documentation**
   - `README.md`: Add custom authentication documentation

### Files That Don't Need Changes

- All authentication implementation files (`src/libs/Auth.ts`, API routes, forms)
- Database schema and migrations
- User-facing authentication UI

### Migration Safety

This migration is low-risk because:
1. The custom authentication system is already fully implemented and functional
2. No code logic changes are required to authentication flows
3. Changes are limited to configuration, dependencies, and documentation
4. The application can be tested locally before deployment

## Security Considerations

1. **JWT_SECRET**: Must be a strong, random value in production
2. **Default Secret Warning**: Log clear warnings when using default JWT_SECRET
3. **Session Cookie Security**: Already configured with httpOnly, secure (in production), sameSite
4. **Password Hashing**: Already using bcrypt with appropriate cost factor (10)
