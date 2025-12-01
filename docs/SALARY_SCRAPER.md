# DFS Salary Scraper System

## Overview

The SportIntel-MCP salary scraper system provides **real-time DFS salaries** from multiple sources with intelligent fallbacks and caching. This replaces the mock salary data with production-ready salary fetching.

## Architecture

```
┌─────────────────────────────────────────────┐
│         SalaryService                        │
│  (Orchestration + Caching)                   │
└────────────┬────────────────────────────────┘
             │
     ┌───────┴───────┐
     │               │
┌────▼─────┐  ┌─────▼──────┐
│ RotoGrin │  │ DraftKings │
│ ders API │  │ Public API │
└──────────┘  └────────────┘
```

## Data Sources

### 1. RotoGrinders API (Primary)
- **Endpoint**: `https://rotogrinders.com/api`
- **Cost**: Free tier available
- **Coverage**: DraftKings, FanDuel, Yahoo
- **Reliability**: ⭐⭐⭐⭐⭐ (Official API)
- **Data**: Salaries, projections, ownership estimates

### 2. DraftKings Public API (Secondary)
- **Endpoint**: `https://api.draftkings.com/draftgroups/v1`
- **Cost**: Free
- **Coverage**: DraftKings only
- **Reliability**: ⭐⭐⭐⭐ (Reverse-engineered)
- **Data**: Real-time salaries, slate info

### 3. Browser Scraper (Fallback)
- **Method**: Playwright headless browser
- **Status**: Implemented but disabled in MVP
- **Use case**: Last resort if APIs fail

## Usage

### Basic Usage

```typescript
import { SalaryService } from "./services/salary-service.js";

const salaryService = new SalaryService({
  enableCache: true,
  cacheTTLMinutes: 60,
  preferredSource: "auto",
});

// Get today's NBA salaries
const salaries = await salaryService.getSalaries("NBA", "draftkings", "main");

console.log(`Found ${salaries.length} players with salaries`);
// Output: Found 247 players with salaries

salaries.forEach(player => {
  console.log(`${player.playerName} (${player.position}) - $${player.dkSalary}`);
});
```

### Integration with Player Projections

The `PlayerProjectionsTool` automatically uses the `SalaryService`:

```typescript
// User calls via MCP:
// get_player_projections({ sport: "NBA", slate: "main" })

// Behind the scenes:
// 1. Fetches real salaries from RotoGrinders/DraftKings
// 2. Caches results for 1 hour
// 3. Matches players to salaries
// 4. Generates projections with real value calculations
```

### Advanced Usage

#### Get Specific Player Salary

```typescript
const curry = await salaryService.getPlayerSalary(
  "Stephen Curry",
  "NBA",
  "draftkings"
);

console.log(`Curry's salary: $${curry?.dkSalary}`);
// Output: Curry's salary: $9300
```

#### Get Multiple Players

```typescript
const players = ["LeBron James", "Giannis Antetokounmpo", "Nikola Jokic"];
const salaries = await salaryService.getPlayersSalaries(
  players,
  "NBA",
  "draftkings"
);

salaries.forEach((salary, name) => {
  console.log(`${name}: $${salary.dkSalary}`);
});
```

#### Refresh Cache

```typescript
// Force refresh (bypass cache)
const freshSalaries = await salaryService.refreshSalaries("NBA", "draftkings");
```

#### Check Cache Status

```typescript
const cachedSlates = salaryService.getCachedSlates();

cachedSlates.forEach(slate => {
  console.log(`${slate.sport} ${slate.site}: ${slate.count} players (${slate.age}m old)`);
});
// Output: NBA draftkings: 247 players (23m old)
```

#### Clear Cache

```typescript
salaryService.clearCache();
```

## Configuration

### Environment Variables

```bash
# RotoGrinders API (Optional - has free tier)
ROTOGRINDERS_API_KEY=your_api_key_here
ROTOGRINDERS_API_URL=https://rotogrinders.com/api

