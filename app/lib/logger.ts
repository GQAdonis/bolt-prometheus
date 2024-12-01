function formatData(data: unknown): string {
  if (!data) return '';
  try {
    return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  } catch (e) {
    return String(data);
  }
}

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  debug(message: string, data?: unknown) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data ? formatData(data) : '');
    }
  },

  info(message: string, data?: unknown) {
    console.info(`[INFO] ${message}`, data ? formatData(data) : '');
  },

  warn(message: string, data?: unknown) {
    console.warn(`[WARN] ${message}`, data ? formatData(data) : '');
  },

  error(message: string, error?: unknown) {
    console.error(`[ERROR] ${message}`, error ? formatData(error) : '');
  }
};
