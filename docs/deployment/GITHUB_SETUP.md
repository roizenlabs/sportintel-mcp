# 🐙 GitHub Repository Setup Guide

**Repository**: sportintel-mcp
**Organization**: roizenlabs
**Initial Commit**: ✅ Complete (71 files, 17,068 lines)

---

## ✅ What's Already Done

1. **Git initialized** - Repository ready locally
2. **Initial commit created** - All code committed (commit hash: f48ca95)
3. **Package.json updated** - Scoped to @roizenlabs/sportintel-mcp v1.2.0
4. **Git configured** - User: RoizenLabs

---

## 🚀 Option 1: Create via GitHub Website (Easiest)

### Step 1: Create Repository

1. Go to: https://github.com/organizations/roizenlabs/repositories/new
2. Fill in the details:
   ```
   Repository name: sportintel-mcp
   Description: AI-Powered Sports Intelligence MCP Server with HuggingFace Injury Risk Detection

   ✅ Public (recommended for open source)
   ❌ Do NOT initialize with README (we have one already)
   ❌ Do NOT add .gitignore (we have one already)
   ❌ Do NOT add license (we have one already)
   ```
3. Click "Create repository"

### Step 2: Push Code

After creating the repository, run these commands:

```bash
cd /home/roizen/projects/sportintel-mcp

# Add the remote
git remote add origin https://github.com/roizenlabs/sportintel-mcp.git

# Push code
git push -u origin main
```

---

## 🚀 Option 2: Create via GitHub CLI (If you install gh)

### Install GitHub CLI

```bash
# Install gh CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Authenticate
gh auth login
```

### Create and Push

```bash
cd /home/roizen/projects/sportintel-mcp

# Create repo under roizenlabs organization
gh repo create roizenlabs/sportintel-mcp \
  --public \
  --source=. \
  --remote=origin \
  --description="AI-Powered Sports Intelligence MCP Server with HuggingFace Injury Risk Detection" \
  --push
```

---

## 🚀 Option 3: Create via GitHub API (Advanced)

```bash
# You'll need a GitHub Personal Access Token
# Go to: https://github.com/settings/tokens

# Create the repository
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/orgs/roizenlabs/repos \
  -d '{
    "name": "sportintel-mcp",
    "description": "AI-Powered Sports Intelligence MCP Server with HuggingFace Injury Risk Detection",
    "homepage": "https://sportintel.ai",
    "private": false,
    "has_issues": true,
    "has_projects": true,
    "has_wiki": true
  }'

# Then push
git remote add origin https://github.com/roizenlabs/sportintel-mcp.git
git push -u origin main
```

---

## 📋 Repository Settings to Configure

After creating the repository:

### 1. About Section
- Description: "AI-Powered Sports Intelligence MCP Server with HuggingFace Injury Risk Detection"
- Website: https://sportintel.ai
- Topics: `mcp` `sports-analytics` `dfs` `ai` `huggingface` `shap` `typescript` `apify` `nba` `betting`

### 2. Repository Settings
- ✅ Issues enabled
- ✅ Projects enabled
- ✅ Preserve this repository (important!)
- ✅ Discussions enabled (optional)

### 3. GitHub Pages (Optional)
- Source: Deploy from branch `main` `/docs`
- Custom domain: docs.sportintel.ai (if you have it)

### 4. Secrets (for CI/CD)
Add these secrets in Settings → Secrets and variables → Actions:
```
APIFY_TOKEN=<your-apify-token>
BALLDONTLIE_API_KEY=<your-balldontlie-api-key>
ODDS_API_KEY=<your-odds-api-key>
HUGGINGFACE_API_KEY=<your-huggingface-api-key>
```

---

## 📦 NPM Package Publishing

### Option 1: Publish to npm (Public Registry)

```bash
# Login to npm
npm login

# Publish as scoped package
npm publish --access public
```

**Result**: Package available at https://www.npmjs.com/package/@roizenlabs/sportintel-mcp

### Option 2: Use GitHub Packages (Private to organization)

```bash
# Add to package.json:
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/@roizenlabs"
  }
}

# Authenticate with GitHub token
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" > ~/.npmrc

# Publish
npm publish
```

**Result**: Package available at https://github.com/roizenlabs/sportintel-mcp/packages

### Option 3: Don't Publish (Development Only)

If you only want to use this internally:
- Just keep the code on GitHub
- Users can install directly from GitHub:
  ```bash
  npm install github:roizenlabs/sportintel-mcp
  ```

---

## 🏷️ Create Initial Release

After pushing to GitHub:

### Via GitHub Website

