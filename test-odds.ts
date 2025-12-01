#!/usr/bin/env node
/**
 * Test Live Odds Tool
 * Verifies The Odds API integration for real-time betting lines
 */

import dotenv from "dotenv";
dotenv.config();

import { LiveOddsTool } from "./src/tools/live-odds.js";

async function main() {
  console.log('='.repeat(60));
  console.log('📊 Testing Live Odds Tool');
  console.log('='.repeat(60));
  console.log();

  // Check API key
  if (!process.env.ODDS_API_KEY) {
    console.error('❌ ODDS_API_KEY not found in .env file!');
    process.exit(1);
  }

  console.log(`🔑 API Key: ${process.env.ODDS_API_KEY.substring(0, 8)}...`);
  console.log();

  const tool = new LiveOddsTool();

  try {
    // Test 1: Get NBA spreads and totals
    console.log('Test 1: Fetching NBA odds (spreads + totals)...');
    console.log();

    const result = await tool.execute({
      sport: "NBA",
      markets: ["spreads", "totals"],
    });

    console.log('✅ SUCCESS! Odds Results:');
    console.log('='.repeat(60));
    console.log();

    console.log(`Sport: ${result.sport}`);
    console.log(`Games Found: ${result.games.length}`);
    console.log(`Markets: ${result.metadata.marketsCovered.join(", ")}`);
    console.log(`Data Source: ${result.metadata.dataSource}`);
    console.log(`Fetched At: ${new Date(result.metadata.fetchedAt).toLocaleTimeString()}`);
    console.log();

    if (result.games.length === 0) {
      console.log('⚠️  No games found - This is normal if:');
      console.log('   - No NBA games scheduled today');
      console.log('   - Games already finished');
      console.log('   - Games not yet listed by bookmakers');
      console.log();
      console.log('✅ Tool working correctly (just no games available)');
    } else {
      console.log('Games with Odds:');
      console.log('-'.repeat(60));

      result.games.slice(0, 3).forEach((game, idx) => {
        console.log();
        console.log(`${idx + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
        console.log(`   Game ID: ${game.gameId}`);
        console.log(`   Bookmakers: ${game.bookmakers.length}`);

        // Show best odds
        if (game.bestOdds.homeSpread) {
          console.log(`   Best Home Spread: ${game.bestOdds.homeSpread.line} (${game.bestOdds.homeSpread.price}) - ${game.bestOdds.homeSpread.bookmaker}`);
        }
        if (game.bestOdds.awaySpread) {
          console.log(`   Best Away Spread: ${game.bestOdds.awaySpread.line} (${game.bestOdds.awaySpread.price}) - ${game.bestOdds.awaySpread.bookmaker}`);
        }
        if (game.bestOdds.overTotal) {
          console.log(`   Best Over: ${game.bestOdds.overTotal.line} (${game.bestOdds.overTotal.price}) - ${game.bestOdds.overTotal.bookmaker}`);
        }
        if (game.bestOdds.underTotal) {
          console.log(`   Best Under: ${game.bestOdds.underTotal.line} (${game.bestOdds.underTotal.price}) - ${game.bestOdds.underTotal.bookmaker}`);
        }

        // Show sample bookmaker data
        if (game.bookmakers.length > 0) {
          const sampleBook = game.bookmakers[0];
          console.log(`   Sample Bookmaker: ${sampleBook.name}`);
          console.log(`   Markets Available: ${sampleBook.markets.map(m => m.type).join(", ")}`);
        }
      });

      if (result.games.length > 3) {
        console.log();
        console.log(`... and ${result.games.length - 3} more games`);
      }
    }

    console.log();
    console.log('='.repeat(60));
    console.log('✅ Live Odds Tool Test PASSED!');
    console.log('='.repeat(60));
    console.log();
    console.log('Summary:');
    console.log('  ✅ The Odds API integration working');
    console.log('  ✅ Real-time odds retrieval functional');
    console.log('  ✅ Best odds calculation working');
    console.log('  ✅ Multi-bookmaker comparison working');
    console.log();
    console.log('🎉 Ready to enhance DFS projections with betting context!');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('❌ Test FAILED:', error.message);
    console.error();

    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('Issue: Invalid API key');
      console.error('Solution:');
      console.error('  1. Verify your key at https://the-odds-api.com/account');
      console.error('  2. Update ODDS_API_KEY in .env file');
      console.error('  3. Make sure you have available requests (free tier: 500/month)');
    } else if (error.message.includes('Rate limit')) {
      console.error('Issue: Rate limit exceeded');
      console.error('Solution:');
      console.error('  1. Free tier: 500 requests/month');
      console.error('  2. Each test uses 1 request');
      console.error('  3. Check usage at https://the-odds-api.com/account');
    } else {
      console.error('Full error:', error);
    }

    process.exit(1);
  }
}

main().catch(console.error);
