type DebugLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = process.env.NODE_ENV === 'development';
const currentLevel: DebugLevel = isDev ? 'debug' : 'info';

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

function shouldLog(level: DebugLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: DebugLevel, scope: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const formattedData = data ? JSON.stringify(data, null, 2) : '';
  return `[${level.toUpperCase()}][${scope}] ${timestamp} - ${message}${formattedData ? '\n' + formattedData : ''}`;
}

export function createScopedLogger(scope: string) {
  return {
    debug(message: string, data?: unknown) {
      if (shouldLog('debug')) {
        console.debug(formatMessage('debug', scope, message, data));
      }
    },

    info(message: string, data?: unknown) {
      if (shouldLog('info')) {
        console.info(formatMessage('info', scope, message, data));
      }
    },

    warn(message: string, data?: unknown) {
      if (shouldLog('warn')) {
        console.warn(formatMessage('warn', scope, message, data));
      }
    },

    error(message: string, error?: unknown) {
      if (shouldLog('error')) {
        console.error(formatMessage('error', scope, message, error));
      }
    },
  };
}

export const logger = createScopedLogger('app');
