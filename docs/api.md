# API Documentation

This document provides detailed information about the API endpoints, request/response formats, and usage examples.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

The API uses JWT (JSON Web Token) based authentication. After successful login or registration, you'll receive a JWT token that must be included in the `Authorization` header for protected endpoints.

### Header Format

```
Authorization: Bearer <your-jwt-token>
```

## Common Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or bad request |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Request data is invalid |
| 500 | Internal Server Error | Server error |

## Authentication Endpoints

### Register User

Creates a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60f7b3b3b3f3f3f3f3f3f3f3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

**Validation Rules**:
- `name`: Required, min 2 characters, max 50 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters, max 128 characters

### Login User

Authenticates a user and returns a JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: Same as register response

### Get Current User Profile

Returns the authenticated user's profile information.

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3f3f3f3f3f3f3f3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## User Management Endpoints

### Get All Users

Returns a paginated list of all users. Requires admin role.

**Endpoint**: `GET /users`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name or email

**Example**: `GET /users?page=1&limit=20&search=john`

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "60f7b3b3b3f3f3f3f3f3f3f3",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pages": 5,
      "total": 50,
      "limit": 10
    }
  }
}
```

### Get User by ID

Returns a specific user by their ID.

**Endpoint**: `GET /users/:id`

**Headers**: `Authorization: Bearer <token>`

**Response**: Same user object as in get all users

### Update User

Updates a user's information. Users can update their own profile, admins can update any user.

**Endpoint**: `PUT /users/:id`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}
```

**Note**: Only admins can change the `role` field.

**Response**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    // Updated user object
  }
}
```

### Delete User

Soft deletes a user (sets `isActive` to false). Requires admin role.

**Endpoint**: `DELETE /users/:id`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Note**: Users cannot delete their own account.

### Change Password

Allows users to change their password.

**Endpoint**: `PUT /users/change-password`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Authorization Error

```json
{
  "success": false,
  "message": "Access denied. Insufficient privileges."
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "User not found"
}
```

### Conflict Error

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Window**: 15 minutes
- **Limit**: 100 requests per IP address
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## Request Examples

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Profile**:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript (Fetch)

```javascript
// Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const registerData = await registerResponse.json();

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// Get profile
const profileResponse = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const profileData = await profileResponse.json();
```

## Best Practices

1. **Always validate responses**: Check the `success` field before processing data
2. **Handle errors gracefully**: Use the error messages for user feedback
3. **Store tokens securely**: Never store JWT tokens in localStorage in production
4. **Implement token refresh**: Handle token expiration gracefully
5. **Use HTTPS**: Always use HTTPS in production
6. **Validate input**: Client-side validation should complement server-side validation
7. **Rate limiting**: Respect rate limits and implement exponential backoff