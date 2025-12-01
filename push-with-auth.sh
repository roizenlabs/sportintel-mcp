#!/bin/bash

echo "=================================================="
echo "🚀 Push SportIntel MCP to GitHub with Authentication"
echo "=================================================="
echo ""

echo "Choose authentication method:"
echo "1) Personal Access Token (recommended)"
echo "2) SSH Key"
echo "3) I'll authenticate manually"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
  1)
    echo ""
    echo "To create a Personal Access Token:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select 'repo' scope"
    echo "4. Click 'Generate token'"
    echo ""
    read -p "Enter your Personal Access Token: " token
    
    if [ -z "$token" ]; then
      echo "❌ No token provided"
      exit 1
    fi
    
    echo ""
    echo "Pushing to GitHub..."
    git push -f https://${token}@github.com/roizenlabs/sportintel-mcp.git main
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ SUCCESS! Repository is live at:"
      echo "https://github.com/roizenlabs/sportintel-mcp"
    else
      echo ""
      echo "❌ Push failed. Check your token and try again."
    fi
    ;;
    
  2)
    echo ""
    echo "Switching to SSH authentication..."
    git remote set-url origin git@github.com:roizenlabs/sportintel-mcp.git
    
    echo ""
    echo "Testing SSH connection..."
    ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"
    
    if [ $? -eq 0 ]; then
      echo "✅ SSH authentication successful"
      echo ""
      echo "Pushing to GitHub..."
      git push -f origin main
      
      if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Repository is live at:"
        echo "https://github.com/roizenlabs/sportintel-mcp"
      fi
    else
      echo "❌ SSH not configured. Please set up SSH keys first:"
      echo "1. ssh-keygen -t ed25519 -C \"your_email@example.com\""
      echo "2. cat ~/.ssh/id_ed25519.pub"
      echo "3. Add to https://github.com/settings/keys"
    fi
    ;;
    
  3)
    echo ""
    echo "Manual push command:"
    echo ""
    echo "  git push -f origin main"
    echo ""
    echo "If authentication fails, see PUSH_INSTRUCTIONS.md for help."
    ;;
    
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac
