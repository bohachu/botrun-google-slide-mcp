# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-28

### Added
- First stable release of Google Slides MCP Server
- Complete Google Slides API integration with all core operations
- Service account authentication (replacing OAuth 2.0)
- New `move_presentation` tool for Google Drive folder management
- Support for npx installation (`npx -y @bohachu/google-slides-mcp`)
- Comprehensive MCP configuration guides for:
  - Claude Desktop
  - Claude Code
  - Cursor IDE
  - Gemini CLI
- npm publish script for easy deployment
- Security measures with .gitignore and .npmignore

### Changed
- Authentication method from OAuth 2.0 with refresh tokens to Service Account
- Repository name preparation from `botrun-google-slide-mcp` to `botrun-google-slides-mcp`

### Based On
- Original work by Matteo Antoci: [google-slides-mcp](https://github.com/matteoantoci/google-slides-mcp)
- Licensed under GPL-3.0

### Contributors
- Original work: Matteo Antoci
- Modifications: Bowen Chiu