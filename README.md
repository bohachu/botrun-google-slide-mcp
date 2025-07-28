# Google Slides MCP Server

## Description

This project provides a Model Context Protocol (MCP) server for interacting with the Google Slides API. It allows you to create, read, modify, and manage Google Slides presentations programmatically through a secure service account authentication method.

## Quick Start for Gemini CLI (Primary Method)

### 1. Install and Configure Gemini CLI with MCP

Set up your Gemini API key:
```bash
export GOOGLE_API_KEY="YOUR_API_KEY"
```

Edit `~/.gemini/settings.json` to add the Google Slides MCP server:
```json
{
  "mcpServers": {
    "google-slides-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@bohachu/google-slides-mcp"
      ]
    }
  }
}
```

### 2. Set up Google Service Account Authentication

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Slides API:
   - Navigate to "APIs & Services" > "Enabled APIs & services"
   - Click "+ ENABLE APIS AND SERVICES"
   - Search for "Google Slides API" and enable it
4. Create Service Account credentials:
   - Navigate to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" > "Service account"
   - Fill in the service account details
   - Click "Create" and "Done"
5. Download the service account key:
   - Click on your newly created service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" as the key type
   - Click "Create" to download the JSON file
6. **Important:** Rename the downloaded file to `google_service_account_key.json` and place it in a `keys` directory in your current working directory

### 3. Use with Gemini CLI

Once configured, you can use the Google Slides tools directly in Gemini CLI. The MCP server will be automatically loaded when you start Gemini.

## Other Installation Methods

### Quick Start with npx (Standalone)

You can run this MCP server directly using npx:

```bash
npx -y @bohachu/google-slides-mcp
```

### Install as npm package

```bash
npm install -g @bohachu/google-slides-mcp
```

After global installation, you can run:
```bash
google-slides-mcp
```

### Build from Source

If you want to build from source or contribute to the project:

```bash
# Clone the repository
git clone https://github.com/bohachu/botrun-google-slides-mcp.git
cd botrun-google-slides-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js)
*   Google Cloud Project with the Google Slides API enabled.
*   Service Account credentials for your Google Cloud Project.

## Setup

1.  **Clone the repository (if applicable) or ensure you are in the project directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the Server:**
    Compile the TypeScript code to JavaScript:
    ```bash
    npm run build
    ```
    This will create a `build` directory containing the compiled JavaScript code.

4.  **Set up Authentication:**
    
    This project uses Google Service Account authentication for better security and easier deployment.
    
    **Obtain Google Service Account Credentials:**
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project or select an existing one.
    *   Navigate to "APIs & Services" > "Enabled APIs & services".
    *   Click "+ ENABLE APIS AND SERVICES", search for "Google Slides API", and enable it.
    *   Navigate to "APIs & Services" > "Credentials".
    *   Click "+ CREATE CREDENTIALS" > "Service account".
    *   Fill in the service account details:
        *   Service account name (e.g., "slides-mcp-service")
        *   Service account ID (will be auto-generated)
        *   Service account description (optional)
    *   Click "Create".
    *   Skip the optional steps for granting roles and user access.
    *   Click "Done".
    *   Find your newly created service account in the list and click on it.
    *   Go to the "Keys" tab.
    *   Click "Add Key" > "Create new key".
    *   Choose "JSON" as the key type.
    *   Click "Create". A JSON file will be downloaded to your computer.
    *   **Important:** Rename this file to `google_service_account_key.json` and place it in the `keys` directory of this project.

5.  **Grant Permissions (if needed):**
    *   If you need to access specific Google Slides presentations that are not owned by the service account:
        *   Share the presentations with the service account email (found in the JSON key file as `client_email`)
        *   Grant at least "Editor" permissions for full functionality

## Acknowledgments

This project is based on the original work by Matteo Antoci: [google-slides-mcp](https://github.com/matteoantoci/google-slides-mcp). The original project is licensed under GPL-3.0, and this modified version maintains the same license. We are grateful to Matteo Antoci and all contributors to the original project for creating this foundation.

### Major Changes from Original:
- **Authentication Method**: Changed from OAuth 2.0 with refresh tokens to Service Account authentication for improved security and easier deployment
- **New Features**: Added `move_presentation` tool for moving/copying presentations to Google Drive folders
- **Enhanced Security**: Using service account key file stored locally instead of environment variables for credentials
- **Drive API Integration**: Added Google Drive API scopes to support file management operations

## MCP Configuration for Other Tools

This MCP server can also be used with other AI tools that support the Model Context Protocol:

### Claude Desktop

**Configuration file location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration using npx (Recommended):**
```json
{
  "mcpServers": {
    "google-slides-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@bohachu/google-slides-mcp"
      ]
    }
  }
}
```

**Configuration for local installation:**
```json
{
  "mcpServers": {
    "google-slides-mcp": {
      "command": "node",
      "args": [
        "/path/to/google-slides-mcp/build/index.js"
      ]
    }
  }
}
```

After editing the configuration:
1. Completely quit Claude Desktop
2. Restart Claude Desktop
3. Look for the MCP indicator (🔌) in the bottom-right corner of the chat input

### Claude Code

**Method 1: Using CLI with npx (Recommended)**
```bash
# Add the server using npx
claude mcp add google-slides npx -y @bohachu/google-slides-mcp

# For project-specific configuration
claude mcp add google-slides -s project npx -y @bohachu/google-slides-mcp
```

**Method 2: Using CLI with local installation**
```bash
# Add the server
claude mcp add google-slides /path/to/google-slides-mcp/build/index.js

