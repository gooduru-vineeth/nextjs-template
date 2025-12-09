# Requirements Document

## Introduction

This document outlines the requirements for removing the Clerk authentication dependency from the Next.js application. The application currently has a fully functional custom JWT-based authentication system with sign-in, sign-up, profile management, and session handling. However, the environment validation configuration still requires Clerk environment variables (CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY), which prevents the application from starting. This migration will remove all Clerk references and dependencies while preserving the existing custom authentication functionality.

## Glossary

- **Clerk**: A third-party authentication service that was previously considered for the application
- **JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties, used for session management
- **Environment Validation**: The process of validating required environment variables at application startup using @t3-oss/env-nextjs
- **Custom Auth System**: The existing JWT-based authentication implementation including login, signup, session management, and profile updates
- **Application**: The Next.js web application being modified

## Requirements

### Requirement 1

**User Story:** As a developer, I want to remove Clerk environment variable requirements, so that the application can start without Clerk credentials.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL NOT require CLERK_SECRET_KEY environment variable
2. WHEN the application starts THEN the system SHALL NOT require NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable
3. WHEN environment validation runs THEN the system SHALL validate only the custom authentication environment variables
4. WHEN the JWT_SECRET environment variable is missing THEN the system SHALL use a default development value with a warning
5. WHEN the application runs in production mode AND JWT_SECRET uses the default value THEN the system SHALL log a security warning

### Requirement 2

**User Story:** As a developer, I want to remove all Clerk references from the codebase, so that the application has no unused dependencies or misleading documentation.

#### Acceptance Criteria

1. WHEN searching the codebase for "clerk" or "Clerk" THEN the system SHALL return no results in source code files
2. WHEN reviewing package dependencies THEN the system SHALL NOT include any Clerk-related packages
3. WHEN reviewing the knip configuration THEN the system SHALL NOT include @clerk/types in ignored dependencies
4. WHEN reviewing marketing pages THEN the system SHALL NOT display Clerk sponsorship information
5. WHEN reviewing the Sponsors component THEN the system SHALL NOT include Clerk logo or links

### Requirement 3

**User Story:** As a developer, I want to ensure the custom JWT authentication system continues to work correctly, so that users can authenticate without any disruption.

#### Acceptance Criteria

1. WHEN a user submits valid credentials to the login endpoint THEN the system SHALL create a session and return user data
2. WHEN a user submits valid data to the signup endpoint THEN the system SHALL create a new user account and session
3. WHEN an authenticated user requests their profile THEN the system SHALL return the current user data
4. WHEN a user logs out THEN the system SHALL delete the session cookie
5. WHEN an unauthenticated user accesses a protected route THEN the system SHALL deny access

### Requirement 4

**User Story:** As a developer, I want clear documentation about the authentication system, so that other developers understand how authentication works.

#### Acceptance Criteria

1. WHEN reviewing the README THEN the system SHALL document the JWT-based authentication approach
2. WHEN reviewing the README THEN the system SHALL document the required JWT_SECRET environment variable
3. WHEN reviewing the README THEN the system SHALL document the authentication API endpoints
4. WHEN reviewing environment variable comments THEN the system SHALL provide clear guidance on JWT_SECRET configuration
5. WHEN reviewing the codebase THEN the system SHALL NOT reference Clerk in any documentation or comments
