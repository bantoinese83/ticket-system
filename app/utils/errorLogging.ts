export function logError(error: unknown, context: string): void {
  console.error(`Error in ${context}:`, error)
  // In a production environment, you would typically send this to a logging service
  // For example:
  // sendToLoggingService({ error, context, timestamp: new Date() });
}

