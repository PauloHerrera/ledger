# IDB Interface Implementation

## Overview

This document describes the implementation of the `IDB` interface to improve dependency injection and SOLID principles across the repository. The interface abstracts database operations and enables better separation of concerns between business logic and data access layers.

## What Was Implemented

### 1. IDB Interface Creation

The `IDB` interface was created to abstract database operations:

```typescript
export interface IDB {
  // Basic operations that repositories need
  insert: (table: any) => any;
  select: () => any;
  update: (table: any) => any;
  delete: (table: any) => any;
  
  // Transaction support
  transaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
  
  // Query API for complex queries
  query: Record<string, any>;
}
```

### 2. Location of IDB Interface

The interface is defined in the following locations:

- **`packages/database-utils/src/types/database.ts`** - Shared interface definition
- **`apps/ledger/src/infrastructure/db/index.ts`** - Local implementation for ledger app
- **`apps/loan/src/infrastructure/db/index.ts`** - Local implementation for loan app

### 3. Updated Repository Classes

All `BaseRepository` classes have been updated to use the `IDB` interface instead of the concrete `Database` type:

#### Before:
```typescript
export class BaseRepository<T, NewT extends Record<string, any>> {
  constructor(
    protected db: Database,  // Concrete type
    protected table: any
  ) {}
}
```

#### After:
```typescript
export class BaseRepository<T, NewT extends Record<string, any>> {
  constructor(
    protected db: IDB,  // Interface for dependency injection
    protected table: any
  ) {}
}
```

### 4. Files Modified

- `packages/database-utils/src/types/database.ts` - Added IDB interface
- `packages/database-utils/src/repository/BaseRepository.ts` - Updated to use IDB
- `apps/ledger/src/infrastructure/db/index.ts` - Added IDB interface
- `apps/ledger/src/infrastructure/repositories/baseRepository.ts` - Updated to use IDB
- `apps/ledger/package.json` - Added database-utils dependency
- `apps/loan/src/infrastructure/db/index.ts` - Added IDB interface
- `apps/loan/src/infrastructure/repositories/baseRepository.ts` - Updated to use IDB

## Benefits

### 1. **Improved Dependency Injection**
- Repositories now depend on an interface rather than a concrete implementation
- Makes it easier to swap database implementations or create mock implementations for testing

### 2. **Better SOLID Principles**
- **Dependency Inversion Principle**: High-level modules (repositories) no longer depend on low-level modules (concrete database), both depend on abstractions (IDB interface)
- **Interface Segregation**: The interface only exposes the operations that repositories actually need

### 3. **Enhanced Testability**
- You can easily create mock implementations of IDB for unit testing
- No need to set up a real database connection for testing repository logic

### 4. **Cleaner Architecture**
- Clear separation between business logic and data access
- Easier to maintain and extend

## Usage Examples

### 1. Using in Production
```typescript
import { db } from "../db";
import { AccountRepository } from "./accountRepository";

// db already implements IDB interface
const accountRepo = new AccountRepository(db);
```

### 2. Testing with Mock Implementation
```typescript
const mockDb: IDB = {
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockResolvedValue([mockAccount])
    })
  }),
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue([mockAccount])
    })
  }),
  // ... other methods
};

const accountRepo = new AccountRepository(mockDb);
```

### 3. Custom Database Implementation
```typescript
class CustomDatabase implements IDB {
  insert(table: any) {
    // Custom implementation
  }
  
  select() {
    // Custom implementation
  }
  
  // ... other methods
}

const customDb = new CustomDatabase();
const accountRepo = new AccountRepository(customDb);
```

## Migration Guide

### For Existing Code

1. **Repository Constructors**: No changes needed if you're passing the existing `db` instance
2. **Testing**: You can now create mock implementations of IDB for better unit testing
3. **New Repositories**: Use the IDB interface in constructor parameter types

### For New Features

1. Always use `IDB` interface in repository constructors
2. Consider creating mock implementations for testing
3. Document any new database operations that might need to be added to the interface

## Future Enhancements

### 1. More Specific Interface Methods
The current interface uses `any` types for flexibility. Consider creating more specific type definitions:

```typescript
interface IDB {
  insert<T>(table: Table<T>): InsertBuilder<T>;
  select<T>(): SelectBuilder<T>;
  // ... more typed methods
}
```

### 2. Database-Specific Interfaces
Create specific interfaces for different database operations:

```typescript
interface ITransactionDB extends IDB {
  transaction<T>(callback: (tx: IDB) => Promise<T>): Promise<T>;
}

interface IQueryDB extends IDB {
  query: QueryBuilder;
}
```

### 3. Repository Factory Pattern
Implement a factory pattern to create repositories with proper dependency injection:

```typescript
class RepositoryFactory {
  constructor(private db: IDB) {}
  
  createAccountRepository(): AccountRepository {
    return new AccountRepository(this.db);
  }
}
```

## Conclusion

The IDB interface implementation successfully improves dependency injection and SOLID principles across the repository. It provides a clean abstraction layer that enhances testability, maintainability, and extensibility while maintaining compatibility with existing code.