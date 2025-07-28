import { slides_v1 } from 'googleapis';
import { SummarizePresentationArgs } from '../schemas.js';
import { handleGoogleApiError } from '../utils/errorHandler.js';

const extractText = (elements: slides_v1.Schema$PageElement[] | undefined): string[] => {
  if (!elements) return [];
  return elements.flatMap((element) => {
    if (element.shape?.text?.textElements) {
      return element.shape.text.textElements.map((te) => te.textRun?.content?.trim() || '').filter(Boolean);
    }
    if (element.table?.tableRows) {
      return element.table.tableRows.flatMap(
        (row) =>
          row.tableCells?.flatMap(
            (cell) => cell.text?.textElements?.map((te) => te.textRun?.content?.trim() || '').filter(Boolean) || []
          ) || []
      );
    }
    return [];
  });
};

/**
 * Extracts text content from all slides in a presentation for summarization.
 * @param slides The authenticated Google Slides API client.
 * @param args The arguments for summarizing the presentation.
 * @returns A promise resolving to the MCP response content.
 * @throws McpError if the Google API call fails.
 */
export const summarizePresentationTool = async (slides: slides_v1.Slides, args: SummarizePresentationArgs) => {
  const includeNotes = args.include_notes === true;

  try {
    const presentationResponse = await slides.presentations.get({
      presentationId: args.presentationId,
      fields:
        'presentationId,title,revisionId,slides(objectId,pageElements(shape(text(textElements(textRun(content)))),table(tableRows(tableCells(text(textElements(textRun(content))))))),slideProperties(notesPage(pageElements(shape(text(textElements(textRun(content))))))))',
    });

    const presentation = presentationResponse.data;
    if (!presentation.slides || presentation.slides.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                title: presentation.title || 'Untitled Presentation',
                slideCount: 0,
                summary: 'This presentation contains no slides.',
              },
              null,
              2
            ),
          },
        ],
      };
    }

    const slidesContent = presentation.slides.map((slide, index) => {
      const slideNumber = index + 1;

      const slideTextContent = extractText(slide.pageElements).join(' ');

      const notesContent = includeNotes
        ? extractText(slide.slideProperties?.notesPage?.pageElements).join(' ').trim()
        : '';

      return {
        slideNumber,
        slideId: slide.objectId || `slide_${slideNumber}`,
        content: slideTextContent,
        ...(includeNotes && notesContent ? { notes: notesContent } : {}),
      };
    });

    const summary = {
      title: presentation.title || 'Untitled Presentation',
      slideCount: slidesContent.length,
      lastModified: presentation.revisionId ? `Revision ${presentation.revisionId}` : 'Unknown',
      slides: slidesContent,
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  } catch (error: unknown) {
    throw handleGoogleApiError(error, 'summarize_presentation');
  }
};
