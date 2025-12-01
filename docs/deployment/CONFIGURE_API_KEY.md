# SportIntel MCP - API Key Configuration Guide

This guide explains how to obtain and configure API keys for SportIntel MCP.

---

## ✅ CONFIRMED: GOAT Tier Active

Your BallDontLie API key (`<your-balldontlie-api-key>`) is **UPGRADED to GOAT tier**.

**Test Results (Last verified: 2025-11-23):**
- ✅ `/teams` endpoint: **Working**
- ✅ `/games` endpoint: **Working**
- ✅ `/stats` endpoint: **WORKING** ← CRITICAL FOR DFS ✅
- ✅ Rate limit: **600 requests/min**

**Status:** You **CAN build DFS projections** with real player stats!

---

## 1. BallDontLie API Key (REQUIRED - Must Upgrade)

### Pricing Tiers

| Tier | Cost/Month | Requests/Min | What You Get |
|------|-----------|-------------|--------------|
| **FREE** ❌ | $0 | 5 | Teams, Players, Games only |
| **ALL-STAR** ⚠️ | $9.99 | 60 | ✅ **Stats** (minimum for DFS) |
| **GOAT** ✅ | $39.99 | 600 | ✅ Stats + Season Avg + Advanced + Odds |
| **ALL-ACCESS** | $159.99 | 600 | All sports (NBA, NFL, MLB, NHL) |

### Recommended: GOAT Tier ($39.99/mo)

For the Apify Challenge, **GOAT tier** gives you:
- ✅ `/stats` - Player game statistics (critical)
- ✅ `/season_averages` - Improves projection accuracy
- ✅ `/advanced_stats` - PIE, pace, defensive ratings for ML
- ✅ `/odds` - Betting line integration
- ✅ 600 requests/min (vs 60 on ALL-STAR)

**ROI:** $40 investment vs $600-$2000 potential prize = **15x-50x return**

### Upgrade Instructions

#### Step 1: Verify Current Plan
1. Go to: https://app.balldontlie.io/account
2. Check what plan you're on
3. If it says "Free" → you need to upgrade

#### Step 2: Upgrade
1. Click **"Upgrade Plan"** or go to https://www.balldontlie.io/pricing
2. Select **GOAT** ($39.99/mo) or **ALL-STAR** ($9.99/mo)
3. Complete payment

#### Step 3: Generate NEW API Key
**⚠️ CRITICAL:** After upgrading, your old free key does NOT automatically upgrade!

1. Go to: **Dashboard → API Keys**
2. Click **"Generate New Key"**
3. Copy the new paid-tier API key
4. Replace in `.env` file:

```bash
BALLDONTLIE_API_KEY=your_new_paid_key_here  # NOT the free tier key!
```

#### Step 4: Update .env File

Edit `.env` in your project root:

```bash
# Replace the current free tier key
BALLDONTLIE_API_KEY=<your-balldontlie-api-key>  # OLD (Free tier) ❌

# With your new paid tier key
BALLDONTLIE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  # NEW (Paid tier) ✅
```

#### Step 5: Verify Access

Run the verification script:

```bash
npx tsx test-balldontlie-access.ts
```

**Expected output:**
```
✅ READY FOR DFS PROJECTIONS
Your paid plan includes /stats endpoint access!

Sample stats data:
{
  "id": 12345,
  "pts": 28,
  "reb": 7,
  "ast": 5,
  ...
}
```

If you still see `401 Unauthorized`, you're using the wrong key or haven't upgraded yet.

---

## 2. The Odds API Key (Optional but Recommended)

### Why You Need It
Real-time betting lines enhance DFS projections by providing game environment context (totals, spreads).

### Pricing
- **FREE:** 500 requests/month (sufficient for MVP)
- **Paid:** $89/month (unlimited)

### Setup

1. Get key: https://the-odds-api.com/
2. Add to `.env`:
```bash
ODDS_API_KEY=your_odds_api_key_here
```

