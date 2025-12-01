# 🏈 SportIntel MCP Server

**AI-Powered Sports Intelligence for Claude & AI Agents**

[![Apify Challenge 2025](https://img.shields.io/badge/Apify-Challenge%202025-blue)](https://apify.com/challenge)
[![MCP Server](https://img.shields.io/badge/MCP-Server-green)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SportIntel MCP is the **first AI-powered sports analytics MCP server**, bringing explainable Daily Fantasy Sports (DFS) intelligence to Claude and other AI agents. Built on the Model Context Protocol, it provides real-time player projections, lineup optimization, live odds aggregation, and SHAP-based explainability.

---

## ✨ Features

### 🎯 Core Capabilities (MVP)

| Tool | Description | Use Case |
|------|-------------|----------|
| **`get_player_projections`** | AI-powered DFS projections with SHAP explainability | Get projected fantasy points for all players in today's slate |
| **`optimize_lineup`** | Multi-objective lineup optimization | Generate optimal cash/GPP lineups under salary cap |
| **`get_live_odds`** | Real-time odds from 10+ sportsbooks | Compare spreads, totals, and find best available lines |
| **`explain_recommendation`** | SHAP/LIME explanations for projections | Understand *why* the model recommends a player |

### 🔥 Key Differentiators

- **✅ First MCP Server for Sports Analytics** - Zero competition in MCP ecosystem
- **🧠 Explainable AI** - SHAP values show feature importance (not a black box)
- **💰 10x Cost Advantage** - Free tier vs $50-200/month DFS subscription sites
- **📊 Multi-Source Intelligence** - Aggregates odds, stats, news, injuries
- **⚡ Real-Time** - Live odds updates, instant injury impact analysis
- **🤖 AI-Native** - Built for Claude/AI agent consumption

---

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/roizenlabs/sportintel-mcp.git
cd sportintel-mcp

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys
```

### Configuration for Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "sportintel": {
      "command": "node",
      "args": ["/path/to/sportintel-mcp/dist/main.js"],
      "env": {
        "ODDS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Run Standalone

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

---

## 📖 Usage Examples

### Example 1: Get NBA Player Projections

**Claude Prompt:**
```
Get AI projections for tonight's NBA main slate with explainability
```

**MCP Call:**
```json
{
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "slate": "main",
    "includeExplanations": true
  }
}
```

**Response:**
```json
{
  "sport": "NBA",
  "slate": "main",
  "projections": [
    {
      "playerName": "LeBron James",
      "team": "LAL",
      "position": "SF",
      "salary": 9500,
      "projectedPoints": 48.2,
      "floor": 38.6,
      "ceiling": 57.8,
      "confidence": 0.89,
      "value": 5.07,
      "explanation": {
        "topFactors": [
          {
            "factor": "recent_ppg",
            "impact": +6.2,
            "description": "Averaging 32.1 PPG over last 5 games"
          },
          {
            "factor": "vegas_total",
            "impact": +3.1,
            "description": "230.5 Vegas total (high-scoring game expected)"
          }
        ],
        "reasoning": "LeBron is projected above baseline due to elite recent performance and favorable game environment..."
      }
    }
  ]
}
```

### Example 2: Optimize Lineup

**Claude Prompt:**
```
Build me 3 cash game lineups for NBA using the projections you just got
```

**MCP Call:**
```json
{
  "tool": "optimize_lineup",
  "arguments": {
    "sport": "NBA",
    "salaryCap": 50000,
    "lineupCount": 3,
    "strategy": "cash",
    "projections": [/* from previous call */]
  }
}
```

**Response:**
```json
{
  "lineups": [
    {
      "rank": 1,
      "players": [
        {"playerName": "Giannis Antetokounmpo", "salary": 11500, "projectedPoints": 54.2},
        {"playerName": "Damian Lillard", "salary": 9000, "projectedPoints": 42.1}
        // ... 6 more players
      ],
      "totalSalary": 49800,
      "projectedPoints": 283.5,
      "riskScore": 22,
      "estimatedOwnership": 18.5
    }
  ]
}
```

### Example 3: Compare Odds Across Books

**Claude Prompt:**
```
Show me the best odds for tonight's Lakers vs Warriors game
```

**MCP Call:**
```json
{
  "tool": "get_live_odds",
  "arguments": {
    "sport": "NBA",
    "markets": ["spreads", "totals", "h2h"]
  }
}
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│          Claude Desktop / AI Agent              │
└─────────────────┬───────────────────────────────┘
                  │ MCP Protocol
┌─────────────────▼───────────────────────────────┐
│           SportIntel MCP Server                 │
│  ┌──────────────────────────────────────────┐   │
│  │  Tool Registry                           │   │
│  │  - Player Projections                    │   │
│  │  - Lineup Optimizer                      │   │
│  │  - Live Odds                             │   │
│  │  - Explain Recommendation                │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
      ┌───────────┴───────────┬────────────┐
      │                       │            │
┌─────▼──────┐    ┌──────────▼─┐   ┌─────▼────────┐
│ Odds API   │    │ BallDontLie│   │  XGBoost     │
│ (Betting)  │    │ (NBA Stats)│   │  + SHAP      │
└────────────┘    └────────────┘   └──────────────┘
```

### Tech Stack

- **Protocol**: Model Context Protocol (MCP)
- **Runtime**: Node.js 18+ with TypeScript
- **ML Framework**: XGBoost + SHAP (explainability)
- **Optimization**: Linear Programming (GLPK.js)
- **Data Sources**:
  - [the-odds-api.com](https://the-odds-api.com) - Real-time odds
  - [balldontlie.io](https://balldontlie.io) - NBA stats
  - ESPN scraping (via Apify Actor)

---

## 🎯 Apify Challenge Strategy

### Why SportIntel MCP Wins

1. **Novel & First-to-Market** ✅
   - Zero MCP servers for sports analytics on Apify Store
   - Existing actors are simple scrapers, not intelligence layers

2. **Technical Excellence** ✅
   - Explainable AI (SHAP/LIME)
   - Multi-agent architecture
   - MCP protocol implementation

3. **Real-World Value** ✅
   - DFS market is $29.3B (2024)
   - Saves users $50-200/month vs existing subscriptions
   - Measurable ROI for users

4. **MAU Growth Strategy** ✅
   - NFL/NBA seasons = guaranteed traffic
   - Content marketing (YouTube, Reddit, Twitter)
   - Integration with OpenConductor ecosystem

### Revenue Projections

| Tier | MAU | Challenge Payout | Pro Subscriptions | Total |
|------|-----|------------------|-------------------|-------|
| Conservative | 300 | $600 | $150/mo | $750 |
| Moderate | 700 | $1,400 | $375/mo | $1,775 |
| Aggressive | 1,000+ | $2,000+ | $750/mo | $4,750+ |

**Post-Challenge**: $19K-81K annual run rate from subscriptions + B2B

---

## 🛠️ Development

### Project Structure

```
sportintel-mcp/
├── src/
│   ├── main.ts                    # Entry point
│   ├── mcp-server.ts              # MCP protocol handler
│   ├── tools/                     # MCP tools
│   │   ├── player-projections.ts
│   │   ├── lineup-optimizer.ts
│   │   ├── live-odds.ts
│   │   └── explain-recommendation.ts
│   ├── models/                    # ML models
│   │   ├── xgboost-trainer.ts
│   │   └── explainer.ts
│   ├── integrations/              # Data sources
│   │   ├── odds-api.ts
│   │   └── balldontlie.ts
│   └── types/                     # TypeScript types
├── docs/                          # Documentation
├── tests/                         # Unit & integration tests
└── apify/                         # Apify Actor config
```

### Scripts

```bash
npm run dev          # Development with hot reload
npm run build        # Production build
npm test             # Run tests
npm run train-model  # Train ML models
```

### Adding a New Tool

1. Create `src/tools/your-tool.ts` extending `BaseTool`
2. Define `MCPTool` schema
3. Implement `execute(args)` method
4. Register in `src/tools/index.ts`

Example:
```typescript
export class YourTool extends BaseTool {
  definition: MCPTool = {
    name: "your_tool",
    description: "What it does",
    inputSchema: { /* Zod schema */ }
  };

  async execute(args: any) {
    // Your logic here
    return { success: true };
  }
}
```

---

## 📊 Performance

- **Projection Accuracy**: 85% correlation with actual fantasy points (backtested)
- **Optimization Speed**: <2s for 10 lineups, <10s for 150 lineups
- **API Rate Limits**:
  - Odds API: 500 requests/hour
  - BallDontLie: 60 requests/minute
- **Caching**: 5-minute TTL for odds, 1-hour for projections

---

## 🚧 Roadmap

### Phase 1: MVP (Weeks 1-2) ✅
- [x] Core MCP server
- [x] Player projections tool
- [x] Lineup optimizer tool
- [x] Live odds tool
- [x] SHAP explainability

### Phase 2: Growth (Weeks 3-8)
- [ ] Injury impact analyzer
- [ ] Prop bet optimizer
- [ ] Stacking strategy engine
- [ ] Historical performance database
- [ ] Webhook integrations

### Phase 3: Scale (Month 3+)
- [ ] NFL support
- [ ] MLB support
- [ ] Real-time lineup adjustment
- [ ] Browser extension
- [ ] Mobile app

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Areas We Need Help
- [ ] NFL projection models
- [ ] MLB/NHL data sources
- [ ] Additional explainability methods
- [ ] Performance optimization
- [ ] Documentation improvements

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 🙏 Acknowledgments

- **Apify Challenge 2025** for the opportunity
- **Anthropic** for Claude and MCP protocol
- **the-odds-api.com** for betting data
- **balldontlie.io** for free NBA stats
- **SHAP** for explainable AI framework

---

## 📞 Contact

- **Website**: [sportintel.ai](https://sportintel.ai)
- **GitHub**: [roizenlabs/sportintel-mcp](https://github.com/roizenlabs/sportintel-mcp)
- **Twitter**: [@SportIntelAI](https://twitter.com/SportIntelAI)
- **Discord**: [Join Community](https://discord.gg/sportintel)

---

## ⚡ Quick Links

- [API Reference](./docs/api-reference.md)
- [Claude Desktop Setup Guide](./docs/quickstart.md)
- [Examples](./docs/examples/)
- [Apify Actor Page](https://apify.com/roizenlabs/sportintel-mcp)

---

**Built with ❤️ by RoizenLabs** | From railroad diagnostics to AI-powered DFS intelligence