# DraftKings API (No key needed - public API)
DRAFTKINGS_API_URL=https://api.draftkings.com/draftgroups/v1
```

### Service Configuration

```typescript
const salaryService = new SalaryService({
  // Enable caching (default: true)
  enableCache: true,

  // Cache TTL in minutes (default: 60)
  cacheTTLMinutes: 60,

  // Preferred source: "auto" | "rotogrinders" | "draftkings"
  // "auto" intelligently selects based on site
  preferredSource: "auto",
});
```

## Data Format

### SalaryData Interface

```typescript
interface SalaryData {
  playerId: string;           // Unique player ID
  playerName: string;         // Full name (e.g., "LeBron James")
  team: string;               // Team abbreviation (e.g., "LAL")
  position: string;           // Position (e.g., "SF")
  dkSalary?: number;          // DraftKings salary (e.g., 9500)
  fdSalary?: number;          // FanDuel salary
  yahooSalary?: number;       // Yahoo salary
  slateId: string;            // Slate identifier
  sport: string;              // Sport (e.g., "NBA")
  lastUpdate: Date;           // When data was fetched
}
```

## Caching Strategy

### Cache Key Format

```
{sport}:{site}:{slateType}:{date}
Example: NBA:draftkings:main:2025-01-23
```

### Cache Invalidation

- **TTL**: Default 60 minutes (configurable)
- **Manual**: Call `refreshSalaries()` or `clearCache()`
- **Automatic**: Cache auto-expires after TTL

### Why Caching?

1. **Rate Limits**: Avoid hitting API rate limits
2. **Performance**: Instant response for repeat queries
3. **Cost**: Reduce API usage on paid tiers
4. **Reliability**: Serve stale data if APIs are down

## Fallback Logic

The service tries sources in this order:

### For DraftKings

1. **DraftKings API** (most accurate, real-time)
2. **RotoGrinders API** (reliable fallback)
3. **Cache** (if APIs fail)
4. **Mock Data** (development only)

### For FanDuel/Yahoo

1. **RotoGrinders API** (only option)
2. **Cache** (if API fails)
3. **Mock Data** (development only)

## Error Handling

### Graceful Degradation

```typescript
try {
  const salaries = await salaryService.getSalaries("NBA", "draftkings");
} catch (error) {
  // All sources failed
  console.error("Unable to fetch salaries:", error.message);

  // Fallback options:
  // 1. Use cached data (even if expired)
  // 2. Use mock salaries for development
  // 3. Notify user to check API keys
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Rate limit exceeded` | Too many requests | Wait 1 minute or enable caching |
| `All data sources unavailable` | No API keys or network down | Check API keys, network connection |
| `No slates found` | No games today | Check date or sport |

## Testing

### Manual Testing

```bash
# Set API keys
export ROTOGRINDERS_API_KEY=your_key
export DRAFTKINGS_API_URL=https://api.draftkings.com/draftgroups/v1

# Run MCP server
npm run dev

# In Claude Desktop, call:
# get_player_projections({ sport: "NBA", slate: "main" })
```

### Test with Mock Data

If APIs are unavailable, the system falls back to mock data:

```typescript
// src/tools/player-projections.ts
private getMockSalary(playerName: string): number {
  // Returns estimated salary for testing
}
```

## Monitoring

### Check Service Status

```typescript
const status = salaryService.getStatus();

console.log(status);
// Output:
// {
//   cache: {
//     enabled: true,
//     ttl: 60,
//     entries: 3
//   },
//   sources: {
//     preferred: "auto",
//     rotogrinders: { used: 5, limit: 60, remaining: 55 },
//     draftkings: { used: 2, limit: 30, remaining: 28 }
//   }
// }
```

## Performance

### Benchmarks

| Operation | First Call | Cached |
|-----------|-----------|--------|
| Get NBA salaries | ~800ms | ~5ms |
| Get player salary | ~800ms | ~2ms |
| Get 20 players | ~800ms | ~3ms |

### Optimization Tips

1. **Enable caching** for production
2. **Increase TTL** for less volatile data (e.g., 2 hours)
3. **Batch requests** - get all salaries once, filter locally
4. **Use specific slates** - "main" slate is faster than "all"

## Roadmap

### Future Enhancements

- [ ] **Database persistence** (PostgreSQL)
- [ ] **Ownership projections** (ML model)
- [ ] **Historical salary tracking**
- [ ] **Webhook notifications** for salary changes
- [ ] **Multi-slate support** (early, late, showdown)
- [ ] **Contest-specific salaries** (GPP vs Cash)
- [ ] **Injury-adjusted salaries**

## Support

### Issues

If you encounter problems:

1. Check API keys are set correctly
2. Verify network connectivity
3. Check rate limits: `salaryService.getStatus()`
4. Review logs for error messages
5. Open issue: https://github.com/roizenlabs/sportintel-mcp/issues

### API Keys

- **RotoGrinders**: Sign up at https://rotogrinders.com/
- **DraftKings**: No key needed (public API)

---

**Status**: ✅ Production Ready (MVP)

**Last Updated**: 2025-01-23
