# TaskFlow: Behavior-Driven Task Management Platform

## Overview

TaskFlow is a modern, full-stack task management platform built for teams and organizations. It provides comprehensive project management capabilities including Kanban boards, time tracking, analytics, and team collaboration features. The application follows a behavior-driven development approach with a focus on user experience and productivity insights.

The platform supports different user roles (Scrum Masters and Employees) and offers features like AI productivity insights, calendar integration, real-time collaboration, and detailed analytics dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript and Vite as the build tool. The architecture follows a component-based approach with:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Custom React context for user authentication state
- **Theme System**: Custom theme provider supporting light/dark modes

The frontend is structured with:
- Pages for major application sections (Dashboard, Kanban, Calendar, etc.)
- Reusable components organized in logical modules
- Custom hooks for shared functionality
- Modal components for create/edit operations

### Backend Architecture
The server is built using Node.js with Express.js following a RESTful API pattern:

- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Design**: RESTful endpoints organized by resource type
- **Middleware**: Custom authentication middleware and request logging

The backend implements:
- User management and authentication
- Project and task CRUD operations
- Time tracking functionality
- Analytics and reporting endpoints

### Database Design
The application uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Users**: Authentication and profile information with role-based access
- **Projects**: Project metadata with status tracking and ownership
- **Tasks**: Task management with status, priority, and assignment tracking
- **Time Entries**: Time tracking with start/stop functionality
- **Project Members**: Many-to-many relationship for project team management
- **Comments and Activity Logs**: Audit trail and collaboration features

The schema is designed with proper foreign key relationships and includes fields for timestamps, progress tracking, and metadata storage.

### Authentication & Authorization
JWT-based authentication system with:
- User registration and login endpoints
- Token-based session management
- Role-based access control (Scrum Master vs Employee)
- Protected routes with authentication middleware
- Secure password hashing using bcrypt

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, and React Router (Wouter)
- **Build Tools**: Vite for development and build processes
- **TypeScript**: Full type safety across the application

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI components for accessibility
- **shadcn/ui**: Pre-built component library built on Radix
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Charting library for analytics visualizations

### Backend Services
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **bcrypt**: Password hashing library
- **jsonwebtoken**: JWT token management

### Development and Tooling
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development
- **Replit Plugins**: Development environment integration

### Data Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for type safety

The application is designed to be deployment-ready with environment-based configuration and includes comprehensive error handling and logging throughout the stack.