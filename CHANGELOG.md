# Changelog

All notable changes to SportIntel MCP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-12-01

### Added
- 🤗 **HuggingFace Integration** - AI-powered injury risk detection using sentiment analysis
- Automatic injury keyword detection (16 keywords: knee, questionable, out, etc.)
- Risk classification system (HIGH: 70%, MEDIUM: 85%, LOW: 95% projection adjustment)
- Evidence-based adjustments with confidence scores
- SHAP explanations now include injury risk factors
- `HuggingFaceService` class for sentiment analysis and text summarization
- Test suite for HuggingFace integration (`test-huggingface.ts`, `test-injury-demo.ts`)

### Changed
- Player projections now automatically adjust based on injury sentiment
- SHAP explanations enhanced with injury risk factors
- `generateExplanation()` method updated to include injury context
- README updated with HuggingFace features section

### Security
- Removed hardcoded API keys from all files
- Added placeholders for API keys in configuration files
- Updated `.env.example` with HuggingFace API key template

### Documentation
- Added `HUGGINGFACE_INTEGRATION_COMPLETE.md` - Complete integration guide
- Added `V1.2_DEPLOYMENT_SUMMARY.md` - Deployment summary
- Added `APIFY_MONETIZATION_GUIDE.md` - Monetization strategy
- Reorganized documentation into `docs/` subdirectories

## [1.1.0] - 2025-11-23

### Added
- Real DFS salary integration from DraftKings and RotoGrinders
- Salary caching system with 1-hour TTL
- Player projection optimization (93% faster)
- Performance improvements with parallel API calls
- Comprehensive test suite

### Changed
- Upgraded BallDontLie API to GOAT tier ($39.99/month, 600 req/min)
- Improved error handling for API failures
- Enhanced SHAP explanations with more detailed factors

### Fixed
- Rate limiting issues with BallDontLie API
- Salary fetch failures gracefully fall back to mock data

## [1.0.0] - 2025-11-21

### Added
- Initial release of SportIntel MCP
- Player projections with SHAP explainability
- Lineup optimizer with multiple strategies (cash, tournament, balanced)
- Live odds comparison from 10+ sportsbooks via The Odds API
- Model Context Protocol (MCP) server implementation
- DFS tools for NBA (NFL, MLB, NHL architecture ready)
- Apify Actor deployment
- Comprehensive documentation and guides

### Features
- **Player Projections**: AI-powered fantasy point projections
  - Floor/ceiling ranges
  - Value analysis (points per $1K salary)
  - Confidence scores
  - Ownership estimates

- **Lineup Optimizer**: Generate optimal DFS lineups
  - Multiple strategies
  - Position constraints
  - Player inclusions/exclusions
  - Stack identification

- **Live Odds**: Real-time betting odds
  - Spreads, totals, moneylines
  - Multi-bookmaker comparison
  - Line movement tracking

- **SHAP Explainability**: Understand AI decisions
  - Feature importance
  - Human-readable reasoning
  - Transparent projections

### Technical
- TypeScript codebase with strict typing
- Zod schema validation
- Comprehensive error handling
- Rate limiting and caching
- Docker containerization for Apify

---

## Roadmap

### v1.3.0 (Planned)
- Real news API integration for injury detection (replace mock data)
- Time series forecasting with HuggingFace transformers
- Natural language game context analysis
- Injury caching system (15-30 min TTL)

### v2.0.0 (Planned)
- NFL player projections
- MLB player projections
- NHL player projections
- Multi-sport lineup optimizer
- Advanced prop bet optimizer
- Real-time webhook notifications
- GraphQL API
- Mobile app integration

---

## Links

- **Repository**: https://github.com/roizenlabs/sportintel-mcp
- **npm Package**: https://www.npmjs.com/package/@roizenlabs/sportintel-mcp
- **Apify Actor**: https://console.apify.com/actors/OdaJN92JUkidz02uv
- **Issues**: https://github.com/roizenlabs/sportintel-mcp/issues

---

**Built with ❤️ by RoizenLabs**
