#!/bin/bash
# SportIntel MCP - Quick Setup Script

set -e

echo "🏈 SportIntel MCP Setup"
echo "======================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. You have: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Set up environment
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys!"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Build project
echo "Building TypeScript..."
npm run build
echo "✅ Build complete"
echo ""

# Summary
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your Odds API key from https://the-odds-api.com"
echo "2. Test the server: npm run dev"
echo "3. Configure Claude Desktop (see docs/quickstart.md)"
echo ""
echo "For Apify deployment:"
echo "1. Install Apify CLI: npm install -g apify-cli"
echo "2. Login: apify login"
echo "3. Push: apify push"
echo ""
echo "Documentation: ./docs/quickstart.md"
echo "API Reference: ./docs/api-reference.md"
echo ""
echo "Happy projecting! 🏀📊"
