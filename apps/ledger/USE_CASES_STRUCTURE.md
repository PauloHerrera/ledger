# Use Cases Structure

The use cases have been refactored to follow the single responsibility principle, with each use case class in its own file.

## File Structure

```
src/application/use-cases/
├── ledgerUseCase.ts           # Re-exports for backward compatibility
├── createLedgerUseCase.ts     # CreateLedgerUseCase class
├── getLedgerUseCase.ts        # GetLedgerUseCase class
├── getLedgersUseCase.ts       # GetLedgersUseCase class
├── accountUseCase.ts          # Re-exports for backward compatibility
├── createAccountUseCase.ts    # CreateAccountUseCase class
├── getAccountUseCase.ts       # GetAccountUseCase class
├── getAccountsUseCase.ts      # GetAccountsUseCase class
├── journalUseCase.ts          # Re-exports for backward compatibility
├── createJournalUseCase.ts    # CreateJournalUseCase class
├── getJournalUseCase.ts       # GetJournalUseCase class
└── getJournalsUseCase.ts      # GetJournalsUseCase class
```

## Use Case Classes

### Ledger Use Cases
- **CreateLedgerUseCase**: Handles ledger creation with validation and DTO mapping
- **GetLedgerUseCase**: Retrieves a single ledger by ID with error handling
- **GetLedgersUseCase**: Retrieves all ledgers

### Account Use Cases
- **CreateAccountUseCase**: Handles account creation with validation and DTO mapping
- **GetAccountUseCase**: Retrieves a single account by ID with error handling
- **GetAccountsUseCase**: Retrieves all accounts

### Journal Use Cases
- **CreateJournalUseCase**: Handles journal creation with entry validation and batch processing
- **GetJournalUseCase**: Retrieves a single journal by ID with error handling
- **GetJournalsUseCase**: Retrieves all journals

## Backward Compatibility

The original use case files (`ledgerUseCase.ts`, `accountUseCase.ts`, `journalUseCase.ts`) are maintained as re-export files to ensure existing imports continue to work without modification.

## Benefits

1. **Single Responsibility**: Each file contains only one use case class
2. **Better Organization**: Easier to locate and maintain specific use cases
3. **Improved Testing**: Each use case can be tested in isolation
4. **Enhanced Readability**: Smaller, focused files are easier to understand
5. **Backward Compatibility**: Existing code continues to work without changes

## Usage

You can import use cases in two ways:

### Direct Import (Recommended for new code)
```typescript
import CreateLedgerUseCase from '../../application/use-cases/createLedgerUseCase';
import GetLedgerUseCase from '../../application/use-cases/getLedgerUseCase';
```

### Re-export Import (Existing code compatibility)
```typescript
import CreateLedgerUseCase, { GetLedgerUseCase, GetLedgersUseCase } from '../../application/use-cases/ledgerUseCase';
```