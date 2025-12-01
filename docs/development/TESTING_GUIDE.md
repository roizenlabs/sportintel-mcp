# Testing Your Apify Actor

## 🧪 Quick Test Guide

Your Actor is deployed! Let's verify it works correctly.

---

## Method 1: Web Console Test (Easiest)

### Step 1: Open Actor Console
```
https://console.apify.com/actors/OdaJN92JUkidz02uv
```

### Step 2: Click "Try it" or "Start"

### Step 3: Use This Input
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

### Step 4: Click "Start"

### Step 5: Wait for Results
- Status should change to "RUNNING" → "SUCCEEDED"
- Time: 10-30 seconds
- Check the "Dataset" tab for results

### Expected Output
```json
{
  "sport": "NBA",
  "slate": "main",
  "date": "2025-11-23...",
  "projections": [
    {
      "playerName": "Player Name",
      "team": "TEAM",
      "position": "PG",
      "salary": 9500,
      "projectedPoints": 45.2,
      "floor": 36.2,
      "ceiling": 54.2,
      "value": 4.76,
      "ownership": 15.3,
      "confidence": 0.9
    }
    // ... more players
  ]
}
```

---

## Method 2: Command Line Test

### Using the Test Script
```bash
cd /home/roizen/projects/sportintel-mcp
./test-actor.sh
```

This will:
1. Test player projections
2. Test live odds
3. Show results in terminal

---

## Method 3: Apify CLI Test

### Single Test
```bash
apify call OdaJN92JUkidz02uv --input '{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {"sport": "NBA"}
}' --wait-for-finish
```

### View Last Run
```bash
apify runs ls --actor OdaJN92JUkidz02uv
```

---

## 🎯 Test All 4 Tools

### Test 1: Player Projections ✅
```json
{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "slate": "main",
    "minSalary": 5000,
    "maxSalary": 12000
  }
}
```

**Expected**: 100+ players with salaries $5K-$12K

### Test 2: Lineup Optimizer ✅
```json
{
  "mode": "batch",
  "tool": "optimize_lineup",
  "arguments": {
    "sport": "NBA",
    "projections": [],
    "strategy": "tournament",
    "lineupCount": 5
  }
}
```

**Note**: You'll need to provide projections from Test 1
**Expected**: 5 optimized lineups

### Test 3: Live Odds ✅
```json
{
  "mode": "batch",
  "tool": "get_live_odds",
  "arguments": {
    "sport": "NBA",
    "markets": ["spreads", "totals"]
  }
}
```

**Expected**: Current NBA game odds from multiple books
**Note**: Requires ODDS_API_KEY environment variable

### Test 4: Explain Recommendation ✅
```json
{
  "mode": "batch",
  "tool": "explain_recommendation",
  "arguments": {
    "playerName": "LeBron James",
    "method": "shap"
  }
}
```

**Expected**: SHAP explanation for the player

---

## ✅ Success Criteria

Your Actor is working if:

- [ ] Status shows "SUCCEEDED" (not FAILED)
- [ ] Run completes in <60 seconds
- [ ] Dataset contains data (not empty)
- [ ] No error messages in logs
- [ ] Player count > 50 (for NBA projections)
- [ ] Salaries are realistic ($3K-$12K range)

---

## ❌ Troubleshooting

### Issue: Actor FAILED

**Check:**
1. View logs in "Log" tab
2. Look for error messages
3. Common issues:
   - API rate limits (wait 1 minute)
   - No games today (try different date)
   - Missing environment variables

### Issue: Empty Dataset

**Causes:**
- No NBA games scheduled today
- API returned no data
- Filters too restrictive (minSalary too high)

**Solution:**
- Remove salary filters
- Check if there are games today
- Try different date parameter

### Issue: Mock Salaries Returned

**Explanation:**
- If real APIs fail, system falls back to mock data
- Mock salaries are estimates, not real

**How to Tell:**
- Only 10-20 players instead of 200+
- Same salaries every time
- Players like "LeBron James" = $9500 always

**Fix:**
- Set `ROTOGRINDERS_API_KEY` environment variable
- Or wait for DraftKings API (no key needed)

---

## 📊 Performance Benchmarks

### Normal Performance

| Metric | Expected | Actual |
|--------|----------|--------|
| Cold start | 5-10 sec | ? |
| Run time (projections) | 10-30 sec | ? |
| Players returned | 150-250 | ? |
| Memory usage | <512 MB | ? |
| Success rate | >95% | ? |

### Fill in "Actual" after testing!

---

## 🎬 Record Your Test

**For Apify Store submission**, you'll want:

1. **Screenshot of Input**
   - Show the configuration form
   - Highlight the 4 tools

2. **Screenshot of Running**
   - Show status = "RUNNING"
   - Show progress

3. **Screenshot of Results**
   - Show Dataset with players
   - Highlight key fields

4. **Screenshot of Success**
   - Show status = "SUCCEEDED"
   - Show run duration

---

## 📝 Test Report Template

After testing, fill this out:

```
Test Date: _______________
Tester: _______________

Test 1: Player Projections
- Status: SUCCEEDED / FAILED
- Duration: ___ seconds
- Players returned: ___
- Issues: _______________

Test 2: Lineup Optimizer
- Status: SUCCEEDED / FAILED
- Duration: ___ seconds
- Lineups generated: ___
- Issues: _______________

Test 3: Live Odds
- Status: SUCCEEDED / FAILED
- Duration: ___ seconds
- Games found: ___
- Issues: _______________

Test 4: Explain Recommendation
- Status: SUCCEEDED / FAILED
- Duration: ___ seconds
- Explanation quality: ___
- Issues: _______________

Overall Assessment: PASS / FAIL
Ready for Store: YES / NO

Notes:
_______________
_______________
```

---

## 🚀 Next Steps After Testing

If all tests pass:

1. ✅ Mark "Test Actor" as complete
2. ✅ Create visual assets (screenshots from tests!)
3. ✅ Submit to Apify Store
4. ✅ Configure pricing
5. ✅ Monitor first users

If tests fail:

1. ❌ Review logs
2. ❌ Fix issues
3. ❌ Re-deploy (`apify push`)
4. ❌ Test again

---

## 📞 Need Help?

**Can't get it to work?**

1. Check logs in Apify Console
2. Review `APIFY_DEPLOYED.md` for config
3. Ask in Apify Discord
4. Open GitHub issue

**Actor works but want to improve?**

1. Review `PHASE2_COMPLETED.md` for enhancements
2. See `APIFY_STORE_SUBMISSION.md` for next steps
3. Check todo list for remaining features

---

**Ready to test?** → https://console.apify.com/actors/OdaJN92JUkidz02uv

**Good luck!** 🎉
