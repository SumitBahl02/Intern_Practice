# Advanced NestJS API - Production Ready Task Management System

A comprehensive, production-ready REST API built with NestJS featuring enterprise-level architecture, security, and performance optimizations.

## 🚀 Key Features

### Core Architecture
- ✅ **TypeScript** - Full type safety and modern JavaScript features
- ✅ **NestJS Framework** - Scalable server-side applications with decorators
- ✅ **Prisma ORM** - Type-safe database client with migrations
- ✅ **SQLite Database** - Lightweight database for development
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control (RBAC)** - Admin/User permission system

### Advanced Features
- ✅ **Swagger Documentation** - Auto-generated API documentation
- ✅ **Global Error Handling** - Comprehensive exception filters
- ✅ **Request/Response Interceptors** - Logging and response formatting
- ✅ **Data Validation** - Class-validator with DTOs
- ✅ **Pagination & Filtering** - Efficient data retrieval
- ✅ **Redis Caching** - Performance optimization (optional)
- ✅ **Docker Support** - Complete containerization

### Development Experience
- ✅ **Hot Reload** - Development server with watch mode
- ✅ **Automated Testing** - API endpoint testing script
- ✅ **Database Seeding** - Pre-populated test data
- ✅ **Environment Configuration** - Flexible configuration management
- ✅ **Code Quality** - ESLint, Prettier, and TypeScript strict mode

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
│   ├── guards/        # JWT and role guards
│   ├── strategies/    # Passport strategies
│   └── dto/          # Auth data transfer objects
├── users/            # User management module
├── tasks/            # Task management module
├── projects/         # Project management module
├── common/           # Shared utilities
│   ├── decorators/   # Custom decorators
│   ├── filters/      # Exception filters
│   ├── guards/       # Authorization guards
│   ├── interceptors/ # Request/response interceptors
│   └── interfaces/   # TypeScript interfaces
└── redis/            # Redis caching module
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 3. Start with Docker
```bash
docker-compose up --build
```

### 4. Start Development
```bash
npm run start:dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users (Admin only)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `DELETE /users/:id` - Delete user (Admin only)

### Tasks
- `GET /tasks?page=1&limit=10&status=PENDING&search=task` - List tasks with pagination/filtering
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Projects
- `GET /projects?page=1&limit=10&search=project` - List projects with pagination
- `POST /projects` - Create project
- `GET /projects/:id` - Get project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

### Task Filtering
- `status` - PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- `priority` - LOW, MEDIUM, HIGH, URGENT

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/advanced_api_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
NODE_ENV=development
```

## Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## Testing API

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Tasks with Pagination
```bash
curl -X GET "http://localhost:3000/tasks?page=1&limit=5&status=PENDING" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Performance Features

- **Redis Caching** - GET endpoints cached for 5 minutes
- **Database Indexes** - Optimized queries on frequently accessed fields
- **Pagination** - Efficient data loading
- **Connection Pooling** - Prisma connection management

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Admin/User permissions
- **Input Validation** - DTO validation with class-validator
- **Error Handling** - Consistent error responses