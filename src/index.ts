#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { google } from 'googleapis';
import { getStartupErrorMessage } from './utils/errorHandler.js';
import { setupToolHandlers } from './serverHandlers.js';
import * as fs from 'fs';
import * as path from 'path';

const SERVICE_ACCOUNT_KEY_PATH = path.join(process.cwd(), 'keys', 'google_service_account_key.json');

// Check if service account key file exists
if (!fs.existsSync(SERVICE_ACCOUNT_KEY_PATH)) {
  console.error(`Error: Service account key file not found at ${SERVICE_ACCOUNT_KEY_PATH}`);
  console.error('Please ensure the google_service_account_key.json file is placed in the keys directory.');
  process.exit(1);
}

const initializeAndRunServer = async () => {
  try {
    const server = new Server(
      {
        name: 'google-slides-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Google Auth with service account
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_KEY_PATH,
      scopes: [
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/drive'
      ],
    });

    const slides = google.slides({
      version: 'v1',
      auth: auth,
    });

    setupToolHandlers(server, slides, auth);

    server.onerror = (error: Error) => console.error('[MCP Server Error]', error);

    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down server...');
      await server.close();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down server...');
      await server.close();
      process.exit(0);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Google Slides MCP server running and connected via stdio.');
  } catch (error: unknown) {
    const errorMessage = getStartupErrorMessage(error);
    console.error('Failed to start Google Slides MCP server:', errorMessage, error);
    process.exit(1);
  }
};

void initializeAndRunServer();
