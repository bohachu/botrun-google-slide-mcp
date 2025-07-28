import { slides_v1 } from 'googleapis';
import { GetPageArgs } from '../schemas.js';
import { handleGoogleApiError } from '../utils/errorHandler.js';

/**
 * Gets details about a specific page (slide) in a presentation.
 * @param slides The authenticated Google Slides API client.
 * @param args The arguments for getting the page.
 * @returns A promise resolving to the MCP response content.
 * @throws McpError if the Google API call fails.
 */
export const getPageTool = async (slides: slides_v1.Slides, args: GetPageArgs) => {
  try {
    const response = await slides.presentations.pages.get({
      presentationId: args.presentationId,
      pageObjectId: args.pageObjectId,
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
    };
  } catch (error: unknown) {
    throw handleGoogleApiError(error, 'get_page');
  }
};
