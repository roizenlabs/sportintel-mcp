# 🚀 Quick Start Guide - SportIntel MCP

Get SportIntel MCP running with Claude Desktop in under 5 minutes.

---

## Prerequisites

- **Node.js** 18+ installed
- **Claude Desktop** app (latest version)
- **API Keys**:
  - The Odds API (free tier available at [the-odds-api.com](https://the-odds-api.com))

---

## Step 1: Install SportIntel MCP

### Option A: From Apify Store (Recommended)

1. Go to [apify.com/roizenlabs/sportintel-mcp](https://apify.com/roizenlabs/sportintel-mcp)
2. Click **"Try for Free"**
3. Copy your Apify API token
4. Add to Claude Desktop config (see Step 2)

### Option B: From Source

```bash
# Clone repository
git clone https://github.com/roizenlabs/sportintel-mcp.git
cd sportintel-mcp

# Install dependencies
npm install

# Build
npm run build
```

---

## Step 2: Configure Claude Desktop

### Locate Config File

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Add SportIntel MCP

Open the config file and add:

```json
{
  "mcpServers": {
    "sportintel": {
      "command": "node",
      "args": [
        "/absolute/path/to/sportintel-mcp/dist/main.js"
      ],
      "env": {
        "ODDS_API_KEY": "your_odds_api_key_here",
        "BALLDONTLIE_API_URL": "https://api.balldontlie.io/v1",
        "ODDS_API_URL": "https://api.the-odds-api.com/v4",
        "ENABLE_CACHE": "true",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/sportintel-mcp` with your actual path!

### Get API Keys

#### The Odds API (Required)

1. Sign up at [the-odds-api.com](https://the-odds-api.com)
2. Free tier: 500 requests/month
3. Copy API key from dashboard
4. Add to `ODDS_API_KEY` in config

#### BallDontLie (Free, No Key Required)

No API key needed for basic NBA stats. Rate limit: 60 requests/minute.

---

## Step 3: Restart Claude Desktop

1. Fully quit Claude Desktop (Cmd+Q on macOS)
2. Reopen Claude Desktop
3. Look for **"SportIntel MCP"** in the tools menu

---

## Step 4: Test the Integration

### Test 1: Player Projections

In Claude Desktop, type:

```
Get AI projections for tonight's NBA main slate
```

Claude should call the `get_player_projections` tool and return:
- Projected fantasy points for all players
- Confidence scores
- SHAP explanations for top players

### Test 2: Lineup Optimization

```
Build me 5 cash game lineups using those projections
```

Claude should call `optimize_lineup` and return:
- 5 optimized lineups under salary cap
- Risk scores
- Expected value calculations

### Test 3: Live Odds

```
Show me the best odds for tonight's NBA games
```

Claude should call `get_live_odds` and return:
- Current spreads/totals from multiple books
- Best available lines
- Line movement indicators

---

## Troubleshooting

### Issue: "MCP Server Not Found"

**Solution:**
1. Check that the path in `claude_desktop_config.json` is absolute (not relative)
2. Verify the file exists: `ls /path/to/sportintel-mcp/dist/main.js`
3. Try running manually: `node /path/to/sportintel-mcp/dist/main.js`

### Issue: "API Key Invalid"

**Solution:**
1. Verify API key is correct in config
2. Check quota at [the-odds-api.com/account](https://the-odds-api.com/account)
3. Ensure no extra spaces in the key

### Issue: "No Games Found"

**Solution:**
1. Check that there are games today (off-season?)
2. Try different date: `date: "2025-01-25"`
3. Verify API is responding:
   ```bash
   curl "https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=YOUR_KEY"
   ```

### Issue: "Rate Limit Exceeded"

**Solution:**
1. Free tier: 500 requests/month (resets monthly)
2. Enable caching in `.env`: `ENABLE_CACHE=true`
3. Consider upgrading to paid plan ($25/month for 10K requests)

### Debug Mode

Enable detailed logging:

```json
{
  "env": {
    "LOG_LEVEL": "debug",
    "ENABLE_DEBUG_MODE": "true"
  }
}
```

Check logs in Claude Desktop console.

---

## Usage Examples

### Beginner: Simple Projection Request

```
Hey Claude, I'm playing NBA DFS tonight. Can you give me AI projections
for the main slate and explain why your top 3 picks are good?
```

### Intermediate: Lineup Building

```
I need 10 tournament lineups for NFL Sunday. Here are my constraints:
- Must include Travis Kelce
- No more than 3 players from the same team
- Looking for high upside, willing to take risk
```

### Advanced: Multi-Tool Workflow

```
I'm analyzing tonight's Lakers vs Warriors game:
1. Get projections for both teams' players
2. Show me the live odds from all sportsbooks
3. Explain why LeBron has such a high projection
4. Build a showdown lineup maximizing Lakers stack
```

---

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ODDS_API_KEY` | Required | Your Odds API key |
| `ODDS_API_URL` | the-odds-api.com/v4 | Odds API endpoint |
| `BALLDONTLIE_API_URL` | balldontlie.io/v1 | NBA stats endpoint |
| `ENABLE_CACHE` | `true` | Cache API responses |
| `CACHE_TTL_SECONDS` | `300` | Cache time-to-live |
| `LOG_LEVEL` | `info` | Logging verbosity |
| `MODEL_PATH` | `./models/` | ML model directory |
| `ENABLE_SHAP` | `true` | SHAP explainability |

### Tool-Specific Settings

```json
{
  "env": {
    "CONFIDENCE_THRESHOLD": "0.7",
    "MAX_CONCURRENT_REQUESTS": "10",
    "ENABLE_INJURY_ANALYSIS": "false"
  }
}
```

---

## Performance Tips

### 1. Enable Caching

Reduces API calls by 80%:
```json
"ENABLE_CACHE": "true",
"CACHE_TTL_SECONDS": "300"
```

### 2. Batch Requests

Instead of:
```
Get projections for LeBron
Get projections for Curry
Get projections for Durant
```

Do:
```
Get projections for all players in tonight's slate
```

### 3. Use Date Filters

Only fetch data you need:
```json
{
  "date": "2025-01-25",
  "slate": "main",
  "minSalary": 7000
}
```

---

## Next Steps

- 📖 Read [API Reference](./api-reference.md) for detailed tool documentation
- 🎯 Check [Examples](./examples/) for advanced use cases
- 🤝 Join [Discord Community](https://discord.gg/sportintel) for support
- 📊 Review [Performance Guide](./performance.md) for optimization

---

## Getting Help

- **Documentation Issues**: [GitHub Issues](https://github.com/roizenlabs/sportintel-mcp/issues)
- **Claude Desktop Issues**: [Anthropic Support](https://support.anthropic.com)
- **API Issues**: [The Odds API Support](https://the-odds-api.com/support)

---

**Happy Projecting! 🏈📊**
