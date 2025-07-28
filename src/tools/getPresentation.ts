import { slides_v1 } from 'googleapis';
import { GetPresentationArgs } from '../schemas.js';
import { handleGoogleApiError } from '../utils/errorHandler.js';

/**
 * Gets details about a Google Slides presentation.
 * @param slides The authenticated Google Slides API client.
 * @param args The arguments for getting the presentation.
 * @returns A promise resolving to the MCP response content.
 * @throws McpError if the Google API call fails.
 */
export const getPresentationTool = async (slides: slides_v1.Slides, args: GetPresentationArgs) => {
  try {
    const response = await slides.presentations.get({
      presentationId: args.presentationId,
      fields: args.fields,
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
    };
  } catch (error: unknown) {
    throw handleGoogleApiError(error, 'get_presentation');
  }
};
