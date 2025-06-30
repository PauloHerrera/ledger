import { LoggerOptions } from 'pino';

export interface LoggerConfig {
  level?: string;
  prettyPrint?: boolean;
  environment?: 'development' | 'production' | 'test';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mixin?: () => Record<string, any>;
}

export const defaultPinoOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
};
