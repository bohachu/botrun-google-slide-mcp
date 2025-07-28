import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

/**
 * Handles errors from Google API calls and converts them into McpError instances.
 * @param error The error object caught from the API call.
 * @param toolName The name of the tool where the error occurred.
 * @returns An McpError instance.
 */

const extractRawErrorMessage = (err: unknown): string => {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const gError = err as { response?: { data?: { error?: { message?: string } } } };
    return gError.response?.data?.error?.message || (err instanceof Error ? err.message : String(err));
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'Unknown Google API error';
};

export const handleGoogleApiError = (error: unknown, toolName: string): McpError => {
  const rawErrorMessage = extractRawErrorMessage(error);
  const finalErrorMessage = `Google API Error in ${toolName}: ${rawErrorMessage}`;

  console.error(`Google API Error (${toolName}):`, error);
  return new McpError(ErrorCode.InternalError, finalErrorMessage);
};

export const getStartupErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'Unknown error';
};
