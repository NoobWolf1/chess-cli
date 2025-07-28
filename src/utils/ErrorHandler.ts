/**
 * Centralized error handling utility
 * Implements Single Responsibility Principle - only handles error processing and logging
 */
export class ErrorHandler {
  /**
   * Handles and formats application errors for user-friendly output
   * @param error - Error instance or unknown error
   * @param context - Additional context about where the error occurred
   */
  static handleError(error: unknown, context?: string): void {
    const errorMessage = this.formatErrorMessage(error, context);
    console.error(errorMessage);
  }

  /**
   * Handles errors and exits the process with appropriate exit code
   * @param error - Error instance or unknown error
   * @param context - Additional context about where the error occurred
   * @param exitCode - Process exit code (default: 1)
   */
  static handleFatalError(error: unknown, context?: string, exitCode: number = 1): never {
    this.handleError(error, context);
    process.exit(exitCode);
  }

  /**
   * Formats error message for consistent output
   * @param error - Error instance or unknown error
   * @param context - Additional context about where the error occurred
   * @returns Formatted error message
   */
  private static formatErrorMessage(error: unknown, context?: string): string {
    const contextPrefix = context ? `[${context}] ` : '';
    
    if (error instanceof Error) {
      return `${contextPrefix}Error: ${error.message}`;
    }
    
    if (typeof error === 'string') {
      return `${contextPrefix}Error: ${error}`;
    }
    
    return `${contextPrefix}Error: An unexpected error occurred`;
  }

  /**
   * Logs warning messages
   * @param message - Warning message
   * @param context - Additional context
   */
  static logWarning(message: string, context?: string): void {
    const contextPrefix = context ? `[${context}] ` : '';
    console.warn(`${contextPrefix}Warning: ${message}`);
  }

  /**
   * Logs informational messages
   * @param message - Info message
   * @param context - Additional context
   */
  static logInfo(message: string, context?: string): void {
    const contextPrefix = context ? `[${context}] ` : '';
    console.log(`${contextPrefix}${message}`);
  }
}