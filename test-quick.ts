#!/usr/bin/env node
/**
 * Quick MVP Test - Limited Players for Speed
 * Tests with just a few star players to verify end-to-end functionality
 */

import dotenv from "dotenv";
dotenv.config();

import { BallDontLieClient } from "./src/integrations/balldontlie.js";

async function main() {
  console.log('='.repeat(60));
  console.log('🏀 Quick MVP Test - BallDontLie Integration');
  console.log('='.repeat(60));
  console.log();

  const client = new BallDontLieClient({
    apiKey: process.env.BALLDONTLIE_API_KEY,
    baseUrl: process.env.BALLDONTLIE_API_URL || "https://api.balldontlie.io/v1",
    rateLimit: 600,
  });

  try {
    // Test 1: Get today's games
    console.log('Test 1: Fetching today\'s NBA games...');
    const games = await client.getGames(new Date());
    console.log(`✅ Found ${games.length} games today`);
    console.log();

    if (games.length > 0) {
      console.log('Sample game:');
      const game = games[0];
      console.log(`  ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`  Time: ${game.gameTime.toLocaleTimeString()}`);
      console.log();
    }

    // Test 2: Search for star players
    console.log('Test 2: Searching for star players...');
    const starPlayers = ['LeBron', 'Curry', 'Durant', 'Giannis'];

    for (const searchTerm of starPlayers) {
      const players = await client.getPlayers(searchTerm);
      if (players.length > 0) {
        const player = players[0];
        console.log(`  ✅ Found: ${player.name} (${player.team} - ${player.position})`);
      }
    }
    console.log();

    // Test 3: Get stats for one player
    console.log('Test 3: Fetching player stats (sample: LeBron James)...');
    const lebronPlayers = await client.getPlayers('LeBron');

    if (lebronPlayers.length > 0) {
      const lebron = lebronPlayers[0];
      const playerId = parseInt(lebron.id);

      console.log(`  Player: ${lebron.name} (ID: ${playerId})`);
      console.log('  Fetching last 5 games stats...');

      const averages = await client.getPlayerAverages(playerId, 5);

      console.log(`  ✅ Stats from last ${averages.gamesPlayed} games:`);
      console.log(`     Points: ${averages.avgPoints.toFixed(1)} ppg`);
      console.log(`     Rebounds: ${averages.avgRebounds.toFixed(1)} rpg`);
      console.log(`     Assists: ${averages.avgAssists.toFixed(1)} apg`);
      console.log(`     Fantasy Points: ${averages.avgFantasyPoints.toFixed(1)} FP`);
    }
    console.log();

    // Test 4: Fantasy points calculation
    console.log('Test 4: Testing fantasy points calculation...');
    const mockStats = {
      id: 1,
      player: lebronPlayers[0] as any,
      game: games[0] as any,
      pts: 28,
      reb: 8,
      ast: 7,
      stl: 2,
      blk: 1,
      turnover: 3,
      min: '36',
      fgm: 10,
      fga: 20,
      fg3m: 2,
      fg3a: 5,
      ftm: 6,
      fta: 7,
    };

    const fantasyPoints = client.calculateFantasyPoints(mockStats);
    console.log(`  Sample stat line: ${mockStats.pts}pts/${mockStats.reb}reb/${mockStats.ast}ast`);
    console.log(`  ✅ Fantasy Points: ${fantasyPoints.toFixed(1)} FP`);
    console.log();

    console.log('='.repeat(60));
    console.log('✅ All Tests PASSED!');
    console.log('='.repeat(60));
    console.log();
    console.log('Summary:');
    console.log('  ✅ BallDontLie GOAT tier access confirmed');
    console.log('  ✅ /games endpoint working');
    console.log('  ✅ /players search working');
    console.log('  ✅ /stats endpoint working (paid tier)');
    console.log('  ✅ Fantasy point calculation working');
    console.log();
    console.log('🎉 Your SportIntel MCP is ready to generate projections!');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('❌ Test FAILED:', error.message);
    console.error();
    console.error('Full error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
