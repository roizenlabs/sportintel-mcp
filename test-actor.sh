#!/bin/bash

# Test SportIntel-MCP Actor on Apify
# This script tests the deployed Actor to verify it works correctly

ACTOR_ID="OdaJN92JUkidz02uv"

echo "🧪 Testing SportIntel-MCP Actor on Apify..."
echo "Actor ID: $ACTOR_ID"
echo "=========================================="
echo ""

# Test 1: Get Player Projections (NBA)
echo "Test 1: Get NBA Player Projections"
echo "-----------------------------------"

apify call $ACTOR_ID --input '{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA",
    "slate": "main"
  }
}' --wait-for-finish

echo ""
echo "✅ Test 1 Complete!"
echo ""
echo "=========================================="
echo ""

# Test 2: Get Live Odds
echo "Test 2: Get Live Odds (NBA)"
echo "----------------------------"

apify call $ACTOR_ID --input '{
  "mode": "batch",
  "tool": "get_live_odds",
  "arguments": {
    "sport": "NBA",
    "markets": ["spreads", "totals"]
  }
}' --wait-for-finish

echo ""
echo "✅ Test 2 Complete!"
echo ""
echo "=========================================="
echo ""

echo "🎉 All tests complete!"
echo ""
echo "View results at: https://console.apify.com/actors/$ACTOR_ID/runs"
