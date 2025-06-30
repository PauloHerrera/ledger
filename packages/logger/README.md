# @your-org/logger

A reusable logger package for the Turborepo project, built with Pino.

## Features

- Singleton logger instance.
- Environment-aware configuration (development, production, test).
- Pretty printing for development (using `pino-pretty`).
- Structured JSON logging for production.
- Silent by default in test environments.
- Configurable log levels.

## Installation

This package is intended to be used within the monorepo. Ensure dependencies are installed from the root of the Turborepo project.

```bash
# From the root of your turborepo
bun install # or npm install / yarn install
```

If `pino-pretty` is not already a root dev dependency, you might need to add it:
```bash
# From the root of your turborepo
bun add -D pino-pretty # or npm install -D pino-pretty / yarn add -D pino-pretty
```

## Usage

### Basic Usage (Default Logger)

Import the default logger instance. Its behavior will adapt based on the `NODE_ENV` environment variable.

```typescript
import logger from '@your-org/logger';

logger.info('This is an informational message.');
logger.warn('This is a warning message.');
logger.error('This is an error message.');
logger.debug('This is a debug message (visible in development).');
```

### Getting a Configured Logger Instance

You can also get a logger instance with specific configurations. This is useful if you need to override default behavior or provide specific mixins.

```typescript
import { Logger } from '@your-org/logger';

// Get logger with specific settings
const customLogger = Logger.getLogger({
  level: 'trace', // More verbose logging
  prettyPrint: true, // Force pretty print (useful for specific dev scenarios)
  environment: 'development', // Explicitly set environment context
  mixin: () => { // Add custom fields to every log entry
    return { customField: 'customValue', anotherField: 123 };
  }
});

customLogger.trace('A trace message from a custom logger.');
```

### Environment Variables

- `NODE_ENV`: Determines the default logging behavior.
  - `development`: Pretty prints, default level `debug`.
  - `production`: JSON output, default level `info`.
  - `test`: Silent output, default level `silent`.
- `LOG_LEVEL`: Overrides the default log level for the environment (e.g., `LOG_LEVEL=debug`).

### Building the Package

To build the package (compile TypeScript to JavaScript):

```bash
# From the root of your turborepo
turbo run build --filter=@your-org/logger
# or from within the package directory
cd packages/logger
bun run build
```

## Log Patterns / Format

- **Development**: Human-readable format (via `pino-pretty`). Example:
  `[HH:MM:SS] INFO: Your log message`
- **Production**: JSON format. Example:
  `{"level":30,"time":1678886400000,"pid":123,"hostname":"your-host","msg":"Your log message"}`

The exact fields in production (like `pid`, `hostname`) are standard Pino fields. You can customize this further using Pino's extensive options if needed, by modifying the `Logger` class.
```
