# Part 13 - Blogs Backend with PostgreSQL

A RESTful API built with Node.js, Express, and PostgreSQL using Sequelize ORM. This project is part of the University of Helsinki's FullStack Open course.

## Features

- **User Management**: Registration, login, and authentication with JWT
- **Blog Management**: CRUD operations for blog posts
- **Reading Lists**: Users can add blogs to their reading list and mark them as read
- **Server-side Sessions**: Token validation with database-stored sessions
- **User Permissions**: Only blog creators can delete their own blogs
- **Advanced Queries**: Search, filter, and aggregate blog data
- **Database Migrations**: Automated schema management with Sequelize migrations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Migrations**: Umzug
- **Containerization**: Docker (for PostgreSQL)

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd part13-blogs
```

2. **Install dependencies**
```bash
npm install
```

3. **Start PostgreSQL with Docker**
```bash
docker run -d \
  --name postgres-blogs \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  postgres
```

4. **Set up environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
PORT=3001
SECRET=your_secret_key_here
```

5. **Start the application**
```bash
npm run dev
```

The migrations will run automatically on startup, creating all necessary tables.

## API Endpoints

### Authentication

- `POST /api/login` - User login
```json
  {
    "username": "user@example.com",
    "password": "secret"
  }
```

- `DELETE /api/logout` - User logout (requires authentication)

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
```json
  {
    "username": "user@example.com",
    "name": "John Doe"
  }
```
- `GET /api/users/:id` - Get user by ID with reading list
  - Query params: `?read=true` or `?read=false` to filter reading list
- `PUT /api/users/:username` - Update username

### Blogs

- `GET /api/blogs` - Get all blogs
  - Query params: `?search=keyword` to search in title or author
- `POST /api/blogs` - Create a blog (requires authentication)
```json
  {
    "author": "Dan Abramov",
    "url": "https://example.com",
    "title": "Blog Title",
    "year": 2024
  }
```
- `DELETE /api/blogs/:id` - Delete a blog (requires authentication, only creator)
- `PUT /api/blogs/:id` - Update blog likes
```json
  {
    "likes": 10
  }
```

### Reading Lists

- `POST /api/readinglists` - Add blog to reading list
```json
  {
    "blogId": 1,
    "userId": 1
  }
```
- `PUT /api/readinglists/:id` - Mark blog as read (requires authentication)
```json
  {
    "read": true
  }
```

### Authors

- `GET /api/authors` - Get blog statistics by author (aggregated data)

## Database Schema

### Users
- `id` (Primary Key)
- `username` (Unique, Email format)
- `name`
- `disabled` (Boolean)
- `created_at`
- `updated_at`

### Blogs
- `id` (Primary Key)
- `author`
- `url` (Required)
- `title` (Required)
- `likes` (Default: 0)
- `year` (Validation: 1991-current year)
- `user_id` (Foreign Key → Users)
- `created_at`
- `updated_at`

### Reading Lists
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `blog_id` (Foreign Key → Blogs)
- `read` (Boolean, Default: false)

### Sessions
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `token`
- `created_at`
- `updated_at`

## Migrations

Migrations are stored in the `migrations/` directory and run automatically on application startup.

To rollback the last migration:
```bash
npm run migration:down
```

## Development
```bash
# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migration:down` - Rollback last migration

## Authentication Flow

1. User logs in via `POST /api/login`
2. Server validates credentials and creates a session in the database
3. Server returns a JWT token
4. Client includes token in `Authorization: Bearer <token>` header for protected routes
5. Server validates token exists in sessions table and user is not disabled
6. User can logout via `DELETE /api/logout` to invalidate the session

## Security Features

- Password validation (currently hardcoded to "secret" for all users)
- JWT token authentication
- Server-side session management
- User account disable/enable functionality
- Token expiration on logout
- Protected routes requiring authentication
- Authorization checks (users can only delete their own blogs)

## Docker Support

To restart the PostgreSQL container after system reboot:
```bash
docker start postgres-blogs
```

To make it restart automatically:
```bash
docker update --restart=always postgres-blogs
```