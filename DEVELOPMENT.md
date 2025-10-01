# Development Guide

This document provides detailed information for developers working on the Bun App project.

## 🏗️ Architecture Overview

The application follows a feature-based modular architecture with the following key principles:

- **Feature Modules**: Each feature is self-contained with its own models, controllers, services, and tests
- **Automatic CRUD**: REST APIs are automatically generated from database models
- **Type Safety**: Full TypeScript support with runtime validation via Zod
- **Organization Isolation**: Multi-tenant architecture with automatic data filtering
- **Soft Deletes**: All entities support soft deletion for data recovery

## 🔧 Core Components

### 1. Automatic Route Controller System

The `CreateRouteControllers` class automatically generates REST API endpoints:

```typescript
// Basic usage
export const entityRoutes = new CreateRouteControllers('entity', entityTable);

// Advanced configuration
export const customRoutes = new CreateRouteControllers('entity', entityTable, {
  routeConfig: {
    tags: ['Custom API'],
    dependentEntities: [childTable1, childTable2], // Auto-cascade deletes
    disableRouteCreation: {
      deleteById: true, // Disable specific endpoints
      post: false,
    },
    entitySchemas: {
      selectSchema: customSelectSchema,
      insertSchema: customInsertSchema,
      patchSchema: customPatchSchema,
    },
  },
});
```

**Generated Endpoints:**

- `GET /{entity}` - List with pagination
- `GET /{entity}/{id}` - Get by ID
- `POST /{entity}` - Create new
- `PATCH /{entity}/{id}` - Update existing
- `DELETE /{entity}/{id}` - Soft delete

### 2. Database Patterns

#### Common Columns

All tables should include common columns for consistency:

```typescript
import { necessaryColumns } from '@/utils/db/commonColumns';

export const myTable = pgTable('my_table', {
  ...necessaryColumns,
  // Your custom columns here
  name: text('name').notNull(),
});
```

**Common columns included:**

- `id`: UUID primary key
- `organizationId`: Organization isolation
- `created_at`, `updated_at`: Timestamps
- `deleted_at`: Soft delete support
- `created_by`, `updated_by`, `deleted_by`: User tracking

#### Common Relations

Use common relations for automatic user and organization relationships:

```typescript
import { commonRelations } from '@/utils/db/commonRelations';

export const myTableRelations = relations(myTable, ({ one, many }) => ({
  ...commonRelations(one, myTable),
  // Your custom relations here
}));
```

### 3. Authentication & Authorization

#### Middleware

- `requireAuth`: Ensures user is authenticated and sets `userId` and `organizationId` in context
- All routes automatically filter data by organization
- User context available via `c.var.userId` and `c.var.organizationId`

#### OAuth Providers

Configured in `src/config/auth.ts`:

```typescript
export default betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

### 4. OpenAPI Documentation

#### Automatic Generation

- Schemas automatically generated from Zod definitions
- Route documentation generated from model definitions
- Interactive UI available at `/docs`

#### Custom Documentation

```typescript
// Custom schemas for specific endpoints
const customSelectSchema = z.object({
  id: z.string(),
  name: z.string(),
  // Only expose specific fields
});

// Use in route controller
export const routes = new CreateRouteControllers('entity', table, {
  routeConfig: {
    entitySchemas: {
      selectSchema: customSelectSchema,
    },
  },
});
```

## 🔄 Development Workflow

### 1. Adding a New Feature

1. **Generate boilerplate:**

   ```bash
   ./create_feature.sh feature-name
   ```

2. **Define model with proper columns:**

   ```typescript
   export const featureName = pgTable('feature_name', {
     ...necessaryColumns,
     title: text('title').notNull(),
     description: text('description'),
   });
   ```

3. **Set up relations:**

   ```typescript
   export const featureNameRelations = relations(
     featureName,
     ({ one, many }) => ({
       ...commonRelations(one, featureName),
       // Custom relations
     })
   );
   ```

4. **Configure routes:**

   ```typescript
   export const featureNameRoutes = new CreateRouteControllers(
     'feature-name',
     featureName,
     {
       routeConfig: {
         tags: ['Feature Name'],
       },
     }
   );
   ```

5. **Register in routes file:**

   ```typescript
   // src/utils/hono-zod-openapi/routes.ts
   export default [
     // existing routes...
     featureNameRoutes.router,
   ] as const;
   ```

6. **Generate and run migration:**

   ```bash
   bun run db:generate
   bun run db:migrate
   ```

### 2. Database Changes

Always use migrations for schema changes:

```bash
# Make changes to your model files
# Generate migration
bun run db:generate

