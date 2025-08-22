# Overview

This is a full-stack employee management system built with React, Express, and PostgreSQL. The application provides role-based dashboards for management, employees, and trainees with authentication, user registration, and data visualization capabilities. It features a modern UI built with shadcn/ui components and includes secure authentication with reCAPTCHA integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing with protected route implementation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Authentication**: Context-based auth provider with session management

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy for username/password authentication
- **Session Management**: Express sessions with PostgreSQL session store
- **Security**: Password hashing using Node.js crypto scrypt, rate limiting, and reCAPTCHA verification
- **API Design**: RESTful endpoints with role-based access control
- **Middleware**: Custom logging, error handling, and authentication middleware

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Type-safe database schema with Zod validation
- **Tables**: Users, password resets, login attempts, and user sessions
- **User Roles**: Enum-based role system (management, employee, trainee)
- **Security**: UUID primary keys, timestamps, and proper indexing

## Authentication & Authorization
- **Strategy**: Session-based authentication with secure password hashing
- **Password Security**: Scrypt algorithm with salt for password hashing
- **Role-Based Access**: Three-tier role system with protected routes and API endpoints
- **Security Features**: Rate limiting, reCAPTCHA verification, and login attempt tracking
- **Session Storage**: PostgreSQL-backed session store for scalability

## External Dependencies

- **Database**: PostgreSQL via Neon serverless with connection pooling
- **UI Components**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS with custom design system variables
- **Security**: Google reCAPTCHA for bot protection
- **Email**: Nodemailer integration for password reset functionality
- **Development**: Replit-specific development tooling and banner integration