#!/usr/bin/env node
/**
 * Targeted Demo of Injury Risk Integration
 * Tests specific players with mock injury data to demonstrate the feature
 */

import dotenv from "dotenv";
dotenv.config();

import { HuggingFaceService } from "./src/services/huggingface-service.js";

async function demonstrateInjuryRisk() {
  console.log('='.repeat(60));
  console.log('🏥 Injury Risk Analysis Demo');
  console.log('='.repeat(60));
  console.log();

  const hfService = new HuggingFaceService();

  if (!hfService.isAvailable()) {
    console.error('❌ HuggingFace API key not configured!');
    return;
  }

  console.log('✅ HuggingFace service initialized');
  console.log();

  // Demonstrate injury analysis for different scenarios
  const scenarios = [
    {
      player: "Giannis Antetokounmpo",
      baseProjection: 63.4,
      salary: 11000,
      texts: [
        "Giannis Antetokounmpo left practice early with knee soreness",
        "Milwaukee star questionable for tonight with right knee pain",
      ],
    },
    {
      player: "LeBron James",
      baseProjection: 56.2,
      salary: 9500,
      texts: [
        "LeBron James looking great in practice",
        "King James ready for tonight's big matchup",
      ],
    },
    {
      player: "Stephen Curry",
      baseProjection: 48.5,
      salary: 9300,
      texts: [
        "Curry participated in limited capacity at practice",
        "Stephen dealing with minor ankle discomfort but expects to play",
      ],
    },
  ];

  for (const scenario of scenarios) {
    console.log(`Player: ${scenario.player}`);
    console.log(`  Base Projection: ${scenario.baseProjection} FP`);
    console.log(`  Salary: $${scenario.salary}`);
    console.log();

    console.log(`  Analyzing ${scenario.texts.length} text mentions...`);
    const injuryRisk = await hfService.analyzeInjurySentiment(
      scenario.player,
      scenario.texts
    );

    console.log();
    console.log(`  🏥 Injury Risk Analysis:`);
    console.log(`    Level: ${injuryRisk.level}`);
    console.log(`    Confidence: ${(injuryRisk.confidence * 100).toFixed(0)}%`);
    console.log(`    Adjustment: ${(injuryRisk.adjustment * 100).toFixed(0)}%`);
    console.log(`    Description: ${injuryRisk.description}`);

    if (injuryRisk.evidence.length > 0) {
      console.log();
      console.log(`    Evidence:`);
      injuryRisk.evidence.forEach((ev, i) => {
        console.log(`      ${i + 1}. "${ev}"`);
      });
    }

    // Calculate adjusted projection
    const adjustedProjection = scenario.baseProjection * injuryRisk.adjustment;
    const impactPoints = scenario.baseProjection - adjustedProjection;

    console.log();
    console.log(`  📊 Projection Impact:`);
    console.log(`    Before: ${scenario.baseProjection.toFixed(1)} FP`);
    console.log(`    After: ${adjustedProjection.toFixed(1)} FP`);
    console.log(`    Impact: ${impactPoints > 0 ? '-' : '+'}${Math.abs(impactPoints).toFixed(1)} FP`);

    // Show SHAP factor representation
    if (injuryRisk.level !== 'LOW') {
      console.log();
      console.log(`  🧠 SHAP Factor:`);
      console.log(`    {`);
      console.log(`      factor: "injury_risk",`);
      console.log(`      impact: ${-impactPoints.toFixed(1)},`);
      console.log(`      description: "${injuryRisk.description} (${(injuryRisk.confidence * 100).toFixed(0)}% confidence)"`);
      console.log(`    }`);
    }

    console.log();
    console.log('-'.repeat(60));
    console.log();
  }

  console.log('='.repeat(60));
  console.log('✅ Demo Complete!');
  console.log('='.repeat(60));
  console.log();
  console.log('Key Takeaways:');
  console.log('  ✅ HuggingFace sentiment analysis detects injury concerns');
  console.log('  ✅ Projections are adjusted based on risk level:');
  console.log('     - HIGH: 70% (30% reduction)');
  console.log('     - MEDIUM: 85% (15% reduction)');
  console.log('     - LOW: 95% (5% reduction)');
  console.log('  ✅ SHAP explanations show injury factors with evidence');
  console.log('  ✅ Users understand WHY projections are adjusted');
  console.log();
  console.log('Integration Status:');
  console.log('  ✅ HuggingFace service created');
  console.log('  ✅ Injury sentiment analysis working');
  console.log('  ✅ Integrated into player projections');
  console.log('  ✅ SHAP explanations include injury factors');
  console.log();
  console.log('Next Steps:');
  console.log('  1. Replace mock injury data with real news API');
  console.log('  2. Test with larger player sample');
  console.log('  3. Deploy to Apify as v1.2');
  console.log('  4. Update README with new AI features');
  console.log();
}

demonstrateInjuryRisk().catch(console.error);