### Already Configured
Your current key: `<your-odds-api-key>` ✅

---

## 3. Apify Token (For Actor Deployment)

### Why You Need It
Deploy SportIntel MCP as an Apify Actor for the challenge.

### Pricing
- **FREE:** 5,000 compute units/month ✅

### Setup

1. Get token: https://console.apify.com
2. Navigate to: **Settings → Integrations → API Token**
3. Add to `.env`:
```bash
APIFY_TOKEN=<your-apify-api-token>
```

### Already Configured
Your current token: `<your-apify-api-token>` ✅

---

## Complete .env Configuration

```bash
# API Keys
BALLDONTLIE_API_KEY=<your-balldontlie-api-key>  # ⚠️ UPGRADE THIS!
ODDS_API_KEY=<your-odds-api-key>              # ✅ Working
APIFY_TOKEN=<your-apify-api-token>  # ✅ Working

# Data Sources
BALLDONTLIE_API_URL=https://api.balldontlie.io/v1
ODDS_API_URL=https://api.the-odds-api.com/v4

# Model Configuration
MODEL_PATH=./models/xgboost_nba_projections.json
ENABLE_SHAP=true
CONFIDENCE_THRESHOLD=0.7

# Rate Limiting (Update to 600 if you get GOAT tier)
BALLDONTLIE_RATE_LIMIT=60  # Change to 600 for GOAT tier
```

---

## Troubleshooting

### Problem: "401 Unauthorized" on /stats

**Causes:**
1. Using FREE tier API key
2. Upgraded plan but didn't generate new API key
3. Wrong key in .env file

**Solutions:**
1. Verify plan at https://app.balldontlie.io/account
2. Generate NEW API key after upgrading
3. Double-check .env has `BALLDONTLIE_API_KEY` (not `BALLDONTLIE_API_URL`)

### Problem: Endpoints work locally but fail in Apify Actor

**Cause:** Environment variable not set in Apify Console

**Solution:**
1. Go to: https://console.apify.com/actors/YOUR_ACTOR_ID/settings
2. Scroll to **"Environment variables"**
3. Add:
   - Name: `BALLDONTLIE_API_KEY`
   - Value: Your paid API key
   - Secret: ✅ Checked
4. Save and redeploy

---

## Testing Your Configuration

### Local Testing
```bash
# Comprehensive test
npx tsx test-balldontlie-access.ts

# Quick manual test
curl -H "Authorization: YOUR_KEY" \
  "https://api.balldontlie.io/v1/stats?per_page=1"
```

**Expected:** JSON data, not "Unauthorized"

### Apify Actor Testing
```bash
./test-actor-api.sh
```

Or via console: https://console.apify.com/actors/OdaJN92JUkidz02uv

---

## Cost Analysis

| Item | Tier | Cost/Month |
|------|------|-----------|
| BallDontLie | GOAT | $39.99 |
| The Odds API | FREE | $0 |
| Apify | FREE | $0 |
| **TOTAL** | | **$39.99** |

**Apify Challenge Prize:** $600-$2000 (based on MAU)
**Break-even:** 40 monthly active users
**Upside:** 15x-50x return if you win

---

## Next Steps

1. ✅ You already have Odds API and Apify configured
2. ⚠️ **ACTION REQUIRED:** Upgrade BallDontLie to GOAT tier
3. ⚠️ **ACTION REQUIRED:** Generate new paid API key
4. ⚠️ **ACTION REQUIRED:** Update .env with new key
5. ✅ Run `npx tsx test-balldontlie-access.ts` to verify
6. ✅ Deploy to Apify with new key

Once step 2-4 are complete, you'll be ready to build real DFS projections!

---

**Need Help?**
- BallDontLie Support: support@balldontlie.io
- Test Results: See `balldontlie-access-report.json`
- Verification Script: `test-balldontlie-access.ts`
