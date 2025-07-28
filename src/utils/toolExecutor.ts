import { slides_v1 } from 'googleapis';
import { z } from 'zod';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

const extractErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'Unknown error';
};

/**
 * Executes a tool function with centralized argument parsing and error handling.
 *
 * @param slides - The authenticated Google Slides API client.
 * @param toolName - The name of the tool being executed.
 * @param args - The raw arguments received for the tool.
 * @param schema - The Zod schema to validate the arguments.
 * @param toolFn - The actual async function implementing the tool's logic.
 * @returns A promise resolving to the CallToolResponse.
 */
export const executeTool = async <T>(
  slides: slides_v1.Slides,
  toolName: string,
  args: unknown,
  schema: z.ZodSchema<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for compatibility with MCP SDK return types
  toolFn: (slides: slides_v1.Slides, parsedArgs: T) => Promise<any>
) => {
  try {
    if (args === undefined) {
      throw new McpError(ErrorCode.InvalidParams, `Missing arguments for tool "${toolName}".`);
    }

    const parsedArgs = schema.parse(args);
    return await toolFn(slides, parsedArgs);
  } catch (error: unknown) {
    console.error(`Error executing tool "${toolName}":`, error);

    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      const mcpError = new McpError(
        ErrorCode.InvalidParams,
        `Invalid arguments for tool "${toolName}": ${validationErrors}`
      );
      return {
        content: [{ type: 'text', text: mcpError.message }],
        isError: true,
        errorCode: mcpError.code,
      };
    }

    if (error instanceof McpError) {
      return {
        content: [{ type: 'text', text: error.message }],
        isError: true,
        errorCode: error.code,
      };
    }

    const errorMessage = extractErrorMessage(error);
    const mcpError = new McpError(ErrorCode.InternalError, `Failed to execute tool "${toolName}": ${errorMessage}`);
    return {
      content: [{ type: 'text', text: mcpError.message }],
      isError: true,
      errorCode: mcpError.code,
    };
  }
};
