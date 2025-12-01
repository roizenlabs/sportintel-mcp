# 📘 SportIntel MCP - API Reference

Complete reference for all SportIntel MCP tools.

---

## Table of Contents

1. [get_player_projections](#get_player_projections)
2. [optimize_lineup](#optimize_lineup)
3. [get_live_odds](#get_live_odds)
4. [explain_recommendation](#explain_recommendation)

---

## get_player_projections

Get AI-powered DFS player projections with confidence scores and SHAP explainability.

### Input Schema

```typescript
{
  sport: "NBA" | "NFL" | "MLB" | "NHL";
  slate?: "main" | "early" | "afternoon" | "evening" | "showdown"; // default: "main"
  date?: string; // ISO 8601 date, defaults to today
  includeExplanations?: boolean; // default: true
  minSalary?: number; // filter by minimum salary
  maxSalary?: number; // filter by maximum salary
  positions?: string[]; // filter by positions, e.g., ["PG", "SG"]
}
```

### Example Request

```json
{
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "slate": "main",
    "includeExplanations": true,
    "minSalary": 7000
  }
}
```

### Output Schema

```typescript
{
  sport: Sport;
  slate: SlateType;
  date: string;
  projections: Array<{
    playerId: string;
    playerName: string;
    team: string;
    position: Position;
    salary: number;
    projectedPoints: number;
    floor: number; // Conservative estimate
    ceiling: number; // Optimistic estimate
    confidence: number; // 0-1 scale
    value: number; // Points per $1K salary
    ownership: number; // Estimated ownership %
    explanation?: {
      topFactors: Array<{
        factor: string;
        impact: number;
        description: string;
      }>;
      reasoning: string;
      shapValues?: Record<string, number>;
    };
  }>;
  metadata: {
    modelVersion: string;
    lastTrained: string;
    dataSourcesUsed: string[];
    generatedAt: string;
  };
}
```

### Example Response

```json
{
  "sport": "NBA",
  "slate": "main",
  "date": "2025-01-25T00:00:00Z",
  "projections": [
    {
      "playerId": "lbj23",
      "playerName": "LeBron James",
      "team": "LAL",
      "position": "SF",
      "salary": 9500,
      "projectedPoints": 48.2,
      "floor": 38.6,
      "ceiling": 57.8,
      "confidence": 0.89,
      "value": 5.07,
      "ownership": 32.5,
      "explanation": {
        "topFactors": [
          {
            "factor": "recent_ppg",
            "impact": 6.2,
            "description": "Averaging 32.1 PPG over last 5 games"
          },
          {
            "factor": "vegas_total",
            "impact": 3.1,
            "description": "230.5 Vegas total suggests high-scoring game"
          },
          {
            "factor": "opponent_def_rating",
            "impact": 2.4,
            "description": "Facing 28th-ranked defense"
          }
        ],
        "reasoning": "LeBron is projected above baseline due to elite recent performance, favorable game environment (high Vegas total), and weak opposing defense. Confidence is high given 10+ games of recent data.",
        "shapValues": {
          "recent_ppg": 6.2,
          "vegas_total": 3.1,
          "opponent_def_rating": 2.4,
          "home_away": 0.7,
          "rest_days": -0.3
        }
      }
    }
  ],
  "metadata": {
    "modelVersion": "1.0.0",
    "lastTrained": "2025-01-15T00:00:00Z",
    "dataSourcesUsed": ["balldontlie", "odds-api", "vegas-lines"],
    "generatedAt": "2025-01-25T18:30:00Z"
  }
}
```

### Use Cases

- Get projections for entire slate before building lineups
- Filter high-value plays by salary range
- Understand why model recommends specific players
- Compare floor/ceiling for cash vs GPP strategy

---

## optimize_lineup

Generate optimal DFS lineups using linear programming and multi-objective optimization.

### Input Schema

```typescript
{
  sport: "NBA" | "NFL" | "MLB" | "NHL";
  projections: Array<{
    playerId: string;
    projectedPoints: number;
  }>;
  salaryCap: number; // e.g., 50000 for DraftKings
  lineupCount?: number; // 1-150, default: 10
  strategy?: "cash" | "tournament" | "balanced"; // default: "balanced"
  constraints?: {
    maxPlayersPerTeam?: number;
    requiredPlayers?: string[]; // Player IDs to lock in
    excludedPlayers?: string[]; // Player IDs to exclude
    preferStacks?: boolean; // Prefer game/positional stacks
    minUniqueOwnership?: number; // For GPP differentiation
  };
}
```

### Example Request

```json
{
  "tool": "optimize_lineup",
  "arguments": {
    "sport": "NBA",
    "projections": [
      {"playerId": "lbj23", "projectedPoints": 48.2},
      {"playerId": "sc30", "projectedPoints": 45.1}
    ],
    "salaryCap": 50000,
    "lineupCount": 5,
    "strategy": "tournament",
    "constraints": {
      "maxPlayersPerTeam": 3,
      "requiredPlayers": ["lbj23"],
      "preferStacks": true
    }
  }
}
```

### Output Schema

```typescript
{
  lineups: Array<{
    rank: number;
    players: Array<{
      playerId: string;
      playerName: string;
      position: Position;
      salary: number;
      projectedPoints: number;
    }>;
    totalSalary: number;
    salaryCap: number;
    salaryRemaining: number;
    projectedPoints: number;
    expectedValue: number; // Points per $1K
    riskScore: number; // 0-100, lower = safer
    estimatedOwnership: number; // Average ownership %
    stacks: Array<{
      type: string; // "game", "qb-wr", "rb-dst"
      players: string[];
    }>;
  }>;
  optimizationStats: {
    strategy: string;
    uniquePlayersUsed: number;
    averageOwnership: number;
    generatedAt: string;
  };
}
```

### Example Response

```json
{
  "lineups": [
    {
      "rank": 1,
      "players": [
        {
          "playerId": "lbj23",
          "playerName": "LeBron James",
          "position": "SF",
          "salary": 9500,
          "projectedPoints": 48.2
        },
        {
          "playerId": "sc30",
          "playerName": "Stephen Curry",
          "position": "PG",
          "salary": 9300,
          "projectedPoints": 45.1
        }
        // ... 6 more players
      ],
      "totalSalary": 49800,
      "salaryCap": 50000,
      "salaryRemaining": 200,
      "projectedPoints": 283.5,
      "expectedValue": 5.69,
      "riskScore": 45,
      "estimatedOwnership": 18.3,
      "stacks": [
        {
          "type": "game",
          "players": ["LeBron James", "Anthony Davis", "D'Angelo Russell"]
        }
      ]
    }
  ],
  "optimizationStats": {
    "strategy": "tournament",
    "uniquePlayersUsed": 32,
    "averageOwnership": 15.7,
    "generatedAt": "2025-01-25T18:35:00Z"
  }
}
```

### Strategies

- **Cash**: Minimizes risk, prioritizes floor projections, targets ~20% ownership
- **Tournament**: Maximizes upside, prioritizes ceiling projections, seeks low ownership
- **Balanced**: Mix of both, good for small-field GPPs

### Use Cases

- Generate mass multi-entry lineups for GPPs (up to 150)
- Lock in specific players you believe in
- Build correlated stacks for showdown slates
- Diversify across multiple games/teams

---

## get_live_odds

Get real-time betting odds from multiple sportsbooks with line movement tracking.

### Input Schema

```typescript
{
  sport: "NBA" | "NFL" | "MLB" | "NHL";
  gameIds?: string[]; // Specific games, defaults to all upcoming
  markets?: Array<"spreads" | "totals" | "h2h" | "player_props">; // default: ["spreads", "totals"]
  bookmakers?: string[]; // Filter by sportsbook, e.g., ["fanduel", "draftkings"]
}
```

### Example Request

```json
{
  "tool": "get_live_odds",
  "arguments": {
    "sport": "NBA",
    "markets": ["spreads", "totals", "h2h"]
  }
}
```

### Output Schema

```typescript
{
  sport: Sport;
  games: Array<{
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    gameTime: string;
    bookmakers: Array<{
      name: string;
      markets: Array<{
        type: "spreads" | "totals" | "h2h" | "player_props";
        outcomes: Array<{
          name: string;
          price: number; // American odds
          point?: number; // Spread/total line
        }>;
        lastUpdate: string;
      }>;
    }>;
    bestOdds: {
      homeSpread?: { line: number; price: number; bookmaker: string };
      awaySpread?: { line: number; price: number; bookmaker: string };
      overTotal?: { line: number; price: number; bookmaker: string };
      underTotal?: { line: number; price: number; bookmaker: string };
    };
  }>;
  metadata: {
    fetchedAt: string;
    dataSource: string;
    marketsCovered: string[];
  };
}
```

### Example Response

```json
{
  "sport": "NBA",
  "games": [
    {
      "gameId": "lal_gsw_20250125",
      "homeTeam": "LAL",
      "awayTeam": "GSW",
      "gameTime": "2025-01-25T22:00:00Z",
      "bookmakers": [
        {
          "name": "DraftKings",
          "markets": [
            {
              "type": "spreads",
              "outcomes": [
                {"name": "LAL", "price": -110, "point": -3.5},
                {"name": "GSW", "price": -110, "point": 3.5}
              ],
              "lastUpdate": "2025-01-25T18:30:00Z"
            },
            {
              "type": "totals",
              "outcomes": [
                {"name": "Over", "price": -108, "point": 230.5},
                {"name": "Under", "price": -112, "point": 230.5}
              ],
              "lastUpdate": "2025-01-25T18:30:00Z"
            }
          ]
        },
        {
          "name": "FanDuel",
          "markets": [
            {
              "type": "spreads",
              "outcomes": [
                {"name": "LAL", "price": -108, "point": -3.5},
                {"name": "GSW", "price": -112, "point": 3.5}
              ],
              "lastUpdate": "2025-01-25T18:32:00Z"
            }
          ]
        }
      ],
      "bestOdds": {
        "homeSpread": {"line": -3.5, "price": -108, "bookmaker": "FanDuel"},
        "awaySpread": {"line": 3.5, "price": -110, "bookmaker": "DraftKings"},
        "overTotal": {"line": 230.5, "price": -108, "bookmaker": "DraftKings"},
        "underTotal": {"line": 230.5, "price": -112, "bookmaker": "DraftKings"}
      }
    }
  ],
  "metadata": {
    "fetchedAt": "2025-01-25T18:35:00Z",
    "dataSource": "the-odds-api",
    "marketsCovered": ["spreads", "totals", "h2h"]
  }
}
```

### Use Cases

- Compare odds across sportsbooks to find best value
- Monitor line movements before placing bets
- Identify games with high Vegas totals for DFS (pace = more fantasy points)
- Find +EV betting opportunities

---

## explain_recommendation

Get detailed SHAP/LIME explanations for AI projection decisions.

### Input Schema

```typescript
{
  playerId: string;
  sport: "NBA" | "NFL" | "MLB" | "NHL";
  explainerType?: "shap" | "lime" | "feature_importance"; // default: "shap"
  includeVisualizations?: boolean; // default: false
}
```

### Example Request

```json
{
  "tool": "explain_recommendation",
  "arguments": {
    "playerId": "lbj23",
    "sport": "NBA",
    "explainerType": "shap",
    "includeVisualizations": true
  }
}
```

### Output Schema

```typescript
{
  playerId: string;
  playerName: string;
  projectedPoints: number;
  explanation: {
    method: "shap" | "lime" | "feature_importance";
    topFactors: Array<{
      feature: string;
      value: number; // Actual feature value
      impact: number; // SHAP value (contribution to prediction)
      direction: "positive" | "negative";
      humanReadable: string;
    }>;
    baseValue: number; // Average prediction
    predictionValue: number; // This player's prediction
    reasoning: string;
  };
  visualizations?: {
    waterfallPlot?: string; // Base64 PNG
    forceplot?: string; // Base64 PNG
  };
  confidence: number;
  generatedAt: string;
}
```

### Example Response

```json
{
  "playerId": "lbj23",
  "playerName": "LeBron James",
  "projectedPoints": 48.2,
  "explanation": {
    "method": "shap",
    "topFactors": [
      {
        "feature": "recent_ppg",
        "value": 32.1,
        "impact": 6.2,
        "direction": "positive",
        "humanReadable": "Recent scoring (32.1 PPG) adds +6.2 fantasy points"
      },
      {
        "feature": "vegas_total",
        "value": 230.5,
        "impact": 3.1,
        "direction": "positive",
        "humanReadable": "High Vegas total (230.5) suggests fast pace, adds +3.1 fantasy points"
      },
      {
        "feature": "opponent_def_rating",
        "value": 118.2,
        "impact": 2.4,
        "direction": "positive",
        "humanReadable": "Weak opponent defense (118.2 rating) adds +2.4 fantasy points"
      },
      {
        "feature": "home_away",
        "value": 1,
        "impact": 0.7,
        "direction": "positive",
        "humanReadable": "Home court advantage adds +0.7 fantasy points"
      },
      {
        "feature": "rest_days",
        "value": 1,
        "impact": -0.3,
        "direction": "negative",
        "humanReadable": "Back-to-back game reduces projection by -0.3 fantasy points"
      }
    ],
    "baseValue": 35.1,
    "predictionValue": 48.2,
    "reasoning": "LeBron's projection is 13.1 points above the baseline (35.1 FP). The main drivers are: (1) exceptional recent scoring performance averaging 32.1 PPG, (2) a high Vegas total indicating a fast-paced, high-scoring game environment, and (3) facing a weak defensive opponent ranked 28th in defensive rating. The only negative factor is limited rest with back-to-back games, but this is outweighed by the positive factors. The model has 89% confidence in this projection based on 10+ games of recent data."
  },
  "visualizations": {
    "waterfallPlot": "data:image/png;base64,iVBORw0KG...",
    "forceplot": "data:image/png;base64,iVBORw0KG..."
  },
  "confidence": 0.89,
  "generatedAt": "2025-01-25T18:40:00Z"
}
```

### Explainer Methods

- **SHAP**: Most accurate, shows exact feature contributions, slower
- **LIME**: Fast approximation, good for real-time use
- **Feature Importance**: Simplest, shows average feature importance across all predictions

### Use Cases

- Understand *why* the model likes a player
- Validate projections against your own analysis
- Learn which features matter most for different matchups
- Build trust in AI recommendations through transparency

---

## Error Handling

All tools return errors in this format:

```json
{
  "error": "Error message here",
  "tool": "tool_name",
  "arguments": { /* input that caused error */ },
  "timestamp": "2025-01-25T18:45:00Z"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Rate limit exceeded` | Too many API calls | Enable caching, wait for reset, or upgrade plan |
| `Invalid API key` | Incorrect Odds API key | Verify key in config |
| `No games found` | Off-season or wrong date | Check date, try different sport |
| `Insufficient data` | Player hasn't played recently | Use different player or lower confidence threshold |

---

## Rate Limits

- **Odds API**: 500 requests/hour (free), 10K requests/hour (pro $25/mo)
- **BallDontLie**: 60 requests/minute
- **Caching**: 5-minute TTL reduces API usage by ~80%

---

## Next Steps

- [Quick Start Guide](./quickstart.md) - Set up with Claude Desktop
- [Examples](./examples/) - Advanced use cases
- [GitHub](https://github.com/roizenlabs/sportintel-mcp) - Source code

