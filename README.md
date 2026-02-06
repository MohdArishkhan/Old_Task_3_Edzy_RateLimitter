# Task 3 – Rate Limiter Middleware

A comprehensive Node.js TypeScript backend application built with industry best practices for hackathon projects. This backend provides a robust foundation with authentication, user management, and a scalable architecture.

## 🎯 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user registration, login, profile management
- **Input Validation**: Request validation using Joi
- **Error Handling**: Comprehensive error handling with custom error classes
- **Logging**: Structured logging with Winston
- **API Documentation**: Interactive API docs with Swagger/OpenAPI
- **Testing**: Complete test suite with Jest and Supertest
- **Docker Support**: Containerized application with Docker and Docker Compose
- **Security**: Security best practices with Helmet, CORS, rate limiting
- **Database**: MongoDB integration with Mongoose ODM
- **Code Quality**: ESLint, Prettier, and TypeScript for code quality

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Code Quality**: ESLint + Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task_3_Edzy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/hackathon_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Start the application**
   
   Development mode with hot reload:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm run build
   npm start
   ```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - Backend API on port 3000
   - MongoDB on port 27017
   - Mongo Express (DB admin UI) on port 8081

2. **View logs**
   ```bash
   docker-compose logs -f app
   ```

### Using Docker only

```bash
# Build the image
docker build -t hackathon-backend .

# Run the container
docker run -p 3000:3000 --env-file .env hackathon-backend
```

## 📋 API Documentation

Once the application is running, you can access:

- **API Documentation (Swagger UI)**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **Base API URL**: http://localhost:3000/api

### Available Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

#### User Management

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/change-password` - Change password

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- `tests/controllers/` - API endpoint tests
- `tests/models/` - Database model tests
- `tests/middleware/` - Middleware tests
- `tests/setup.ts` - Test environment setup

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## 📁 Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts  # MongoDB connection
│   └── swagger.ts   # Swagger/API documentation
├── controllers/     # Route controllers
│   ├── authController.ts
│   └── userController.ts
├── middleware/      # Custom middleware
│   ├── auth.ts      # Authentication middleware
│   ├── errorHandler.ts # Error handling
│   └── validate.ts  # Request validation
├── models/          # Database models
│   └── User.ts      # User model
├── routes/          # Route definitions
│   ├── auth.ts      # Auth routes
│   └── user.ts      # User routes
├── utils/           # Utility functions
│   ├── helpers.ts   # Helper functions
│   └── logger.ts    # Logging configuration
├── validation/      # Validation schemas
│   └── userValidation.ts
├── app.ts           # Express app setup
└── healthcheck.ts   # Health check script

tests/              # Test files
├── controllers/    # Controller tests
├── models/         # Model tests
└── setup.ts        # Test setup
```

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent abuse and DoS attacks
- **CORS Configuration**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Validate all incoming requests
- **Error Handling**: Don't leak sensitive information

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/hackathon_db` |
| `JWT_SECRET` | JWT signing secret | `required` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `LOG_LEVEL` | Logging level | `debug` |

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field error message"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Run the test suite
6. Commit your changes
7. Push to the branch
8. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help, please:

1. Check the API documentation at `/api-docs`
2. Review the test files for usage examples
3. Create an issue in the repository

## 🎯 Development Guidelines

- Follow TypeScript best practices
- Write tests for all new features
- Use ESLint and Prettier for code consistency
- Follow RESTful API conventions
- Document your API endpoints with Swagger comments
- Use semantic versioning for releases
- Keep dependencies up to date