1. Go to: https://github.com/roizenlabs/sportintel-mcp/releases/new
2. Fill in:
   ```
   Tag: v1.2.0
   Release title: v1.2.0 - HuggingFace Integration

   Description:
   ## 🎉 SportIntel MCP v1.2.0

   First public release with HuggingFace AI integration!

   ### ✨ Features
   - 🏥 AI Injury Risk Detection using HuggingFace sentiment analysis
   - 📊 SHAP explainability for all projections
   - 🎯 Real-time odds from 10+ sportsbooks
   - 🔧 Lineup optimizer with multiple strategies
   - 🤖 Model Context Protocol (MCP) server

   ### 🚀 What's New in v1.2
   - HuggingFace sentiment analysis integration
   - Automatic injury risk detection and adjustment
   - Evidence-based projections with confidence scores
   - SHAP explanations now include injury factors

   ### 📦 Installation
   ```bash
   npm install @roizenlabs/sportintel-mcp
   ```

   ### 🔗 Links
   - Apify Actor: https://console.apify.com/actors/OdaJN92JUkidz02uv
   - Documentation: https://github.com/roizenlabs/sportintel-mcp#readme
   - Issues: https://github.com/roizenlabs/sportintel-mcp/issues
   ```
3. Click "Publish release"

### Via GitHub CLI

```bash
gh release create v1.2.0 \
  --title "v1.2.0 - HuggingFace Integration" \
  --notes "First public release with AI injury risk detection!"
```

---

## 📄 Repository Files Overview

**Main Files**:
- [README.md](README.md) - Main documentation
- [package.json](package.json) - NPM package config (v1.2.0)
- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [Dockerfile](Dockerfile) - Apify deployment config

**Documentation**:
- [HUGGINGFACE_INTEGRATION_COMPLETE.md](HUGGINGFACE_INTEGRATION_COMPLETE.md) - v1.2 integration guide
- [V1.2_DEPLOYMENT_SUMMARY.md](V1.2_DEPLOYMENT_SUMMARY.md) - Deployment summary
- [APIFY_MONETIZATION_GUIDE.md](APIFY_MONETIZATION_GUIDE.md) - Monetization guide
- [BLOG_POST_READY.md](BLOG_POST_READY.md) - Ready-to-publish blog post
- [DEMO_VIDEO_SCRIPT.md](DEMO_VIDEO_SCRIPT.md) - Video script

**Source Code**:
- [src/services/huggingface-service.ts](src/services/huggingface-service.ts) - HuggingFace integration
- [src/tools/player-projections.ts](src/tools/player-projections.ts) - Main projections tool
- [src/integrations/](src/integrations/) - API integrations
- [src/types/](src/types/) - TypeScript types

**Tests**:
- [test-huggingface.ts](test-huggingface.ts) - HuggingFace tests
- [test-injury-demo.ts](test-injury-demo.ts) - Injury detection demo
- [test-projections.ts](test-projections.ts) - Projection tests

---

## ✅ Verification Checklist

After pushing to GitHub, verify:

- [ ] Repository created under roizenlabs organization
- [ ] All 71 files visible on GitHub
- [ ] README displays correctly
- [ ] Package.json shows version 1.2.0
- [ ] Topics/tags added
- [ ] Repository description set
- [ ] Issues enabled
- [ ] License visible (MIT)
- [ ] .gitignore working (no .env or node_modules)

---

## 🎯 Next Steps After GitHub Setup

1. **Add Repository Badge to README**
   ```markdown
   ![GitHub package.json version](https://img.shields.io/github/package-json/v/roizenlabs/sportintel-mcp)
   ![GitHub](https://img.shields.io/github/license/roizenlabs/sportintel-mcp)
   ![npm](https://img.shields.io/npm/v/@roizenlabs/sportintel-mcp)
   ```

2. **Set up CI/CD** (Optional)
   - Create `.github/workflows/test.yml` for automated testing
   - Create `.github/workflows/deploy.yml` for Apify deployment

3. **Add CONTRIBUTING.md**
   - Guidelines for contributors
   - Code of conduct
   - Development setup instructions

4. **Create Issue Templates**
   - Bug report template
   - Feature request template
   - Question template

5. **Set up GitHub Discussions**
   - Q&A category
   - Show and Tell category
   - Ideas category

---

## 📞 Support

**Repository**: https://github.com/roizenlabs/sportintel-mcp
**Issues**: https://github.com/roizenlabs/sportintel-mcp/issues
**Organization**: https://github.com/roizenlabs

---

**Built with ❤️ by RoizenLabs**
**Powered by**: Claude AI, TypeScript, Apify, HuggingFace
