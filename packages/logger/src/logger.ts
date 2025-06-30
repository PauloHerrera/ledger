import pino from 'pino';
import { LoggerConfig } from './config';
import { getEnvironmentOptions } from './environments';

export class Logger {
  private static instance: pino.Logger;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getLogger(config?: LoggerConfig): pino.Logger {
    if (!Logger.instance) {
      const pinoOptions = getEnvironmentOptions(config);
      Logger.instance = pino(pinoOptions);
    } else {
      // If a logger instance already exists, and a new config is provided,
      // we might want to update it or return a new child logger.
      // For simplicity, this implementation returns the existing instance.
      // If dynamic configuration changes are needed post-instantiation,
      // consider creating a child logger:
      // if (config) {
      //   const pinoOptions = getEnvironmentOptions(config);
      //   return Logger.instance.child({}, pinoOptions);
      // }
    }
    return Logger.instance;
  }
}

// Default logger instance, initialized with no specific config.
// It will use environment variables or defaults.
const logger = Logger.getLogger();

export default logger;
