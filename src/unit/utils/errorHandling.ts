/**
 * Error handling utilities
 */

/**
 * Standard error types for the application
 */
export enum ErrorType {
  NETWORK = 'network',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

/**
 * Application error class with better categorization
 */
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Create user-friendly error messages
 */
export function getUserFriendlyMessage(error: AppError | Error): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.NETWORK:
        return '网络连接失败，请检查网络状态后重试';
      case ErrorType.PERMISSION:
        return '权限不足，无法访问该资源';
      case ErrorType.NOT_FOUND:
        return '请求的资源未找到';
      case ErrorType.SERVER:
        return '服务器错误，请稍后重试';
      default:
        return error.message || '未知错误';
    }
  }
  return error.message || '发生了未知错误';
}

/**
 * Wrap async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorType: ErrorType = ErrorType.UNKNOWN
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error('Operation failed:', error);
    throw new AppError(
      error instanceof Error ? error.message : String(error),
      errorType,
      undefined,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}