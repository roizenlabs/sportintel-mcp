# API Keys Setup Guide

## 🔑 Required API Keys

Your Actor needs API keys to fetch real data. Here's how to get them (all have FREE tiers!):

---

## 1. BallDontLie API (REQUIRED for NBA stats)

**What**: Free NBA player stats and game data
**Cost**: FREE tier available
**Required**: YES (Actor will fail without this)

### How to Get:

1. Go to: https://www.balldontlie.io/
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### Add to Apify:

1. Go to: https://console.apify.com/actors/OdaJN92JUkidz02uv/settings
2. Scroll to "Environment variables"
3. Click "Add environment variable"
4. Name: `BALLDONTLIE_API_KEY`
5. Value: `your_api_key_here`
6. Check "Secret" box
7. Click "Save"

---

## 2. The Odds API (Optional for live betting odds)

**What**: Live betting odds from 10+ sportsbooks
**Cost**: FREE tier - 500 requests/month
**Required**: NO (only needed for `get_live_odds` tool)

### How to Get:

1. Go to: https://the-odds-api.com/
2. Sign up for free tier
3. Go to dashboard
4. Copy your API key

### Add to Apify:

Same process as above, but use:
- Name: `ODDS_API_KEY`
- Value: `your_odds_api_key_here`

---

## 3. RotoGrinders API (Optional for additional DFS data)

**What**: DFS salaries and ownership projections
**Cost**: Has free tier
**Required**: NO (DraftKings API is used as fallback)

### How to Get:

1. Go to: https://rotogrinders.com/
2. Sign up for account
3. Request API access
4. Get your API key

### Add to Apify:

- Name: `ROTOGRINDERS_API_KEY`
- Value: `your_rotogrinders_key_here`

---

## ⚡ Quick Setup (Video Guide)

1. Open Actor Settings: https://console.apify.com/actors/OdaJN92JUkidz02uv/settings
2. Scroll to "Environment variables"
3. Add BALLDONTLIE_API_KEY (required)
4. Add ODDS_API_KEY (optional)
5. Add ROTOGRINDERS_API_KEY (optional)
6. Click "Save"
7. Test your Actor!

---

## 🧪 Test After Setup

Once you've added the BallDontLie API key:

1. Go to: https://console.apify.com/actors/OdaJN92JUkidz02uv
2. Click "Try it"
3. Use this input:
```json
{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA"
  }
}
```
4. Click "Start"
5. It should now succeed! ✅

---

## ❓ FAQ

### Q: Do I need all 3 API keys?

**A**: Only BALLDONTLIE_API_KEY is required. The others are optional.

### Q: Are these really free?

**A**: Yes! All three have free tiers:
- BallDontLie: Free (with rate limits)
- The Odds API: 500 requests/month free
- RotoGrinders: Free tier available

### Q: What happens if I don't add API keys?

**A**:
- Without BALLDONTLIE_API_KEY: Actor will fail with 401 error
- Without ODDS_API_KEY: `get_live_odds` tool won't work
- Without ROTOGRINDERS_API_KEY: Falls back to DraftKings API

### Q: Can I use my own API keys locally?

**A**: Yes! Create a `.env` file:
```bash
BALLDONTLIE_API_KEY=your_key
ODDS_API_KEY=your_key
ROTOGRINDERS_API_KEY=your_key
```

---

## 🔒 Security

- ✅ API keys are stored as **secrets** in Apify
- ✅ Never exposed in logs or responses
- ✅ Encrypted at rest
- ✅ Only accessible by your Actor

---

## 📊 Rate Limits

| API | Free Tier Limit | How to Avoid |
|-----|----------------|--------------|
| BallDontLie | 60 req/min | Caching (built-in) |
| Odds API | 500 req/month | Only call when needed |
| RotoGrinders | Varies | Use as fallback only |

---

## ✅ Checklist

- [ ] Signed up for BallDontLie
- [ ] Got BallDontLie API key
- [ ] Added key to Apify Actor settings
- [ ] Tested Actor (should succeed now!)
- [ ] (Optional) Added Odds API key
- [ ] (Optional) Added RotoGrinders key

---

## 🆘 Troubleshooting

### Error: "Request failed with status code 401"

**Cause**: Missing or invalid BALLDONTLIE_API_KEY

**Fix**:
1. Check you added the key correctly
2. Verify the key is active (check BallDontLie dashboard)
3. Make sure you clicked "Save" in Apify settings

### Error: "Rate limit exceeded"

**Cause**: Too many API calls

**Fix**:
1. Wait 1 minute
2. Caching is built-in, so this should be rare
3. Consider upgrading to paid tier if needed

---

## 📞 Need Help?

1. Check API provider documentation
2. Review Apify environment variables guide
3. Open GitHub issue
4. Ask in Apify Discord

---

**Ready to set up your keys?**

→ https://console.apify.com/actors/OdaJN92JUkidz02uv/settings

**Good luck!** 🚀
