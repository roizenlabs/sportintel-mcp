# Verify BallDontLie Upgrade

Your upgrade to the paid plan (NFL access) might need a few steps to activate.

## Step 1: Check Your Dashboard

Go to: https://www.balldontlie.io/home (or wherever your API key dashboard is)

### Things to Check:

1. **Active Plan**: Does it show "ALL-STAR" or "GOAT" (not "FREE")?
2. **New API Key**: Did you get a new API key after upgrading?
3. **Activation Status**: Is there a message saying "pending activation"?

## Step 2: If You Got a New API Key

If the dashboard shows a different API key than `<your-balldontlie-api-key>`:

1. Copy the new API key
2. Update `.actor/actor.json`:
   ```json
   "environmentVariables": {
     "BALLDONTLIE_API_KEY": "YOUR_NEW_KEY_HERE"
   }
   ```
3. Redeploy: `apify push --force`

## Step 3: If Same API Key (Just Wait)

If it's the same key but plan shows as upgraded:
- Wait 5-10 minutes for changes to propagate
- Run: `./check-api-access.sh` to test
- Should see ✅ on stats endpoint once active

## Step 4: Current Status

**Test Results** (as of now):
```
✅ /players endpoint - WORKS
✅ /games endpoint - WORKS
❌ /stats endpoint - Still unauthorized
```

## Step 5: Test Manually

You can test directly in your browser or terminal:

```bash
# Replace YOUR_API_KEY with what's shown in dashboard
curl -H "Authorization: YOUR_API_KEY" \
  "https://api.balldontlie.io/v1/stats?per_page=1"
```

**Expected response (when working)**:
```json
{
  "data": [{
    "id": 123,
    "pts": 25,
    "reb": 10,
    ...
  }],
  "meta": {...}
}
```

## Common Issues

### Issue 1: Plan Not Active
**Symptom**: Dashboard still shows "FREE"
**Fix**: Check email for confirmation, or contact support

### Issue 2: Payment Pending
**Symptom**: Dashboard shows upgrade but payment processing
**Fix**: Wait for payment confirmation email

### Issue 3: Wrong API Key
**Symptom**: Old key still in use
**Fix**: Get new key from dashboard, update code

## Next Steps

1. Check your BallDontLie dashboard now
2. Report back what plan it shows
3. Check if there's a new API key
4. Let me know and I'll help update the code

---

**Quick Commands**:
```bash
# Test API access
./check-api-access.sh

# If you get a new key, update and redeploy
nano .actor/actor.json  # Update the key
apify push --force      # Deploy
```
