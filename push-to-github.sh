#!/bin/bash

echo "=================================================="
echo "🚀 Pushing SportIntel MCP to GitHub"
echo "=================================================="
echo ""

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote 'origin' already configured"
else
    echo "Adding remote 'origin'..."
    git remote add origin https://github.com/roizenlabs/sportintel-mcp.git
    echo "✅ Remote added"
fi

echo ""
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "✅ SUCCESS! Repository is live at:"
    echo "https://github.com/roizenlabs/sportintel-mcp"
    echo "=================================================="
    echo ""
    echo "Next steps:"
    echo "1. Add repository topics: mcp, sports-analytics, ai, huggingface"
    echo "2. Create v1.2.0 release"
    echo "3. Publish to npm: npm publish --access public"
else
    echo ""
    echo "=================================================="
    echo "❌ Push failed!"
    echo "=================================================="
    echo ""
    echo "Make sure you've created the repository on GitHub first:"
    echo "https://github.com/organizations/roizenlabs/repositories/new"
fi
