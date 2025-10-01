# API Documentation

This document provides detailed information about the Bun App REST API.

## 🔗 Base URL

All API endpoints are prefixed with `/api`:

```text
http://localhost:8000/api
```

## 🔐 Authentication

### Authentication Methods

The API uses Better Auth for authentication with support for:

- Email/Password authentication
- OAuth providers (Google, GitHub)
- Session-based authentication

### Authentication Endpoints

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/sign-in`  | Sign in with email/password |
| POST   | `/api/auth/sign-up`  | Create new account          |
| POST   | `/api/auth/sign-out` | Sign out current user       |
| GET    | `/api/auth/google`   | OAuth with Google           |
| GET    | `/api/auth/github`   | OAuth with GitHub           |
| GET    | `/api/auth/session`  | Get current session         |

### Authentication Headers

For authenticated requests, include session cookies automatically handled by the browser.

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "pagination": {
    "totalPages": 10,
    "page": 1,
    "limit": 50
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Description                                |
| ---- | ------------------------------------------ |
| 200  | OK - Request successful                    |
| 201  | Created - Resource created successfully    |
| 204  | No Content - Resource deleted successfully |
| 400  | Bad Request - Invalid request format       |
| 401  | Unauthorized - Authentication required     |
| 403  | Forbidden - Insufficient permissions       |
| 404  | Not Found - Resource not found             |
| 422  | Unprocessable Entity - Validation errors   |
| 500  | Internal Server Error - Server error       |

## 🏥 Health Check

### GET /api/health

Check application health status.

**Response:**

```json
{
  "success": true,
  "status": "OK"
}
```

## 📋 Tasks API

The Tasks API demonstrates the automatic CRUD functionality.

### List Tasks

**GET** `/api/tasks`

Retrieve a paginated list of tasks for the current organization.

**Query Parameters:**

- `limit` (optional): Number of items per page (1-100, default: 50)
- `pageNumber` (optional): Page number (default: 1)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "completed": false
    }
  ],
  "pagination": {
    "totalPages": 1,
    "page": 1,
    "limit": 50
  }
}
```

### Get Task by ID

**GET** `/api/tasks/{id}`

Retrieve a specific task by its ID.

**Parameters:**

- `id` (path): Task UUID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "completed": false
  }
}
```

### Create Task

**POST** `/api/tasks`

Create a new task.

**Request Body:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "completed": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "completed": false
  }
}
```

### Update Task

**PATCH** `/api/tasks/{id}`

Update an existing task.

**Parameters:**

- `id` (path): Task UUID

**Request Body (partial update):**

```json
{
  "completed": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "completed": true
  }
}
```

### Delete Task

**DELETE** `/api/tasks/{id}`

Soft delete a task (marks as deleted but preserves data).

**Parameters:**

- `id` (path): Task UUID

**Response:**

```text
204 No Content
```

## 🔒 Authorization & Data Isolation

### Organization-Based Access Control

- All API endpoints automatically filter data by the user's organization
- Users can only access data belonging to their organization
- Organization assignment happens automatically during user creation

### Data Filtering

The API automatically applies the following filters to all requests:

- `organizationId = current_user.organizationId`
- `deleted_at IS NULL` (excludes soft-deleted records)

### User Context

Route handlers have access to authenticated user information:

```typescript
// Available in route handlers
const { userId, organizationId } = c.var;
```

## 🔧 Automatic CRUD Features

### Generated Endpoints

For each feature with a database model, the following endpoints are automatically generated:

| Method | Pattern          | Description                    |
| ------ | ---------------- | ------------------------------ |
| GET    | `/{entity}`      | List all items with pagination |
| GET    | `/{entity}/{id}` | Get single item by ID          |
| POST   | `/{entity}`      | Create new item                |
| PATCH  | `/{entity}/{id}` | Update existing item           |
| DELETE | `/{entity}/{id}` | Soft delete item               |

### Query Features

#### Pagination

All list endpoints support pagination:

- `limit`: Items per page (1-100, default: 50)
- `pageNumber`: Page number (starts at 1)

#### Soft Deletes

- DELETE operations perform soft deletes (set `deleted_at` timestamp)
- Soft-deleted items are automatically excluded from queries
- Data can be recovered if needed

#### Automatic Timestamps

All records automatically include:

- `created_at`: When record was created
- `updated_at`: When record was last modified
- `created_by`: User ID who created the record
- `updated_by`: User ID who last modified the record

## 📖 Interactive Documentation

### Scalar UI

Visit `/docs` when the application is running to access interactive API documentation with:

- Complete endpoint documentation
- Request/response schemas
- Live API testing interface
- Authentication integration
- Example requests and responses

### OpenAPI Specification

The OpenAPI 3.0 specification is automatically generated from:

- Database models (via Drizzle schema)
- Zod validation schemas
- Route definitions
- TypeScript type information

## 🚨 Error Handling

### Validation Errors

When request validation fails, the API returns detailed error information:

```json
{
  "success": false,
  "error": {
    "issues": [
      {
        "path": ["title"],
        "message": "Title is required"
      }
    ]
  }
}
```

### Common Error Scenarios

1. **Unauthorized (401)**
   - Missing or invalid authentication
   - Session expired

2. **Not Found (404)**
   - Resource doesn't exist
   - Resource belongs to different organization

3. **Validation Error (422)**
   - Invalid request body format
   - Missing required fields
   - Field validation failures

4. **Server Error (500)**
   - Database connection issues
   - Unexpected application errors

## 🧪 Testing the API

### Using the Interactive Documentation

1. Start the application: `bun run dev`
2. Navigate to `http://localhost:8000/docs`
3. Authenticate using the auth endpoints
4. Test any endpoint with the interactive interface

### Using cURL

```bash
# Health check (no auth required)
curl http://localhost:8000/api/health

# Get tasks (requires authentication)
curl -H "Authorization: Bearer <session-token>" \
     http://localhost:8000/api/tasks

# Create a task
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <session-token>" \
     -d '{"title":"New task","description":"Task description"}' \
     http://localhost:8000/api/tasks
```

### Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

## 🔄 Webhooks & Events

Webhooks and event system are not currently implemented but can be added to the feature architecture as needed.

## 📋 API Versioning

The current API is version 1 and does not include versioning in the URL. Future versions can be implemented using:

- URL versioning: `/api/v2/tasks`
- Header versioning: `Accept: application/vnd.api.v2+json`
- Parameter versioning: `/api/tasks?version=2`

## 🛡️ Security Considerations

### CORS Configuration

CORS is configured to allow requests from the specified origin in the `CORS_ORIGIN` environment variable.

### Input Validation

All inputs are validated using Zod schemas before processing.

### SQL Injection Prevention

Drizzle ORM provides protection against SQL injection through parameterized queries.

### Authentication Security

- Sessions are handled securely by Better Auth
- OAuth flows follow standard security practices
- Session cookies include security flags

## 📊 Monitoring & Logging

### Request Logging

All API requests are logged with:

- HTTP method and URL
- Response status code
- Response time
- User ID (if authenticated)

### Error Logging

Errors are logged with full stack traces and context information.

### Health Monitoring

Monitor the `/api/health` endpoint for application availability.