# Review migration files in src/db/migrations/
# Apply migrations
bun run db:migrate
```

### 3. Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test src/features/tasks/tasks.tests.ts

# Watch mode
bun test --watch
```

### 4. Debugging

1. **Check logs:**

   ```bash
   tail -f logs/combined-$(date +%Y-%m-%d).log
   ```

2. **Database inspection:**

   ```bash
   bun run db:studio
   ```

3. **API testing:**
   - Visit `/docs` for interactive API documentation
   - Use the built-in testing interface

## 🎯 Best Practices

### 1. Database Design

- Always use `necessaryColumns` for consistent table structure
- Use descriptive table and column names
- Add appropriate constraints and indexes
- Use relations for referential integrity

### 2. API Design

- Let the automatic CRUD handle standard operations
- Add custom routes only when needed
- Use proper HTTP status codes
- Validate input with Zod schemas

### 3. Error Handling

- Use the global error handler for consistent responses
- Log errors with appropriate levels
- Provide meaningful error messages to clients

### 4. Security

- Never expose internal IDs or sensitive data
- Always validate and sanitize input
- Use organization isolation for multi-tenancy
- Keep authentication tokens secure

### 5. Performance

- Use pagination for list endpoints
- Add database indexes for frequently queried columns
- Use soft deletes instead of hard deletes
- Monitor query performance with logging

## 🔍 Troubleshooting

### Common Issues

1. **Migration Errors**
   - Check for syntax errors in model definitions
   - Ensure proper column types and constraints
   - Review migration files before applying

2. **Authentication Issues**
   - Verify environment variables are set correctly
   - Check OAuth provider configurations
   - Ensure database tables are created for Better Auth

3. **Route Not Found**
   - Verify route is registered in `routes.ts`
   - Check middleware order in `createApp.ts`
   - Ensure proper path formatting

4. **Database Connection Issues**
   - Verify `DATABASE_URL` environment variable
   - Check PostgreSQL server is running
   - Ensure database exists and user has permissions

### Debug Commands

```bash
# Check environment variables
bun run --print process.env

# Test database connection
bun run db:push --dry-run

# Validate OpenAPI schema
curl http://localhost:8000/docs

# Check logs
tail -f logs/error-$(date +%Y-%m-%d).log
```

## 📦 Dependencies

### Core Dependencies

- **Hono**: Web framework with OpenAPI support
- **Drizzle ORM**: Type-safe database operations
- **Better Auth**: Authentication with OAuth
- **Zod**: Runtime type validation
- **Winston**: Structured logging

### Development Dependencies

- **Drizzle Kit**: Database migrations and studio
- **@types/**: TypeScript definitions
- **dotenv**: Environment variable loading

## 🚀 Deployment

### Environment Setup

Ensure all required environment variables are configured:

```bash
# Application settings
NODE_ENV=production
PORT=8000
APPLICATION_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
BETTER_AUTH_SECRET=your-secure-secret-key-min-32-characters

# OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email service
RESEND_API_KEY=your-resend-api-key

# Logging
LOG_LEVEL=info
```

### Build and Deploy

```bash
# Install dependencies
bun install

# Run database migrations
bun run db:migrate

# Start production server
bun run start
```

### Health Checks

Monitor application health:

- `GET /api/health` - Application health status
- Check log files for errors
- Monitor database connection status
- Verify OAuth provider connectivity
