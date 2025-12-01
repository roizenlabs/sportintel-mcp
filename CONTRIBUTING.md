# Contributing to SportIntel MCP

Thank you for your interest in contributing to SportIntel MCP! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Open an issue!
- ✨ **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 💻 **Code**: Submit a pull request
- 🧪 **Testing**: Help test new features
- 💬 **Discussions**: Share your use cases and ideas

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git
- API Keys (for testing):
  - BallDontLie API key (https://www.balldontlie.io/)
  - HuggingFace API key (https://huggingface.co/settings/tokens)
  - The Odds API key (optional, https://the-odds-api.com/)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/roizenlabs/sportintel-mcp.git
cd sportintel-mcp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env
# BALLDONTLIE_API_KEY=your_key_here
# HUGGINGFACE_API_KEY=your_key_here
# ODDS_API_KEY=your_key_here

# Build the project
npm run build

# Run tests
npm test
```

### Project Structure

```
sportintel-mcp/
├── src/
│   ├── tools/              # MCP tools (projections, optimizer, odds)
│   ├── services/           # Services (HuggingFace, salary, etc.)
│   ├── integrations/       # External API integrations
│   ├── types/              # TypeScript type definitions
│   └── main.ts             # Entry point
├── tests/                  # Test files
├── docs/                   # Documentation
│   ├── deployment/         # Deployment guides
│   ├── marketing/          # Marketing materials
│   └── development/        # Development docs
├── .actor/                 # Apify Actor configuration
└── apify/                  # Apify-specific files
```

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clear, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test file
npx tsx test-your-feature.ts

# Check TypeScript compilation
npm run build

# Run linter
npm run lint
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add injury caching system"
# or
git commit -m "fix: resolve API rate limiting issue"
# or
git commit -m "docs: update HuggingFace integration guide"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what was changed and why
- Reference to any related issues
- Screenshots/examples if applicable

## 🧪 Testing Guidelines

### Writing Tests

- Place test files in the root with `test-*.ts` naming
- Use descriptive test names
- Test both success and error cases
- Mock external API calls when appropriate

### Example Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { YourFeature } from './src/features/your-feature.js';

describe('YourFeature', () => {
  it('should return expected result', async () => {
    const feature = new YourFeature();
    const result = await feature.doSomething();
    expect(result).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    const feature = new YourFeature();
    await expect(feature.doInvalidThing()).rejects.toThrow();
  });
});
```

## 📝 Code Style

### TypeScript

- Use TypeScript strict mode
- Define interfaces for all data structures
- Use Zod for runtime validation
- Prefer `async/await` over promises
- Use descriptive variable names

### Example

```typescript
// Good
interface PlayerProjection {
  playerId: string;
  playerName: string;
  projectedPoints: number;
  confidence: number;
}

async function getProjections(sport: string): Promise<PlayerProjection[]> {
  const players = await fetchPlayers(sport);
  return players.map(transformToProjection);
}

// Not ideal
function getProj(s: string): Promise<any> {
  return fetch(s).then(d => d);
}
```

### Documentation

- Add JSDoc comments for public APIs
- Include examples in documentation
- Keep README up to date
- Document breaking changes

## 🐛 Reporting Bugs

### Before Submitting

- Check existing issues to avoid duplicates
- Test with latest version
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Run command '...'
2. See error

**Expected behavior**
What you expected to happen

**Actual behavior**
What actually happened

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Node version: [e.g., 18.17.0]
- Package version: [e.g., 1.2.0]

**Additional context**
Any other relevant information
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other approaches you've thought about

**Additional context**
Any other relevant information
```

## 🔒 Security

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email security concerns to: security@roizenlabs.com
3. Include detailed information about the vulnerability
4. Allow reasonable time for a fix before public disclosure

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability
- Ethnicity, gender identity and expression
- Level of experience
- Nationality, personal appearance
- Race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior:**
- Being respectful and inclusive
- Welcoming different viewpoints
- Accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behavior:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Violations can be reported to: conduct@roizenlabs.com

Project maintainers will review and investigate complaints and take appropriate action.

## 🎁 Recognition

Contributors will be:
- Listed in our CONTRIBUTORS.md file
- Credited in release notes
- Thanked in our README

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

- **GitHub Discussions**: https://github.com/roizenlabs/sportintel-mcp/discussions
- **Issues**: https://github.com/roizenlabs/sportintel-mcp/issues
- **Email**: dev@roizenlabs.com

## 🙏 Thank You!

Your contributions make this project better for everyone. Thank you for being part of our community!

---

**Built with ❤️ by RoizenLabs**
