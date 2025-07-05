# Handler Standardization Guide

This document describes the comprehensive standardization of API handlers across the ledger and loan applications.

## Overview

The handler standardization implements three key improvements:

1. **Consistent ApiResponse Pattern**: All handlers now use a standardized response format
2. **Proper Validation Error Handling**: Zod validation errors are properly formatted and structured
3. **Pagination Support**: All `getAll` routes now support pagination with consistent parameters

## ApiResponse Type Structure

The standardized `ApiResponse` type now includes:

```typescript
interface ApiResponse<T = any> {
  success: boolean;        // Indicates if the operation was successful
  message: string;         // Human-readable message describing the result
  data?: T;               // The actual data payload
  error?: string;         // Error message for failed operations
  errors?: ValidationError[]; // Structured validation errors
  total?: number;         // Total number of items (for paginated responses)
  pagination?: PaginationInfo; // Pagination metadata
}
```

## Helper Functions

### Response Creation Helpers

- `createSuccessResponse<T>(message: string, data?: T, pagination?: PaginationInfo): ApiResponse<T>`
- `createErrorResponse(message: string, error?: string, errors?: ValidationError[]): ApiResponse`

### Validation Helpers

- `formatZodErrors(zodError: any): ValidationError[]` - Formats Zod validation errors into structured format

### Pagination Helpers

- `parsePaginationParams(query: any): PaginationParams` - Parses and validates pagination parameters
- `createPaginationInfo(page: number, limit: number, total: number): PaginationInfo` - Creates pagination metadata

## Validation Error Structure

Validation errors are now consistently structured as:

```typescript
interface ValidationError {
  field: string;    // The field that failed validation
  message: string;  // The validation error message
}
```

## Pagination Structure

Pagination is now standardized with:

```typescript
interface PaginationInfo {
  page: number;       // Current page number
  limit: number;      // Items per page
  total: number;      // Total number of items
  totalPages: number; // Total number of pages
}
```

### Default Pagination Values

- Default page: 1
- Default limit: 10
- Maximum limit: 100

## Example Usage

### Success Response with Data

```typescript
const response = createSuccessResponse("Account created successfully", account);
// Returns:
{
  success: true,
  message: "Account created successfully",
  data: { id: "123", name: "Checking Account", ... }
}
```

### Error Response with Validation Errors

```typescript
const response = createErrorResponse(
  "Invalid account data",
  validation.error.message,
  formatZodErrors(validation.error)
);
// Returns:
{
  success: false,
  message: "Invalid account data",
  error: "Validation failed",
  errors: [
    { field: "name", message: "Name is required" },
    { field: "email", message: "Invalid email format" }
  ]
}
```

### Paginated Response

```typescript
const { page = 1, limit = 10 } = parsePaginationParams(req.query);
const offset = (page - 1) * limit;

const accounts = await useCase.execute();
const paginatedAccounts = accounts.slice(offset, offset + limit);
const total = accounts.length;

const pagination = createPaginationInfo(page, limit, total);
const response = createSuccessResponse(
  "Accounts fetched successfully",
  paginatedAccounts,
  pagination
);
// Returns:
{
  success: true,
  message: "Accounts fetched successfully",
  data: [...],
  pagination: {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3
  }
}
```

## Updated Handlers

### Ledger Application

- ✅ **Account Handler**: `createAccount`, `getAccount`, `getAccounts` (with pagination)
- ✅ **Ledger Handler**: `createLedger`, `getLedger`, `getLedgers` (with pagination)
- ✅ **Journal Handler**: `createJournal`, `getJournal`, `getJournals` (with pagination)
- ✅ **Transaction Handler**: `createTransaction`, `getTransaction`, `getTransactions`
- ✅ **Account Balance Handler**: `getAccountBalances` (with pagination)
- ✅ **Loan Event Handler**: `createLoanEvent`

### Loan Application

- ✅ **Borrower Handler**: `createBorrower`, `getBorrower`, `getBorrowers` (with pagination)
- ✅ **Loan Handler**: `createLoan`, `getLoan`, `getLoans` (with pagination), `updateLoanStatus`

## Benefits

1. **Consistency**: All handlers now follow the same response pattern
2. **Better Error Handling**: Validation errors are properly structured and informative
3. **Improved Client Experience**: Consistent response format makes client-side handling easier
4. **Pagination Support**: All list endpoints now support pagination for better performance
5. **Type Safety**: Strong typing ensures consistent response structures

## API Usage Examples

### Making Paginated Requests

```bash
# Get first page with default limit (10)
GET /api/accounts

# Get specific page with custom limit
GET /api/accounts?page=2&limit=20

# Get all journals for a specific ledger with pagination
GET /api/journals?ledgerId=123&page=1&limit=5
```

### Response Structure

All responses now follow this consistent pattern:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## Migration Notes

- All existing handlers have been updated to use the new pattern
- The `success` field is now included in all responses
- Validation errors are now properly structured
- Pagination is automatically applied to all `getAll` routes
- No breaking changes to existing API endpoints - only enhanced responses

This standardization ensures consistency across the entire application and provides a better developer experience for both API consumers and maintainers.