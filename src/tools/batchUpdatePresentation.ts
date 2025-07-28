import { slides_v1 } from 'googleapis';
import { BatchUpdatePresentationArgs } from '../schemas.js';
import { handleGoogleApiError } from '../utils/errorHandler.js';

/**
 * Applies a batch of updates to a Google Slides presentation.
 * @param slides The authenticated Google Slides API client.
 * @param args The arguments for the batch update.
 * @returns A promise resolving to the MCP response content.
 * @throws McpError if the Google API call fails.
 */
export const batchUpdatePresentationTool = async (slides: slides_v1.Slides, args: BatchUpdatePresentationArgs) => {
  try {
    const response = await slides.presentations.batchUpdate({
      presentationId: args.presentationId,
      requestBody: {
        requests: args.requests,
        writeControl: args.writeControl,
      },
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
    };
  } catch (error: unknown) {
    throw handleGoogleApiError(error, 'batch_update_presentation');
  }
};
