import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { slides_v1 } from 'googleapis';
import {
  CreatePresentationArgsSchema,
  GetPresentationArgsSchema,
  BatchUpdatePresentationArgsSchema,
  GetPageArgsSchema,
  SummarizePresentationArgsSchema,
  movePresentationSchema,
} from './schemas.js';
import { createPresentationTool } from './tools/createPresentation.js';
import { getPresentationTool } from './tools/getPresentation.js';
import { batchUpdatePresentationTool } from './tools/batchUpdatePresentation.js';
import { getPageTool } from './tools/getPage.js';
import { summarizePresentationTool } from './tools/summarizePresentation.js';
import { MovePresentationTool } from './tools/movePresentation.js';
import { executeTool } from './utils/toolExecutor.js';

export const setupToolHandlers = (server: Server, slides: slides_v1.Slides, auth?: any) => {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'create_presentation',
        description: 'Create a new Google Slides presentation',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the presentation.',
            },
          },
          required: ['title'],
        },
      },
      {
        name: 'get_presentation',
        description: 'Get details about a Google Slides presentation',
        inputSchema: {
          type: 'object',
          properties: {
            presentationId: {
              type: 'string',
              description: 'The ID of the presentation to retrieve.',
            },
            fields: {
              type: 'string',
              description:
                'Optional. A mask specifying which fields to include in the response (e.g., "slides,pageSize").',
            },
          },
          required: ['presentationId'],
        },
      },
      {
        name: 'batch_update_presentation',
        description: 'Apply a batch of updates to a Google Slides presentation',
        inputSchema: {
          type: 'object',
          properties: {
            presentationId: {
              type: 'string',
              description: 'The ID of the presentation to update.',
            },
            requests: {
              type: 'array',
              description:
                'A list of update requests to apply. See Google Slides API documentation for request structures.',
              items: { type: 'object' },
            },
            writeControl: {
              type: 'object',
              description: 'Optional. Provides control over how write requests are executed.',
              properties: {
                requiredRevisionId: { type: 'string' },
                targetRevisionId: { type: 'string' },
              },
            },
          },
          required: ['presentationId', 'requests'],
        },
      },
      {
        name: 'get_page',
        description: 'Get details about a specific page (slide) in a presentation',
        inputSchema: {
          type: 'object',
          properties: {
            presentationId: {
              type: 'string',
              description: 'The ID of the presentation.',
            },
            pageObjectId: {
              type: 'string',
              description: 'The object ID of the page (slide) to retrieve.',
            },
          },
          required: ['presentationId', 'pageObjectId'],
        },
      },
      {
        name: 'summarize_presentation',
        description: 'Extract text content from all slides in a presentation for summarization purposes',
        inputSchema: {
          type: 'object',
          properties: {
            presentationId: {
              type: 'string',
              description: 'The ID of the presentation to summarize.',
            },
            include_notes: {
              type: 'boolean',
              description: 'Optional. Whether to include speaker notes in the summary (default: false).',
            },
          },
          required: ['presentationId'],
        },
      },
      {
        name: 'move_presentation',
        description: 'Move or copy a presentation to a specific Google Drive folder',
        inputSchema: {
          type: 'object',
          properties: {
            presentationId: {
              type: 'string',
              description: 'The ID of the presentation to move.',
            },
            folderId: {
              type: 'string',
              description: 'The ID of the target Google Drive folder.',
            },
            copyInstead: {
              type: 'boolean',
              description: 'If true, creates a copy in the target folder instead of moving (default: false).',
            },
            newName: {
              type: 'string',
              description: 'New name for the presentation (only used when copyInstead is true).',
            },
          },
          required: ['presentationId', 'folderId'],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'create_presentation':
        return executeTool(slides, name, args, CreatePresentationArgsSchema, createPresentationTool);
      case 'get_presentation':
        return executeTool(slides, name, args, GetPresentationArgsSchema, getPresentationTool);
      case 'batch_update_presentation':
        return executeTool(slides, name, args, BatchUpdatePresentationArgsSchema, batchUpdatePresentationTool);
      case 'get_page':
        return executeTool(slides, name, args, GetPageArgsSchema, getPageTool);
      case 'summarize_presentation':
        return executeTool(slides, name, args, SummarizePresentationArgsSchema, summarizePresentationTool);
      case 'move_presentation': {
        if (!auth) {
          return {
            content: [{ type: 'text', text: 'Authentication object not available for move operation' }],
            isError: true,
          };
        }
        const moveTool = new MovePresentationTool(slides, auth);
        try {
          const validatedArgs = movePresentationSchema.parse(args);
          const result = await moveTool.execute(validatedArgs);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true,
          };
        }
      }
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool requested: ${name}` }],
          isError: true,
          errorCode: ErrorCode.MethodNotFound,
        };
    }
  });
};
