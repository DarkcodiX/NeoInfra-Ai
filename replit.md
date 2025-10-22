# Floor Planner Application

## Overview

This is a web-based floor planning application that allows users to design and visualize floor plans in both 2D and 3D. Users can create rooms, add walls, place furniture, and view their designs in an interactive environment. The application provides a comprehensive furniture library with pricing, project management capabilities, and the ability to generate shopping lists from placed furniture items.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript running on Vite for development and build tooling.

**UI Component Strategy**: The application uses a comprehensive design system built on Radix UI primitives and styled with Tailwind CSS. This provides accessible, customizable components throughout the application. The design system follows a consistent theming approach with CSS custom properties for colors, spacing, and other design tokens.

**State Management**: Client-side state is managed using Zustand stores, with separate stores for different domains:
- Floor plan state (rooms, walls, furniture, tools, view modes)
- Furniture library state (dragging, selection)
- Audio state (muting, playback)
- Game state (for interactive elements)

**3D Rendering**: The application leverages React Three Fiber (R3F) for 3D visualization, with @react-three/drei providing helper components for cameras, controls, and common 3D elements. GLSL shader support is enabled through vite-plugin-glsl for custom visual effects.

**Routing & Data Fetching**: Uses TanStack Query (React Query) for server state management and async data fetching. Custom query functions handle API requests with proper error handling and unauthorized state management.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript support via tsx for development.

**API Design**: RESTful API with routes prefixed under `/api`. The routes module (`server/routes.ts`) provides a centralized location for registering all API endpoints.

**Development Setup**: Vite middleware integration in development mode enables hot module replacement and seamless client-server development experience. In production, the server serves static files from the built client application.

**Request Logging**: Custom middleware logs all API requests with method, path, status code, duration, and truncated response bodies for debugging.

**Error Handling**: Centralized error handling middleware catches errors and returns appropriate HTTP status codes with error messages.

### Data Storage Solutions

**Database**: PostgreSQL accessed through Neon's serverless driver (`@neondatabase/serverless`).

**ORM**: Drizzle ORM for type-safe database queries and schema management. The schema is defined in TypeScript (`shared/schema.ts`) and shared between client and server for consistency.

**Migration Strategy**: Drizzle Kit handles schema migrations with configuration pointing to a PostgreSQL dialect. Migrations are stored in the `/migrations` directory.

**Development Storage**: In-memory storage implementation (`MemStorage`) provides a fallback for development without requiring database setup. This implements the same `IStorage` interface as the production database storage would.

**Data Models**: Currently includes a users table with username/password authentication fields. The schema uses Drizzle-Zod integration for runtime validation of insert operations.

### Authentication and Authorization

**Strategy**: The application includes authentication scaffolding with username/password fields in the database schema and an auth page component, but the full authentication flow is not yet implemented.

**Session Management**: The package dependencies include `connect-pg-simple` for PostgreSQL-backed session storage, suggesting session-based authentication is the planned approach.

**Validation**: Zod schemas validate user input on both client and server sides, generated from Drizzle schema definitions.

### External Dependencies

**UI Libraries**:
- Radix UI - Comprehensive collection of accessible UI primitives
- Tailwind CSS - Utility-first CSS framework
- Class Variance Authority - Type-safe variant styling
- CMDK - Command palette component

**3D Graphics**:
- Three.js (via React Three Fiber) - 3D rendering engine
- @react-three/drei - Helper components for R3F
- @react-three/postprocessing - Post-processing effects

**Fonts & Icons**:
- Inter font family via @fontsource
- Lucide React - Icon library

**Utilities**:
- date-fns - Date manipulation
- nanoid - Unique ID generation
- clsx & tailwind-merge - Class name utilities

**Development Tools**:
- Vite - Build tool and dev server
- ESBuild - JavaScript bundler for production
- TypeScript - Type checking
- tsx - TypeScript execution for server

**Database & Validation**:
- @neondatabase/serverless - PostgreSQL client
- Drizzle ORM - Database toolkit
- Zod - Schema validation