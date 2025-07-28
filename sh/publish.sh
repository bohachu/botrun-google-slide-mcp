#!/bin/bash

# publish.sh - Script to publish Google Slides MCP to npm
# Author: Bowen Chiu

set -e  # Exit on error

echo "🚀 Starting npm publish process for @bohachu/google-slides-mcp"
echo ""

# Check if user is logged in to npm
echo "📋 Checking npm login status..."
npm whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "❌ You are not logged in to npm"
    echo "📝 Please run 'npm login' first"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "📂 Please run this script from the project root directory"
    exit 1
fi

# Check if keys directory exists
if [ ! -d "keys" ]; then
    echo "⚠️  Warning: keys directory not found"
    echo "📁 Creating keys directory..."
    mkdir -p keys
fi

# Check if .gitignore and .npmignore exist
if [ ! -f ".gitignore" ]; then
    echo "❌ Error: .gitignore not found"
    exit 1
fi

if [ ! -f ".npmignore" ]; then
    echo "❌ Error: .npmignore not found"
    exit 1
fi

# Clean any existing build
echo "🧹 Cleaning old build..."
rm -rf build/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ] || [ ! -f "build/index.js" ]; then
    echo "❌ Build failed: build/index.js not found"
    exit 1
fi

# Run tests if they exist
if npm run test &> /dev/null; then
    echo "🧪 Running tests..."
    npm test
else
    echo "⏭️  No tests found, skipping..."
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "📌 Current version: $CURRENT_VERSION"

# Ask if user wants to bump version
echo ""
echo "🔢 Version bump options:"
echo "   1) Patch (x.x.X) - Bug fixes"
echo "   2) Minor (x.X.x) - New features"
echo "   3) Major (X.x.x) - Breaking changes"
echo "   4) Skip - Keep current version"
echo ""
read -p "Select option (1-4): " VERSION_CHOICE

case $VERSION_CHOICE in
    1)
        echo "📈 Bumping patch version..."
        npm version patch
        ;;
    2)
        echo "📈 Bumping minor version..."
        npm version minor
        ;;
    3)
        echo "📈 Bumping major version..."
        npm version major
        ;;
    4)
        echo "⏭️  Keeping current version..."
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

# Get new version if bumped
NEW_VERSION=$(node -p "require('./package.json').version")
if [ "$CURRENT_VERSION" != "$NEW_VERSION" ]; then
    echo "✅ Version bumped to: $NEW_VERSION"
fi

# Dry run first
echo ""
echo "🧪 Running dry-run to check package contents..."
npm pack --dry-run

echo ""
read -p "📦 Package looks good? Proceed with publish? (y/N): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ Publish cancelled"
    exit 0
fi

# Publish to npm
echo ""
echo "🚀 Publishing to npm..."
npm publish --access public

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully published @bohachu/google-slides-mcp@$NEW_VERSION to npm!"
    echo ""
    echo "📋 Users can now install with:"
    echo "   npx -y @bohachu/google-slides-mcp"
    echo ""
    echo "🔗 View on npm: https://www.npmjs.com/package/@bohachu/google-slides-mcp"
    
    # Push version tag to git if version was bumped
    if [ "$CURRENT_VERSION" != "$NEW_VERSION" ]; then
        echo ""
        echo "📤 Pushing version tag to GitHub..."
        git push
        git push --tags
    fi
else
    echo ""
    echo "❌ Publish failed!"
    exit 1
fi

echo ""
echo "🎉 All done!"