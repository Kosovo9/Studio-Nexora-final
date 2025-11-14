/**
 * Logger utility - Only logs in development
 * All console.logs should use this instead
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // Always log errors, even in production
    if (level === 'error') return true;
    // Only log other levels in development
    return isDevelopment;
  }

  log(...args: any[]): void {
    if (this.shouldLog('log')) {
      console.log(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    // Always log errors
    console.error(...args);
    
    // In production, send to error tracking service
    if (isProduction) {
      this.sendToErrorTracking(args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...args);
    }
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...args);
    }
  }

  private sendToErrorTracking(error: any[]): void {
    // TODO: Integrate with Sentry, LogRocket, etc.
    // For now, just log to console in production
    try {
      // Example: Sentry.captureException(error);
      // Example: LogRocket.captureException(error);
    } catch (e) {
      // Silent fail - don't break app if error tracking fails
    }
  }
}

export const logger = new Logger();

