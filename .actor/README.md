# SportIntel MCP - AI-Powered Sports Analytics

The first AI-powered sports analytics MCP (Model Context Protocol) server for Daily Fantasy Sports (DFS). Get explainable player projections with **AI injury risk detection**, lineup optimization, and real-time odds with SHAP AI explanations.

## 🏀 Features

### 1. **Player Projections** (`get_player_projections`)

Get AI-powered DFS player projections with:

- **🏥 AI Injury Risk Detection** - HuggingFace sentiment analysis automatically adjusts projections based on injury news
- Real DraftKings/FanDuel salaries (200+ players per slate)
- Projected fantasy points with floor/ceiling ranges
- Value analysis (points per $1K salary)
- SHAP explainability - understand WHY the AI recommends each player (including injury factors)
- Ownership estimates
- Confidence scores

### 2. **Lineup Optimizer** (`optimize_lineup`)
Generate optimal DFS lineups with:
- Multiple strategies (cash game, tournament, balanced)
- Position constraints (PG, SG, SF, PF, C, G, F, UTIL)
- Player exclusions/inclusions
- Max players per team
- Stack identification
- Risk scoring

### 3. **Live Odds** (`get_live_odds`)
Real-time betting odds from 10+ sportsbooks:
- Spreads, totals, moneylines, player props
- Best odds finder
- Line movement tracking
- Multi-bookmaker comparison

### 4. **Explain Recommendation** (`explain_recommendation`)

SHAP-powered AI explainability:

- Feature importance rankings
- Human-readable reasoning
- Understand projection factors

## 🤗 AI Injury Risk Detection (NEW!)

### Powered by HuggingFace Sentiment Analysis

SportIntel MCP now automatically analyzes injury-related news and adjusts projections based on sentiment:

- **Automatic Detection**: Scans for injury keywords (knee, questionable, out, etc.)
- **Sentiment Analysis**: Uses `cardiffnlp/twitter-roberta-base-sentiment` model
- **Risk Classification**: LOW (95%), MEDIUM (85%), HIGH (70%) adjustment
- **Evidence-Based**: Shows actual news causing adjustments
- **SHAP Integration**: Injury factors included in explainability

**Example:**
```json
{
  "playerName": "Giannis Antetokounmpo",
  "projectedPoints": 60.2,  // Reduced from 63.4 due to injury risk
  "explanation": {
    "topFactors": [
      {
        "factor": "injury_risk",
        "impact": -3.2,
        "description": "Minor injury concerns: 2 negative mention(s) detected (70% confidence)"
      }
    ],
    "reasoning": "Projection reduced by 5% due to knee soreness mentions"
  }
}
```

**Why This Matters:**

- ✅ More accurate projections accounting for injury risk
- ✅ Understand exactly WHY projections are adjusted
- ✅ Make informed decisions with evidence-based insights
- ✅ First sports analytics tool with SHAP + HuggingFace integration

## 🚀 Usage

### Batch Mode (Default)

Run once and get results:

**Input Example:**
```json
{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "slate": "main",
    "minSalary": 8000
  }
}
```

**Output (Real Results from Production):**
```json
{
  "sport": "NBA",
  "slate": "main",
  "date": "2025-11-23",
  "projections": [
    {
      "playerName": "Giannis Antetokounmpo",
      "team": "MIL",
      "position": "PF",
      "salary": 5500,
      "projectedPoints": 63.4,
      "floor": 50.7,
      "ceiling": 76.1,
      "value": 11.53,
      "ownership": 45.2,
      "confidence": 0.95,
      "explanation": {
        "topFactors": [
          {
            "factor": "recent_performance",
            "impact": 63.4375,
            "description": "Averaging 63.4 FP over last 8 games"
          },
          {
            "factor": "injury_risk",
            "impact": -3.2,
            "description": "Minor injury concerns: 2 negative mention(s) detected (70% confidence)"
          }
        ],
        "reasoning": "Giannis is projected for 63.4 fantasy points... Note: Minor injury concerns detected - projection reduced by 5%."
      }
    },
    {
      "playerName": "LaMelo Ball",
      "team": "CHA",
      "position": "PG",
      "salary": 5500,
      "projectedPoints": 46.5,
      "value": 8.45,
      "confidence": 0.93
    }
  ]
}
```

*14 players retrieved in < 50 seconds with full SHAP explanations*

### Server Mode

Keep running as MCP server for continuous use with Claude Desktop or other MCP clients.

**Input:**
```json
{
  "mode": "server"
}
```

## 🛠️ Available Tools

### `get_player_projections`

**Arguments:**
- `sport` (required): "NBA", "NFL", "MLB", or "NHL"
- `slate` (optional): "main", "early", "afternoon", "evening"
- `date` (optional): ISO 8601 date (defaults to today)
- `minSalary` (optional): Filter by minimum salary
- `maxSalary` (optional): Filter by maximum salary
- `positions` (optional): Array of positions to filter

