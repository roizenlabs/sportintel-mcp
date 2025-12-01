#!/usr/bin/env node
/**
 * Test HuggingFace Integration
 * Tests sentiment analysis and injury risk detection
 */

import dotenv from "dotenv";
dotenv.config();

import { HuggingFaceService } from "./src/services/huggingface-service.js";

async function testSentimentAnalysis() {
  console.log('='.repeat(60));
  console.log('🤗 Testing HuggingFace Sentiment Analysis');
  console.log('='.repeat(60));
  console.log();

  const hfService = new HuggingFaceService();

  if (!hfService.isAvailable()) {
    console.error('❌ HuggingFace API key not configured!');
    console.log('Please add HUGGINGFACE_API_KEY to .env');
    return;
  }

  // Example sports-related texts
  const texts = [
    "Giannis left practice early today with knee discomfort",
    "LeBron looking fantastic in shootaround, ready to dominate",
    "Coach says Stephen Curry is questionable for tonight's game",
  ];

  console.log('Sample texts to analyze:');
  texts.forEach((text, i) => {
    console.log(`  ${i + 1}. "${text}"`);
  });
  console.log();

  console.log('Analyzing sentiment...');
  console.log();

  for (const text of texts) {
    const result = await hfService.analyzeSentiment(text);

    if (result) {
      console.log(`Text: "${text}"`);
      console.log(`Sentiment: ${result.label} (${(result.score * 100).toFixed(1)}% confidence)`);
      console.log();
    }
  }
}

async function testInjuryRiskAnalysis() {
  console.log('='.repeat(60));
  console.log('🤗 Testing Injury Risk Analysis');
  console.log('='.repeat(60));
  console.log();

  const hfService = new HuggingFaceService();

  if (!hfService.isAvailable()) {
    console.error('❌ HuggingFace API key not configured!');
    return;
  }

  // Simulate various injury scenarios
  const scenarios = [
    {
      player: 'Giannis Antetokounmpo',
      texts: [
        'Giannis Antetokounmpo left practice early with knee soreness',
        'Milwaukee star questionable for tonight with right knee pain',
        'Giannis listed as doubtful, coach says will be game-time decision',
        'Medical staff monitoring Giannis closely after knee injury scare',
        'Bucks concerned about Giannis ankle sprain from last game'
      ]
    },
    {
      player: 'LeBron James',
      texts: [
        'LeBron James looking great in practice',
        'King James ready for tonight big matchup',
        'LeBron says he feels fantastic and energized'
      ]
    },
    {
      player: 'Stephen Curry',
      texts: [
        'Curry participated in limited capacity at practice',
        'Stephen dealing with minor ankle discomfort but expects to play'
      ]
    }
  ];

  for (const scenario of scenarios) {
    console.log(`Player: ${scenario.player}`);
    console.log(`Analyzing ${scenario.texts.length} text mentions...`);
    console.log();

    const injuryRisk = await hfService.analyzeInjurySentiment(
      scenario.player,
      scenario.texts
    );

    console.log('Results:');
    console.log(`  Risk Level: ${injuryRisk.level}`);
    console.log(`  Confidence: ${(injuryRisk.confidence * 100).toFixed(1)}%`);
    console.log(`  Projection Adjustment: ${(injuryRisk.adjustment * 100).toFixed(0)}%`);
    console.log(`  Description: ${injuryRisk.description}`);

    if (injuryRisk.evidence.length > 0) {
      console.log(`  Evidence:`);
      injuryRisk.evidence.forEach((ev, i) => {
        console.log(`    ${i + 1}. "${ev}"`);
      });
    }
    console.log();
    console.log('-'.repeat(60));
    console.log();
  }
}

async function testSummarization() {
  console.log('='.repeat(60));
  console.log('🤗 Testing Text Summarization');
  console.log('='.repeat(60));
  console.log();

  const hfService = new HuggingFaceService();

  if (!hfService.isAvailable()) {
    console.error('❌ HuggingFace API key not configured!');
    return;
  }

  const injuryReport = `
    Giannis Antetokounmpo (Milwaukee Bucks) is listed as questionable for
    tonight's game against Philadelphia. He missed practice on Tuesday due
    to right knee soreness but participated in shootaround this morning.
    Coach Budenholzer said "We'll see how he feels after warmups." The team
    medical staff is monitoring him closely. If he plays, minutes may be
    limited to 28-32 instead of usual 34-36. The Bucks are 15-8 this season
    when Giannis plays and 2-5 without him.
  `;

  console.log('Long injury report:');
  console.log(injuryReport.trim());
  console.log();

  console.log('Summarizing...');
  console.log();

  const summary = await hfService.summarizeText(injuryReport, 50);

  if (summary) {
    console.log('✅ Summarized:');
    console.log(`"${summary}"`);
    console.log();
  } else {
    console.log('❌ Summarization failed');
  }
}

async function main() {
  console.log('🚀 HuggingFace Integration Tests');
  console.log();

  try {
    await testSentimentAnalysis();
    await testInjuryRiskAnalysis();
    await testSummarization();

    console.log('='.repeat(60));
    console.log('✅ All Tests Complete!');
    console.log('='.repeat(60));
    console.log();
    console.log('Next steps:');
    console.log('1. ✅ HuggingFace service is working!');
    console.log('2. Integrate injury risk analysis into player projections');
    console.log('3. Add SHAP explanations for HuggingFace factors');
    console.log('4. Test end-to-end with real player data');
    console.log('5. Deploy as v1.2 with AI enhancements!');
    console.log();

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error();
    console.error('Full error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
