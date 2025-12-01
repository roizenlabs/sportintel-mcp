#!/bin/bash
# Test the deployed Actor via Apify API

ACTOR_ID="OdaJN92JUkidz02uv"

echo "Testing SportIntel MCP Actor..."
echo "Actor ID: $ACTOR_ID"
echo ""
echo "Starting Actor run with NBA projections..."
echo ""

# Start an Actor run
apify call $ACTOR_ID --input '{
  "mode": "batch",
  "tool": "get_player_projections",
  "arguments": {
    "sport": "NBA"
  }
}'

echo ""
echo "Test completed!"
echo ""
echo "To view full results, visit:"
echo "https://console.apify.com/actors/$ACTOR_ID/runs"
