# Qubic Ambassador Analytics Dashboard

## Overview

This is a full-stack web application built for tracking and analyzing Qubic community contributions. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence through Drizzle ORM. The system allows users to connect their wallets, submit contributions across multiple platforms (Twitter, GitHub, Discord, Medium), and view analytics through interactive dashboards and leaderboards.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom Qubic brand colors and dark theme
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling and logging middleware

### Data Storage Solutions
- **Primary Database**: PostgreSQL for user data, contributions, and analytics
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database schema management
- **Development Fallback**: In-memory storage implementation for testing

## Key Components

### Database Schema
- **Users Table**: Stores wallet addresses, usernames, points, contributions count, and ranking
- **Contributions Table**: Tracks submitted contributions with URLs, types, validation status, and point values
- **Relationships**: Foreign key relationship between users and their contributions

### Authentication & Authorization
- **Wallet-based Authentication**: Users connect via wallet addresses (no traditional passwords)
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Mock Wallet Generation**: Development utility for testing wallet connections

### API Endpoints
- `POST /api/wallet/connect` - Connect user wallet
- `POST /api/wallet/disconnect` - Disconnect user wallet
- `POST /api/contributions` - Submit new contributions
- `GET /api/dashboard` - Retrieve dashboard statistics
- `GET /api/leaderboard` - Get community leaderboard
- `GET /api/activity` - Fetch recent contribution activity

### UI Components
- **Dashboard**: Analytics overview with charts and metrics
- **Contribution Form**: Multi-platform contribution submission
- **Leaderboard**: Community ranking display
- **Analytics**: Detailed user performance metrics
- **Responsive Design**: Mobile-first approach with sidebar navigation

## Data Flow

1. **User Connection**: Users connect their Qubic wallets to establish identity
2. **Contribution Submission**: Users submit contributions via form with URL validation
3. **Data Processing**: Backend validates and stores contributions with pending status
4. **Analytics Generation**: System calculates user statistics and community rankings
5. **Real-time Updates**: Frontend queries update automatically via TanStack Query
6. **Leaderboard Updates**: Community rankings refresh based on approved contributions

## External Dependencies

### Core Technologies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm and drizzle-kit for database operations
- **UI Components**: @radix-ui/* components for accessible UI primitives
- **Charts**: Chart.js integration for data visualization
- **Styling**: Tailwind CSS with custom design system

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Development**: tsx for TypeScript execution
- **Bundling**: esbuild for server-side bundling
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Production Build Process
1. Frontend builds to `dist/public` via Vite
2. Backend bundles to `dist/index.js` via esbuild
3. Database migrations run via `drizzle-kit push`
4. Static assets served from Express server

### Environment Configuration
- **Development**: `npm run dev` - runs tsx server with hot reload
- **Production**: `npm run build && npm run start` - builds and runs optimized version
- **Database**: Requires `DATABASE_URL` environment variable

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Ports**: Application runs on port 5000, externally accessible on port 80
- **Deployment**: Autoscale deployment target with build and run commands

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.