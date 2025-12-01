# ⚠️ URGENT: Apify Actor Environment Variables Setup

**Issue**: Actor is getting 401 Unauthorized from BallDontLie API
**Cause**: Environment variables not properly configured in Apify Console
**Status**: NEEDS IMMEDIATE FIX

---

## Problem

The Actor deployment is failing with:
```
401 Unauthorized
Failed to fetch games: AxiosError: Request failed with status code 401
```

This means the `BALLDONTLIE_API_KEY` is not being passed to the Actor at runtime.

---

## Solution: Configure Environment Variables in Apify Console

### Step 1: Open Actor Settings
1. Go to: https://console.apify.com/actors/OdaJN92JUkidz02uv
2. Click on **"Settings"** tab

### Step 2: Add Environment Variables
Scroll to **"Environment variables"** section and add:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `BALLDONTLIE_API_KEY` | `<your-balldontlie-api-key>` | GOAT tier key |
| `BALLDONTLIE_API_URL` | `https://api.balldontlie.io/v1` | Optional |
| `BALLDONTLIE_RATE_LIMIT` | `600` | Optional |
| `ODDS_API_KEY` | `<your-odds-api-key>` | Optional |

### Step 3: Click "Save"

### Step 4: Test the Actor
1. Go to the **"Console"** tab
2. Click **"Start"** with this input:
```json
{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "slate": "main",
    "maxPlayers": 10
  }
}
```

---

## Alternative Method: Using Apify Secrets (Recommended)

For better security, use Apify Secrets instead:

### Step 1: Create a Secret
1. Go to: https://console.apify.com/account/secrets
2. Click **"Add Secret"**
3. Name: `BALLDONTLIE_API_KEY`
4. Value: `<your-balldontlie-api-key>`
5. Click **"Create"**

### Step 2: Reference in Actor
1. Go to Actor Settings
2. In Environment variables, add:
   - Name: `BALLDONTLIE_API_KEY`
   - Value: `@BALLDONTLIE_API_KEY` (references the secret)

---

## Why actor.json environmentVariables Didn't Work

The `environmentVariables` section in `.actor/actor.json`:
```json
"environmentVariables": {
  "BALLDONTLIE_API_KEY": "<your-balldontlie-api-key>"
}
```

**Should work** but has limitations:
- Only applied during **build time** in some cases
- May not persist across Actor versions
- Better to set directly in Console for reliability

---

## Verification After Setup

Once environment variables are configured, run this test in the Actor Console:

**Input:**
```json
{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "maxPlayers": 5
  }
}
```

**Expected Output:**
```
Generating projections for NBA (main slate)
Fetching DFS salaries...
Found X players with salaries
Fetching player list from BallDontLie API...
Cached 100 players for NBA
Processing 5 players (limited from 100)
✅ Success
```

**Should NOT see:**
```
401 Unauthorized
Failed to fetch games
```

---

## All Required Environment Variables

### Critical (Actor won't work without these)
- ✅ **BALLDONTLIE_API_KEY** - Your GOAT tier API key

### Optional (Actor will use fallbacks)
- **BALLDONTLIE_API_URL** - Default: `https://api.balldontlie.io/v1`
- **BALLDONTLIE_RATE_LIMIT** - Default: `600` (GOAT tier)
- **ODDS_API_KEY** - For live odds tool (Free tier available)
- **ROTOGRINDERS_API_KEY** - For salary data (Actor falls back to mock)
- **DRAFTKINGS_API_URL** - For salary data (Actor falls back to mock)

---

## Quick Fix Command (if you have Apify CLI)

```bash
# Set environment variable via CLI
apify secrets set BALLDONTLIE_API_KEY <your-balldontlie-api-key>

# Update Actor to use the secret
apify push
```

---

## Troubleshooting

### Still Getting 401 After Setting Env Vars?

1. **Verify the key is active**: Test locally first
   ```bash
   curl -H "Authorization: <your-balldontlie-api-key>" \
        "https://api.balldontlie.io/v1/teams"
   ```

2. **Check Actor logs**: Look for env var loading
   ```
   Should see: Using API key: d2bc0f1b...
   Should NOT see: API key undefined or missing
   ```

3. **Rebuild the Actor**: After setting env vars, trigger a new build
   - Go to **Builds** tab
   - Click **"Build"** on latest version

4. **Check case sensitivity**: Environment variable names are case-sensitive
   - ✅ `BALLDONTLIE_API_KEY`
   - ❌ `balldontlie_api_key`

---

## Expected Timeline

- **Setup time**: 2 minutes
- **Rebuild time**: 2-3 minutes
- **Test time**: 30 seconds
- **Total**: ~5 minutes to fix

---

## After Fix

Once working, you should see in Actor logs:
```
Generating projections for NBA (main slate)
Fetching DFS salaries...
Fetching player list from BallDontLie API...
Cached 100 players for NBA
Processing X players...
✅ Retrieved X projections
```

---

## Priority: URGENT 🚨

This is blocking the Actor from working. Please configure the environment variables in Apify Console immediately.

**Link**: https://console.apify.com/actors/OdaJN92JUkidz02uv/settings

---

## Need Help?

If you're still having issues:
1. Check the Actor logs: https://console.apify.com/actors/OdaJN92JUkidz02uv/runs
2. Verify your BallDontLie subscription: https://app.balldontlie.io/account
3. Test the API key locally: Run `npx tsx test-quick.ts`
