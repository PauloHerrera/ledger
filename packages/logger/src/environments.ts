import { LoggerOptions } from 'pino';
import { LoggerConfig, defaultPinoOptions } from './config';

export function getEnvironmentOptions(config?: LoggerConfig): LoggerOptions {
  const env = config?.environment || process.env.NODE_ENV || 'development';
  let options: LoggerOptions = { ...defaultPinoOptions };

  if (config?.level) {
    options.level = config.level;
  }

  if (env === 'development') {
    options = {
      ...options,
      level: config?.level || defaultPinoOptions.level || 'debug', // Ensure debug if no level set for dev
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    };
  } else if (env === 'production') {
    options = {
      ...options,
      level: config?.level || defaultPinoOptions.level || 'info', // Ensure info if no level set for prod
      // Pino defaults to JSON output which is good for production
      // Add any production-specific options here if needed
    };
  } else if (env === 'test') {
    options = {
      ...options,
      level: config?.level || 'silent', // No logs during tests unless specified
    };
  }

  // If prettyPrint is explicitly set in config, it overrides environment-based transport,
  // but typically we don't want prettyPrint in production.
  if (config?.prettyPrint && env !== 'production') {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }

  if (config?.mixin) {
    options.mixin = config.mixin;
  }

  return options;
}