# For project-specific configuration
claude mcp add google-slides -s project /path/to/google-slides-mcp/build/index.js
```

**Method 3: Direct configuration file**
- **User config**: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
- **Project config**: `{project}/.mcp.json`

Configuration format with npx:
```json
{
  "mcpServers": {
    "google-slides-mcp": {
      "command": "npx",
      "args": ["-y", "@bohachu/google-slides-mcp"]
    }
  }
}
```

### Cursor IDE

**Configuration file location:**
- **Project-specific**: `{project}/.cursor/mcp.json`

**Setup steps:**
1. Open Settings (`Ctrl+Shift+J` or `Cmd+Shift+J`)
2. Navigate to Features → Model Context Protocol
3. Click "Add" to add a new server
4. Create or edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "google-slides-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@bohachu/google-slides-mcp"
      ]
    }
  }
}
```

5. Refresh and ensure the server indicator turns green

### Important Notes for All Tools:
- When using npx, the server will automatically be downloaded and run - no local installation needed
- For local installations, replace `/path/to/google-slides-mcp/build/index.js` with the absolute path to your compiled server file
- The service account key must be present at `keys/google_service_account_key.json` relative to the current working directory
- No environment variables are needed as the server loads credentials from the key file
- After configuration changes, restart the respective tool for changes to take effect
- For Windows users, use forward slashes in paths or escape backslashes (e.g., `C:/path/to/file` or `C:\\path\\to\\file`)

### Troubleshooting MCP Connection:
- **Claude Desktop/Code**: Check logs at `~/Library/Logs/Claude/mcp*.log` (macOS) or `%APPDATA%\Claude\logs\mcp*.log` (Windows)
- **Cursor**: Open Output panel (`Ctrl+Shift+U`) and select "MCP Logs" from dropdown
- **Gemini CLI**: Run with `--debug` flag for detailed logging
- Ensure Node.js is installed and accessible from command line (`node --version`)
- Verify the build directory exists and contains `index.js` after running `npm run build`

## Running the Server

Execute the compiled code:

```bash
npm run start
```

The server will start and listen for MCP requests on standard input/output (stdio). You should see a message like: `Google Slides MCP server running and connected via stdio.`

## Available Tools

The server exposes the following tools via the Model Context Protocol:

*   **`create_presentation`**: Creates a new Google Slides presentation.
    *   **Input:**
        *   `title` (string, required): The title for the new presentation.
    *   **Output:** JSON object representing the created presentation details.

*   **`get_presentation`**: Retrieves details about an existing presentation.
    *   **Input:**
        *   `presentationId` (string, required): The ID of the presentation to retrieve.
        *   `fields` (string, optional): A field mask (e.g., "slides,pageSize") to limit the returned data.
    *   **Output:** JSON object representing the presentation details.

*   **`batch_update_presentation`**: Applies a series of updates to a presentation. This is the primary method for modifying slides (adding text, shapes, images, creating slides, etc.).
    *   **Input:**
        *   `presentationId` (string, required): The ID of the presentation to update.
        *   `requests` (array, required): An array of request objects defining the updates. Refer to the [Google Slides API `batchUpdate` documentation](https://developers.google.com/slides/api/reference/rest/v1/presentations/batchUpdate#requestbody) for the structure of individual requests.
        *   `writeControl` (object, optional): Controls write request execution (e.g., using revision IDs).
    *   **Output:** JSON object representing the result of the batch update.

*   **`get_page`**: Retrieves details about a specific page (slide) within a presentation.
    *   **Input:**
        *   `presentationId` (string, required): The ID of the presentation containing the page.
        *   `pageObjectId` (string, required): The object ID of the page (slide) to retrieve.
    *   **Output:** JSON object representing the page details.

*   **`summarize_presentation`**: Extracts and formats all text content from a presentation for easier summarization.
    *   **Input:**
        *   `presentationId` (string, required): The ID of the presentation to summarize.
        *   `include_notes` (boolean, optional): Whether to include speaker notes in the summary. Defaults to false.
    *   **Output:** JSON object containing:
        *   `title`: The presentation's title
        *   `slideCount`: Total number of slides
        *   `lastModified`: Revision information
        *   `slides`: Array of slide objects containing:
            *   `slideNumber`: Position in presentation
            *   `slideId`: Object ID of the slide
            *   `content`: All text extracted from the slide
            *   `notes`: Speaker notes (if requested and available)

*   **`move_presentation`**: Move or copy a presentation to a specific Google Drive folder.
    *   **Input:**
        *   `presentationId` (string, required): The ID of the presentation to move.
        *   `folderId` (string, required): The ID of the target Google Drive folder.
        *   `copyInstead` (boolean, optional): If true, creates a copy in the target folder instead of moving. Defaults to false.
        *   `newName` (string, optional): New name for the presentation (only used when copyInstead is true).
    *   **Output:** JSON object containing:
        *   `success`: Boolean indicating if the operation was successful
        *   `message`: Description of what happened
        *   `presentationUrl`: URL to access the presentation
    *   **Notes:** 
        *   The service account must have appropriate permissions to move files.
        *   If direct moving fails, the tool will try to add the presentation to the folder without removing it from the original location.
        *   As a last resort, it will share the presentation with the folder owner for manual moving.
        *   To extract folder ID from a Google Drive URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`

*(More tools can be added by extending `src/index.ts`)*

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Original work Copyright (C) 2025 Matteo Antoci  
Modifications Copyright (C) 2025 Bowen Chiu

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security Notes

- Never commit your `google_service_account_key.json` file to version control
- The `keys/` directory should be added to `.gitignore`
- Service account keys should be kept secure and rotated regularly
- Only grant necessary permissions to the service account
