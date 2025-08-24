# Backend Development Tasks - Qubic Platform

## Overview
This document outlines all the backend tasks required to support the Qubic Platform frontend. The backend will handle user authentication, contribution management, analytics, and data persistence.

## 🏗️ **Project Setup & Infrastructure**

### 1. **Initial Project Setup**
- [x ] Initialize Node.js/Express project with TypeScript
- [ x] Set up project structure (controllers, routes, models, middlewares, utils, types)
- [ x] Configure environment variables (.env)
- [ x] Set up database connection (PostgreSQL with Drizzle ORM) /Mongodb with mongoose
- [ ] Configure CORS for frontend communication
- [ ] Set up logging middleware
- [ ] Configure error handling middleware
- [ ] Set up development and production scripts

### 2. **Database Schema Design**
- [X] Create Users table schema
  - `id` (primary key)
  - `email` (unique)
  - `password_hash`
  - `username` (optional)
  - `role` (visitor/ambassador)
  - `total_points` (default: 0)
  - `total_contributions` (default: 0)
  - `rank` (default: 0)
  - `is_approved` (default: false for ambassadors)
  - `created_at`
  - `last_activity`
  - `email_verified` (default: false)
  - `verification_token`
  - `reset_password_token`
  - `reset_password_expires`

- [X] Create Contributions table schema
  - `id` (primary key)
  - `user_id` (foreign key to users)
  - `type` (twitter/github/discord/medium/youtube)
  - `url`
  - `description` (optional)
  - `points` (default: 0)
  - `status` (pending/approved/rejected)
  - `reviewed_by` (foreign key to users, optional)
  - `reviewed_at` (optional)
  - `created_at`
  - `updated_at`

- [X ] Create Sessions table schema (for session management)
  - `id` (primary key)
  - `user_id` (foreign key to users)
  - `session_token`
  - `expires_at`
  - `created_at`

- [ ] Set up database migrations with Drizzle Kit
- [X] Seeding Service with mongoDb for Default test data in Dev

## 🔐 **Authentication System**

### 3. **User Registration & Login**
- [X] Implement user registration endpoint (`POST /api/auth/register`)
  - Email validation done
  - Password hashing (bcrypt) done
  - Username validation (optional) not required as email is username
  - Email verification token generation pending
  - Send verification email pending

- [X] Implement user login endpoint (`POST /api/auth/login`)
  - Email/password validation
  - JWT token generation (not required as we using session token now)
  - Session creation done
  - Return user data (excluding password) done

- [ ] Implement email verification endpoint (`POST /api/auth/verify-email`)
  - Token validation
  - Update user verification status

- [ ] Implement password reset endpoints
  - `POST /api/auth/forgot-password` - Send reset email
  - `POST /api/auth/reset-password` - Reset password with token

- [ ] Implement logout endpoint (`POST /api/auth/logout`)
  - Invalidate session
  - Clear JWT token

### 4. **Session Management**
- [ ] Implement session middleware
- [ ] JWT token validation middleware
- [ ] Role-based access control middleware
- [ ] Session cleanup (expired sessions)

### 5. **Authentication Middleware**
- [ ] Create `authMiddleware` for protected routes
- [ ] Create `roleMiddleware` for ambassador-only routes
- [ ] Create `adminMiddleware` for admin-only routes

## 📊 **Dashboard & Analytics**

### 6. **Dashboard Statistics**
- [ ] Implement dashboard endpoint (`GET /api/dashboard`)
  - Total contributions count
  - User's contribution count
  - User's rank
  - Total points
  - Weekly growth percentage
  - Return data in format expected by frontend

- [ ] Implement user-specific dashboard (`GET /api/dashboard/:userId`)
  - Same as above but filtered for specific user

### 7. **Leaderboard System**
- [ ] Implement leaderboard endpoint (`GET /api/leaderboard`)
  - Get top users by points
  - Include username, total points, total contributions, rank
  - Support pagination
  - Support time filters (this week, all time)

### 8. **Recent Activity**
- [ ] Implement activity endpoint (`GET /api/activity`)
  - Get recent contributions across all users
  - Include contribution type, description, points, timestamp

- [ ] Implement user-specific activity (`GET /api/activity/:userId`)
  - Get recent contributions for specific user

## 📝 **Contribution Management**

### 9. **Contribution Submission**
- [ ] Implement contribution submission endpoint (`POST /api/contributions`)
  - Validate contribution data
  - URL validation for different platforms
  - Store contribution with pending status
  - Assign initial points based on type
  - Update user's total contributions count

### 10. **Contribution Validation**
- [ ] Implement URL validation for different platforms:
  - Twitter: Validate tweet URLs
  - GitHub: Validate repository/issue/PR URLs
  - Discord: Validate Discord message URLs
  - Medium: Validate Medium article URLs

