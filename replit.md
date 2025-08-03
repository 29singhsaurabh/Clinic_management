# Clinic Management System

## Overview

This is a comprehensive clinic management system built for Siddheshwar Clinic. The application provides a complete solution for managing patients, appointments, medical records, and clinic operations. It features a modern web interface with a React frontend and Express.js backend, utilizing PostgreSQL for data persistence and comprehensive authentication mechanisms.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 2025)

### Completed System Migration
- Successfully modernized Python Tkinter desktop application to web-based system
- Implemented complete clinic management functionality including:
  - Patient management with comprehensive medical records
  - Appointment scheduling with time slots and status tracking
  - Dashboard analytics and statistics
  - User authentication and session management
- Fixed all technical issues including session authentication, form validation, and API routing
- System tested and confirmed working with admin/admin123 credentials

## System Architecture

### Frontend Architecture

The frontend is built using **React 18** with **TypeScript** and follows a component-based architecture:

- **UI Framework**: Utilizes shadcn/ui components built on top of Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture

The backend follows a **RESTful API** design using Express.js:

- **Framework**: Express.js with TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database interactions
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **API Structure**: Modular route handlers with proper error handling and middleware
- **Development**: Hot reload support with tsx for development server

### Database Design

**PostgreSQL** database with the following core entities:

- **Users**: System users (doctors, admins, staff) with role-based access
- **Patients**: Complete patient records with demographics and medical history
- **Appointments**: Scheduling system with status tracking and doctor assignments
- **Medical Records**: Patient medical history, diagnoses, and treatment records

Key design decisions:
- UUID primary keys for better security and scalability
- Enum types for constrained values (gender, appointment status, user roles)
- Proper foreign key relationships with cascading rules
- Timestamps for audit trails

### Session Management

- **Storage**: PostgreSQL session store using connect-pg-simple
- **Security**: Secure session configuration with proper cookie settings
- **Authentication Middleware**: Route protection based on user sessions

### Development Environment

- **Replit Integration**: Custom Vite plugin for Replit development environment
- **Hot Reload**: Development server with automatic restart on changes
- **Build Process**: Separate client and server build configurations
- **Database Migrations**: Drizzle migrations for schema management

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Connection Pooling**: Built-in connection pooling for optimal performance

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for managing component variants

### Development Tools
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

### Authentication & Security
- **bcrypt**: Password hashing and verification
- **express-session**: Session middleware for Express

### Build & Development
- **Vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **Tailwind CSS**: Utility-first CSS framework

The application is designed to be deployed on Replit with environment-specific configurations and includes both development and production build processes.