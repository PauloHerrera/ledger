# Loan Service

A loan management service built with Express.js, Drizzle ORM, and PostgreSQL following clean architecture principles.

## Features

- Create and manage borrowers
- Create loans with borrower validation
- List all loans with borrower information
- Get loan by ID with borrower details
- Update loan status (pending/cancelled/lent/settled)
- Shared database utilities with other services

## Architecture

The service follows a layered architecture:

- **Presentation Layer**: API routes, handlers, and validators
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: Database repositories and external services
- **Shared Packages**: Common utilities shared across services

## API Endpoints

### Borrowers

- `POST /api/borrower` - Create a new borrower
  ```json
  {
    "name": "John Doe",
    "document": "123456789"
  }
  ```

- `GET /api/borrower/:id` - Get borrower by ID
- `GET /api/borrowers` - List all borrowers

### Loans

- `POST /api/loan` - Create a new loan
  ```json
  {
    "amount": "10000.00",
    "interestRate": "0.05",
    "borrowerId": "uuid-here"
  }
  ```

- `GET /api/loan/:id` - Get loan by ID (includes borrower info)
- `GET /api/loans` - List all loans (includes borrower info)
- `PUT /api/loan/:id/status` - Update loan status
  ```json
  {
    "status": "lent"
  }
  ```

## Database Schema

### Borrower
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `document` (String, Required, Unique)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Loan
- `id` (UUID, Primary Key)
- `status` (Enum: pending/cancelled/lent/settled)
- `amount` (Decimal)
- `interestRate` (Decimal)
- `borrowerId` (UUID, Foreign Key)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Run database migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

The service will be available at `http://localhost:3001`

## Shared Packages

This service uses the following shared packages:
- `@repo/logger` - Logging utilities
- `@repo/database-utils` - Shared database repository patterns