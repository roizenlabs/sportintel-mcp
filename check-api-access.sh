#!/bin/bash
# Check BallDontLie API access levels

API_KEY="${BALLDONTLIE_API_KEY:-your-api-key-here}"

echo "Testing BallDontLie API Access..."
echo "=================================="
echo ""

echo "1. Testing /players endpoint (FREE tier):"
PLAYERS_RESPONSE=$(curl -s -H "Authorization: $API_KEY" "https://api.balldontlie.io/v1/players?per_page=1")
if echo "$PLAYERS_RESPONSE" | grep -q "first_name"; then
  echo "   ✅ SUCCESS - Players endpoint works"
else
  echo "   ❌ FAILED - $PLAYERS_RESPONSE"
fi
echo ""

echo "2. Testing /games endpoint (FREE tier):"
GAMES_RESPONSE=$(curl -s -H "Authorization: $API_KEY" "https://api.balldontlie.io/v1/games?per_page=1")
if echo "$GAMES_RESPONSE" | grep -q "home_team"; then
  echo "   ✅ SUCCESS - Games endpoint works"
else
  echo "   ❌ FAILED - $GAMES_RESPONSE"
fi
echo ""

echo "3. Testing /stats endpoint (PAID tier - ALL-STAR):"
STATS_RESPONSE=$(curl -s -H "Authorization: $API_KEY" "https://api.balldontlie.io/v1/stats?per_page=1")
if echo "$STATS_RESPONSE" | grep -q "Unauthorized"; then
  echo "   ❌ FAILED - Still unauthorized (plan not active yet?)"
  echo "   Response: $STATS_RESPONSE"
elif echo "$STATS_RESPONSE" | grep -q "\"data\""; then
  echo "   ✅ SUCCESS - Stats endpoint works! 🎉"
else
  echo "   ⚠️  UNKNOWN - $STATS_RESPONSE"
fi
echo ""

echo "=================================="
echo "If stats endpoint still fails, wait 5-10 minutes for plan upgrade to activate."
echo "Then run this script again: ./check-api-access.sh"
