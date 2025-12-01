#!/usr/bin/env node
/**
 * Test Player Projections Tool with Real Data
 */

import dotenv from "dotenv";
dotenv.config(); // Load .env file

import { PlayerProjectionsTool } from "./src/tools/player-projections.js";

async function main() {
  console.log('='.repeat(60));
  console.log('🏀 Testing Player Projections Tool');
  console.log('='.repeat(60));
  console.log();

  const tool = new PlayerProjectionsTool();

  try {
    console.log('Fetching NBA projections for today\'s main slate...');
    console.log();

    const result = await tool.execute({
      sport: "NBA",
      slate: "main",
      includeExplanations: true,
      minSalary: 5000, // Filter to relevant players
    });

    console.log('✅ SUCCESS! Projection Results:');
    console.log('='.repeat(60));
    console.log();

    console.log(`Sport: ${result.sport}`);
    console.log(`Slate: ${result.slate}`);
    console.log(`Date: ${result.date}`);
    console.log(`Total Players: ${result.projections.length}`);
    console.log();

    console.log('Top 10 Value Plays:');
    console.log('-'.repeat(60));

    result.projections.slice(0, 10).forEach((player, idx) => {
      console.log(`\n${idx + 1}. ${player.playerName} (${player.team} - ${player.position})`);
      console.log(`   Salary: $${player.salary.toLocaleString()}`);
      console.log(`   Projected: ${player.projectedPoints} FP`);
      console.log(`   Range: ${player.floor} - ${player.ceiling}`);
      console.log(`   Value: ${player.value} pts/$1K`);
      console.log(`   Confidence: ${(player.confidence * 100).toFixed(0)}%`);
      console.log(`   Est. Ownership: ${player.ownership.toFixed(1)}%`);

      if (player.explanation) {
        console.log(`   Reasoning: ${player.explanation.reasoning.substring(0, 120)}...`);
      }
    });

    console.log();
    console.log('='.repeat(60));
    console.log('Metadata:');
    console.log(`  Model Version: ${result.metadata.modelVersion}`);
    console.log(`  Data Sources: ${result.metadata.dataSourcesUsed.join(', ')}`);
    console.log(`  Generated At: ${new Date(result.metadata.generatedAt).toLocaleTimeString()}`);
    console.log();

    console.log('='.repeat(60));
    console.log('✅ Player Projections Tool is working correctly!');
    console.log('✅ BallDontLie GOAT tier integration successful!');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('❌ Error testing projections:', error.message);
    console.error();
    console.error('Full error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