### `optimize_lineup`

**Arguments:**
- `sport` (required): "NBA", "NFL", "MLB", or "NHL"
- `projections` (required): Array of player projections
- `strategy` (optional): "cash", "tournament", "balanced"
- `lineupCount` (optional): Number of lineups to generate (1-150)
- `requiredPlayers` (optional): Player IDs that must be in lineup
- `excludedPlayers` (optional): Player IDs to exclude
- `maxPlayersPerTeam` (optional): Max players from same team (default: 4)

### `get_live_odds`

**Arguments:**
- `sport` (required): "NBA", "NFL", "MLB", or "NHL"
- `markets` (optional): ["spreads", "totals", "moneylines", "player_props"]
- `team` (optional): Filter by team name
- `bookmakers` (optional): Array of bookmaker names

### `explain_recommendation`

**Arguments:**
- `playerId` (optional): Player ID to explain
- `playerName` (optional): Player name to explain
- `method` (optional): "shap", "lime", "feature_importance"

## 📊 Output

Results are saved to:
- **Dataset**: Player projections, lineups, odds data
- **Key-Value Store**: Metadata, cache, status

## 💡 Use Cases

### DFS Players
- Get daily player projections with explainable AI
- Optimize lineups for cash games or tournaments
- Understand ownership levels to find leverage
- Research players with SHAP explanations

### Sports Bettors
- Compare odds across multiple sportsbooks
- Find best available lines
- Track line movements
- Analyze player props

### Data Scientists
- Access structured sports data via API
- Train custom models on projections
- Backtest lineup strategies
- Research AI explainability

### Content Creators
- Generate data-driven content
- Create talking points with AI explanations
- Produce lineup articles
- Analyze player trends

## 🔑 API Keys (Optional)

### The Odds API
Get free API key at https://the-odds-api.com/
- Free tier: 500 requests/month
- Used for live odds data
- Not required for projections

### RotoGrinders API
Get API key at https://rotogrinders.com/
- Has free tier
- Used for DFS salaries (fallback to DraftKings API if not provided)
- Optional but recommended

## 📈 Data Sources

- **BallDontLie API**: Free NBA stats
- **DraftKings API**: Real-time DFS salaries
- **RotoGrinders API**: DFS salaries & ownership (optional)
- **The Odds API**: Live betting odds (optional)

## 🎯 Sports Supported

### Currently
- ✅ **NBA** (fully functional)

### Coming Soon
- 🔜 **NFL** (architecture ready)
- 🔜 **MLB** (architecture ready)
- 🔜 **NHL** (architecture ready)

## 🧪 Example Scenarios

### Scenario 1: Get Tonight's NBA Projections
```json
{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "slate": "main"
  }
}
```

### Scenario 2: Find Value Plays Under $7K
```json
{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "maxSalary": 7000
  }
}
```

### Scenario 3: Generate Tournament Lineups
```json
{
  "mode": "batch",
  "tool": "optimize_lineup",
  "arguments": {
    "sport": "NBA",
    "projections": [...],
    "strategy": "tournament",
    "lineupCount": 20
  }
}
```

### Scenario 4: Compare NBA Spreads
```json
{
  "mode": "batch",
  "tool": "get_live_odds",
  "arguments": {
    "sport": "NBA",
    "markets": ["spreads"]
  }
}
```

## 🏆 Advantages

### vs. Traditional DFS Sites
- ✅ **Explainable AI** - Understand WHY, not just WHAT
- ✅ **Free tier** - No subscription required
- ✅ **Open source** - Transparent algorithms
- ✅ **API access** - Integrate with your tools

### vs. Manual Research
- ✅ **AI-powered** - Advanced projections using ML
- ✅ **Automated** - Instant results, no manual work
- ✅ **Multi-source** - Aggregates data from multiple APIs
- ✅ **Real-time** - Always up-to-date

## 📖 Documentation

- **GitHub**: https://github.com/roizenlabs/sportintel-mcp
- **MCP Protocol**: https://modelcontextprotocol.io
- **API Docs**: See README in repository

## 🤝 Support

- **Issues**: https://github.com/roizenlabs/sportintel-mcp/issues
- **Email**: support@sportintel.ai
- **Discord**: Coming soon

## 📜 License

MIT License - Free to use for personal and commercial projects

## 🚀 Getting Started

1. Click "Try for free"
2. Select your mode (batch or server)
3. Choose a tool to run
4. Provide arguments
5. Click "Start"
6. View results in Dataset

That's it! Get AI-powered sports analytics in seconds.

---

**Built with ❤️ by RoizenLabs**

**Powered by**: Claude AI, TypeScript, Apify, MCP Protocol
