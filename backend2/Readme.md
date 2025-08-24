# Qubic Ambassador API

This is the backend API for the Qubic Ambassador platform, built with NestJS, MongoDB, and Mongoose. It provides a robust and secure foundation for user management, authentication, and core business logic.

## Key Features ✨

- User Registration & Authentication: Secure user sign-up with password hashing.
- Email Verification: Ensures users register with a valid email address.
- Session-based Authentication: Manages user sessions securely with HttpOnly cookies.
- Login & Logout: Endpoints for users to securely log in and terminate their sessions.
- Password Reset: A complete forgotten and reset password flow, including sending reset tokens via email.

## Project Structure

 📁The project follows a modular structure, with each major feature residing in its own module
 
```./src
├── auth/                 # Authentication-related logic (login, register, reset)
│   ├── dto/
│   ├── guards/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── mail/                 # Email sending service for verification and password reset
│   ├── mail.controller.ts
│   ├── mail.module.ts
│   └── mail.service.ts
├── sessions/             # Session management using a database
│   ├── schemas/
│   ├── sessions.controller.ts
│   ├── sessions.module.ts
│   └── sessions.service.ts
├── users/                # User-related schemas and services
│   ├── schemas/
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts         # Main application module
└── main.ts               # Application entry point
```

## Getting Started 🚀

Follow these steps to get the project up and running locally.

### Prerequisites
- Node.js: LTS version recommended
- npm: Comes with Node.js
- MongoDB: A running instance of MongoDB

1. Clone the repositorygit clone <repository-url>

```cd <repository-name>```

2. Install dependencies

```npm install```

3. Configure Environment Variables

Create a .env file in the root directory with the following variables.

```
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/qubic_ambassador

# For sending emails (using nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password
MAIL_FROM_EMAIL=no-reply@qubic.com
```
4. Start the applicationThe application will run in development mode, automatically reloading on file changes.

```npm run start:dev```

The API will be accessible at http://localhost:3000/api.

### Deployment

To deploy the application to a production environment, you first need to build the project.

```
# Build the project
npm run build
```
The compiled JavaScript files will be located in the dist directory. You can then start the application using a process manager like PM2 to keep it running.

```
# Start the production build with PM2
pm2 start dist/main.js
```


> The Readme is still under development and may change when the features change