### 11. **Contribution Review System** (Admin/Ambassador)
- [ ] Implement contribution review endpoints:
  - `GET /api/contributions/pending` - Get pending contributions
  - `PUT /api/contributions/:id/approve` - Approve contribution
  - `PUT /api/contributions/:id/reject` - Reject contribution
  - `PUT /api/contributions/:id/update-points` - Update points

### 12. **Contribution Analytics**
- [ ] Implement contribution statistics:
  - Contributions by type
  - Contributions by status
  - Points distribution
  - Weekly/monthly trends

## 👥 **User Management**

### 13. **User Profile Management**
- [ ] Implement user profile endpoints:
  - `GET /api/users/profile` - Get current user profile
  - `PUT /api/users/profile` - Update user profile
  - `GET /api/users/:id` - Get user by ID (public data)

### 14. **Ambassador System**
- [ ] Implement ambassador approval system:
  - `POST /api/ambassadors/apply` - Apply for ambassador role
  - `GET /api/ambassadors/applications` - Get pending applications (admin)
  - `PUT /api/ambassadors/:id/approve` - Approve ambassador (admin)
  - `PUT /api/ambassadors/:id/reject` - Reject ambassador (admin)

### 15. **User Rankings**
- [ ] Implement ranking calculation system:
  - Calculate user ranks based on total points
  - Update rankings when contributions are approved
  - Handle tie-breaking logic

## 🔧 **Utility & Helper Functions**

### 16. **Email Service**
- [ ] Set up email service (Nodemailer/SendGrid)
- [ ] Email templates for:
  - Welcome email
  - Email verification
  - Password reset
  - Contribution approval/rejection
  - Ambassador application status

### 17. **Validation & Sanitization**
- [ ] Input validation middleware
- [ ] Data sanitization
- [ ] Rate limiting for API endpoints
- [ ] Request size limits

### 18. **Error Handling**
- [ ] Global error handler
- [ ] Custom error classes
- [ ] Error logging
- [ ] User-friendly error messages

## 🧪 **Testing & Quality Assurance**

### 19. **Testing Setup**
- [ ] Set up testing framework (Jest)
- [ ] Unit tests for all controllers
- [ ] Integration tests for API endpoints
- [ ] Database testing setup
- [ ] Mock services for external dependencies

### 20. **API Documentation**
- [ ] Set up Swagger/OpenAPI documentation
- [ ] Document all endpoints with examples
- [ ] Create API usage examples
- [ ] Document error codes and responses

## 🚀 **Deployment & Production**

### 21. **Production Setup**
- [ ] Environment configuration for production
- [ ] Database connection pooling
- [ ] Security headers middleware
- [ ] HTTPS configuration
- [ ] PM2 or similar process manager setup

### 22. **Monitoring & Logging**
- [ ] Application monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Database query logging
- [ ] API usage analytics

## 📋 **API Endpoints Summary**

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Dashboard Endpoints
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/dashboard/:userId` - User-specific dashboard
- `GET /api/leaderboard` - Community leaderboard
- `GET /api/activity` - Recent activity
- `GET /api/activity/:userId` - User-specific activity

### Contribution Endpoints
- `POST /api/contributions` - Submit contribution
- `GET /api/contributions/pending` - Get pending contributions (admin)
- `PUT /api/contributions/:id/approve` - Approve contribution (admin)
- `PUT /api/contributions/:id/reject` - Reject contribution (admin)
- `PUT /api/contributions/:id/update-points` - Update points (admin)

### User Management Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Ambassador Endpoints
- `POST /api/ambassadors/apply` - Apply for ambassador role
- `GET /api/ambassadors/applications` - Get applications (admin)
- `PUT /api/ambassadors/:id/approve` - Approve ambassador (admin)
- `PUT /api/ambassadors/:id/reject` - Reject ambassador (admin)

## 🎯 **Priority Order**

### Phase 1 (Core Functionality)
1. Project setup & database schema
2. Authentication system (register/login/logout)
3. Basic contribution submission
4. Dashboard statistics
5. Leaderboard

### Phase 2 (Advanced Features)
1. Email verification & password reset
2. Contribution review system
3. Ambassador system
4. Advanced analytics
5. User profiles

### Phase 3 (Production Ready)
1. Testing & documentation
2. Security hardening
3. Performance optimization
4. Monitoring & logging
5. Deployment setup

## 📝 **Notes**
- All endpoints should return consistent JSON responses
- Implement proper HTTP status codes
- Include pagination for list endpoints
- Add rate limiting for security
- Implement proper input validation
- Use environment variables for configuration
- Follow RESTful API conventions
