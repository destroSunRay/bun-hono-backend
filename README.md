# Bun App

A modern, full-featured web application built with Bun, Hono, and TypeScript featuring authentication, automatic CRUD API generation, comprehensive API documentation, and robust database management.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- **Framework**: [Hono](https://hono.dev/) - Ultrafast web framework with OpenAPI support
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) with OAuth support (Google, GitHub)
- **API Documentation**: OpenAPI 3.0 with [Scalar UI](https://scalar.com/)
- **Logging**: Winston with daily rotation and structured logging
- **Email**: Resend integration for transactional emails
- **Validation**: Zod schemas with automatic OpenAPI generation
- **Architecture**: Feature-based modular architecture with automatic CRUD operations

## 📋 Features

- 🔐 **Authentication System** - OAuth with Google and GitHub using Better Auth
- � **Automatic CRUD Generation** - Auto-generated REST APIs with OpenAPI documentation
- 📚 **Interactive API Documentation** - Scalar UI with live API testing at `/docs`
- 🗄️ **Database Management** - PostgreSQL with Drizzle ORM, migrations, and Drizzle Studio
- 🏗️ **Feature Generation** - Automated feature scaffolding with `create_feature.sh` script
- 📧 **Email Service** - Transactional emails via Resend integration
- 📊 **Advanced Logging** - Winston with daily rotation, structured logging, and multiple log levels
- 🛡️ **Type Safety** - Full TypeScript support with Zod validation and automatic schema generation
- 🚦 **Error Handling** - Centralized error management with proper HTTP status codes
- 🔒 **Security** - CORS protection, authentication middleware, and organization-based access control
- 🏛️ **Clean Architecture** - Feature-based modular structure with dependency injection
- ⚡ **Performance** - Optimized queries with pagination and soft delete functionality

## 🛠️ Prerequisites

- [Bun](https://bun.sh/) (latest version)
- PostgreSQL database
- Environment variables (see `.env.example`)

## 📦 Installation

1. Clone the repository

```bash
git clone <repository-url>
cd bun-app
```

1. Install dependencies

```bash
bun install
```

1. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

1. Set up the database

```bash
# Generate migration files
bun run db:generate

# Run migrations
bun run db:migrate
```

## 🚀 Getting Started

### Development

```bash
bun run dev
```

### Production

```bash
bun run start
```

The server will start on `http://localhost:8000` (or your configured PORT).

## 📝 Available Scripts

| Script                         | Description                              |
| ------------------------------ | ---------------------------------------- |
| `bun run dev`                  | Start development server with hot reload |
| `bun run start`                | Start production server                  |
| `bun run db:generate`          | Generate Drizzle migration files         |
| `bun run db:migrate`           | Run database migrations                  |
| `bun run db:push`              | Push schema changes to database          |
| `bun run db:pull`              | Pull schema from database                |
| `bun run db:studio`            | Open Drizzle Studio on port 5555         |
| `bun run better-auth:generate` | Generate Better Auth models              |

## 🏗️ Project Structure

```text
src/
├── app.ts                     # Main application entry point
├── index.ts                   # Server startup and configuration
├── config/                    # Configuration files
│   ├── auth.ts               # Better Auth configuration with OAuth providers
│   ├── env.ts                # Environment variables validation with Zod
│   └── openAPI.ts            # OpenAPI documentation configuration
├── db/                       # Database management
│   ├── index.ts              # Database connection and configuration
│   ├── migrations/           # Drizzle migration files
│   └── schema/               # Database schema definitions and exports
├── features/                 # Feature-based architecture
│   ├── auth/                 # Authentication feature module
│   │   ├── auth.controllers.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.services.ts
│   │   └── ...
│   └── tasks/                # Example tasks feature with full CRUD
│       ├── tasks.model.ts    # Drizzle table definition
│       ├── tasks.index.ts    # Route controller setup
│       ├── tasks.routes.ts   # Custom route definitions
│       └── ...
├── lib/                      # Core application logic
│   ├── createApp.ts          # Hono app factory with middleware setup
│   ├── configureOpenAPI.ts   # OpenAPI documentation setup
│   └── hono-openapi/         # Automatic CRUD generation system
│       ├── openapi-route-controller.ts  # CRUD controller generator
│       └── openapi-route-config.ts      # OpenAPI route configuration
├── middleware/               # Custom middleware functions
│   ├── errorHandler.ts       # Global error handling
│   ├── requestLogger.ts      # Request logging with Winston
│   └── requireAuth.ts        # Authentication middleware
├── services/                 # External service integrations
│   ├── email.service.ts      # Resend email service
│   └── log.service.ts        # Winston logging configuration
└── utils/                    # Utility functions and helpers
    ├── auth/                 # Authentication utilities
    ├── db/                   # Database utilities (common columns, relations)
    ├── hono-zod-openapi/     # OpenAPI utilities and schemas
    └── consts/               # HTTP status codes and constants
```

### Feature Generation

The project includes an automated feature generation script:

```bash
# Generate a new feature with all boilerplate files
./create_feature.sh feature-name
```

This creates:

- Model definition with Drizzle schema
- Automatic CRUD routes with OpenAPI documentation
- Service layer for business logic
- Test files structure
- Relations and validation schemas

## 🔧 API Endpoints

### Core Endpoints

- `GET /api/health` - Health check endpoint
- `POST|GET /api/auth/*` - Better Auth authentication routes (login, register, OAuth)

### Automatic CRUD Endpoints

The application automatically generates REST API endpoints for each feature:

#### Tasks API (Example)

- `GET /api/tasks` - Get all tasks with pagination
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/{id}` - Update task by ID
- `DELETE /api/tasks/{id}` - Soft delete task by ID

### API Documentation

- **Interactive Documentation**: Visit `/docs` for Scalar UI with live API testing
- **OpenAPI Spec**: Auto-generated from Zod schemas and route definitions
- **Authentication**: All endpoints (except `/health` and `/auth/*`) require authentication
- **Organization Isolation**: Data is automatically filtered by user's organization

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "pagination": {
    /* pagination info for list endpoints */
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```bash
# Application
NODE_ENV=development
PORT=8000
APPLICATION_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/database

# Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-chars

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Logging (optional)
LOG_LEVEL=info
```

## 🗄️ Database Management

The project uses Drizzle ORM for type-safe database operations:

```bash
# View database in Drizzle Studio (opens on port 5555)
bun run db:studio

# Generate new migration after schema changes
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Push schema changes without migrations (development only)
bun run db:push

# Pull schema from existing database
bun run db:pull
```

### Database Features

- **Type Safety**: Full TypeScript support with automatic type generation
- **Soft Deletes**: Built-in soft delete functionality for all entities
- **Common Columns**: Automatic timestamps, user tracking, and organization isolation
- **Relations**: Automatic relationship handling with foreign keys
- **Migrations**: Version-controlled database schema changes

### Common Database Patterns

The project includes utility functions for common database operations:

- **Common Columns**: `id`, `created_at`, `updated_at`, `deleted_at`, `organizationId`, `created_by`, `updated_by`, `deleted_by`
- **Common Relations**: Automatic user and organization relationships
- **Query Helpers**: Pre-built filters for soft deletes and organization isolation

## 📊 Logging

Logs are automatically rotated daily and stored in the `logs/` directory:

- `combined-YYYY-MM-DD.log` - All logs (info, warn, error)
- `error-YYYY-MM-DD.log` - Error logs only

### Log Levels

- **Error**: Application errors and exceptions
- **Warn**: Warning messages and potential issues
- **Info**: General application information
- **Debug**: Detailed debugging information (development only)

Configure log level with `LOG_LEVEL` environment variable.

## 🛠️ Development Guide

### Creating a New Feature

1. **Generate Feature Structure**

   ```bash
   ./create_feature.sh my-feature
   ```

2. **Define Database Model** (`src/features/my-feature/my-feature.model.ts`)

   ```typescript
   import { necessaryColumns } from '@/utils/db/commonColumns';
   import { pgTable, text } from 'drizzle-orm/pg-core';

   export const myFeature = pgTable('my_feature', {
     ...necessaryColumns,
     name: text('name').notNull(),
     description: text('description'),
   });
   ```

3. **Set Up Routes** (`src/features/my-feature/my-feature.index.ts`)

   ```typescript
   import { CreateRouteControllers } from '@/lib/hono-openapi/openapi-route-controller';
   import { myFeature } from './my-feature.model';

   export const myFeatureRoutes = new CreateRouteControllers(
     'my-feature',
     myFeature,
     {
       routeConfig: {
         tags: ['My Feature'],
         // Custom options here
       },
     }
   );
   ```

4. **Register Routes** (Add to `src/utils/hono-zod-openapi/routes.ts`)

   ```typescript
   import { myFeatureRoutes } from '@/features/my-feature/my-feature.index';

   export default [
     tasksRoutes.router,
     myFeatureRoutes.router, // Add your new feature
   ] as const;
   ```

5. **Generate and Run Migration**

   ```bash
   bun run db:generate
   bun run db:migrate
   ```

### Customizing Auto-Generated Routes

You can customize the automatic CRUD behavior:

```typescript
export const customRoutes = new CreateRouteControllers('entity', table, {
  routeConfig: {
    tags: ['Custom Tag'],
    dependentEntities: [childTable], // Auto-delete children
    disableRouteCreation: {
      deleteById: true, // Disable specific routes
    },
    entitySchemas: {
      selectSchema: customSelectSchema, // Custom Zod schemas
      insertSchema: customInsertSchema,
      patchSchema: customPatchSchema,
    },
  },
});
```

### Authentication & Authorization

- All API routes require authentication (except `/health` and `/auth/*`)
- Users are automatically assigned to organizations
- Data is automatically filtered by organization
- User context available in route handlers via `c.var.userId` and `c.var.organizationId`

## 📚 Documentation

- **[Development Guide](DEVELOPMENT.md)** - Detailed technical documentation and development workflow
- **[API Documentation](API.md)** - Complete REST API reference and examples
- **Interactive API Docs** - Visit `/docs` when running the application for live API testing

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/features/tasks/tasks.tests.ts
```

Tests are organized by feature and include:

- Unit tests for business logic
- Integration tests for API endpoints
- Database operation tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Generate feature boilerplate: `./create_feature.sh feature-name`
4. Implement your changes following the established patterns
5. Add tests for new functionality
6. Run tests and ensure code quality
7. Update documentation as needed
8. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use the automatic CRUD system for standard operations
- Add custom routes only when necessary
- Write tests for new features
- Update documentation for API changes
- Use meaningful commit messages

## 📄 License

[Add your license information here]

## 🆘 Support

For questions and support:

- **Documentation**: Check [DEVELOPMENT.md](DEVELOPMENT.md) and [API.md](API.md)
- **Issues**: [Open an issue](issues) for bugs or feature requests
- **API Testing**: Use the interactive documentation at `/docs`
- **Database**: Use Drizzle Studio with `bun run db:studio`
