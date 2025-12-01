# BallDontLie API Limitation

## The Problem

The Actor is failing with this error:
```
Error fetching stats: AxiosError: Request failed with status code 401
```

## Root Cause

The **FREE tier of BallDontLie API does NOT include access to the `/stats` endpoint**.

### What Works (FREE tier):
- ✅ `/players` - Get player information
- ✅ `/teams` - Get team information
- ✅ `/games` - Get game schedules

### What Doesn't Work (Paid plans only):
- ❌ `/stats` - Get player statistics (REQUIRED for projections)
- ❌ `/season_averages` - Get season averages

## Testing Results

```bash
# This WORKS:
curl -H "Authorization: <your-balldontlie-api-key>" \
  "https://api.balldontlie.io/v1/players?per_page=1"
# Returns: Player data ✅

# This FAILS:
curl -H "Authorization: <your-balldontlie-api-key>" \
  "https://api.balldontlie.io/v1/stats?per_page=1"
# Returns: "Unauthorized" ❌
```

## Solutions

### Option 1: Upgrade BallDontLie Plan (RECOMMENDED)

**Cost**: $10-20/month for stats access

**Steps**:
1. Go to: https://www.balldontlie.io/pricing
2. Upgrade to a paid plan that includes `/stats` endpoint
3. No code changes needed - Actor will work immediately!

### Option 2: Use Alternative Data Source (FREE)

**Replace BallDontLie with balldontlie-free or another free API**

Free alternatives:
- **NBA API** (unofficial, no key needed): https://github.com/swar/nba_api
- **ESPN API** (unofficial): http://site.api.espn.com/apis/site/v2/sports/basketball/nba
- **Sportradar** (free tier with stats): https://developer.sportradar.com/

### Option 3: Use Mock Data for MVP (TEMPORARY)

**Keep current implementation but use fake stats for testing**

This allows you to:
- Submit to Apify Store
- Show the concept/UI
- Get user feedback
- Add disclaimer: "Uses sample data for demonstration"

Once you get paying users, upgrade to real data source.

## Recommended Path Forward

Since you're trying to MVP quickly and get to market:

1. **Short term** (this week):
   - Use mock/fake player stats
   - Add clear disclaimer
   - Focus on getting UI/UX right
   - Submit to Apify Store

2. **Medium term** (once you have users):
   - Upgrade to BallDontLie paid plan ($10-20/mo)
   - OR integrate free alternative (ESPN API, NBA API)
   - Remove disclaimer

3. **Long term** (if successful):
   - Build your own data pipeline
   - Scrape multiple sources
   - Add data validation

## Next Steps

**Choice A**: Pay for BallDontLie ($10-20/mo) - WORKS NOW
**Choice B**: Switch to free alternative API - REQUIRES CODE CHANGES
**Choice C**: Use mock data for MVP - WORKS NOW BUT FAKE DATA

Which path do you want to take?

---

## Technical Note

The Actor successfully:
- ✅ Deploys to Apify
- ✅ Fetches DFS salaries (62 players)
- ✅ Calls BallDontLie API
- ✅ Has correct authentication

It only fails when trying to fetch player statistics because the free API key doesn't have access to that endpoint.
