#!/usr/bin/env node
/**
 * BallDontLie API Access Verification Script
 * Tests which endpoints are accessible with your paid plan
 */

import axios from 'axios';
import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';

// Load environment variables from .env
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const match = line.match(/^BALLDONTLIE_API_KEY=(.*)$/);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (e) {
    console.error('Error reading .env file:', e);
  }
  return null;
}

const API_KEY = loadEnv();
const BASE_URL = 'https://api.balldontlie.io';

interface TestResult {
  endpoint: string;
  status: 'PASS' | 'FAIL' | 'RATE_LIMITED';
  statusCode?: number;
  message?: string;
  sampleData?: any;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  path: string,
  params: Record<string, any> = {}
): Promise<TestResult> {
  try {
    console.log(`Testing: ${name}...`);

    const response = await axios.get(`${BASE_URL}${path}`, {
      headers: {
        Authorization: API_KEY || '',
      },
      params: {
        per_page: 1, // Keep it minimal for testing
        ...params,
      },
      timeout: 10000,
    });

    const result: TestResult = {
      endpoint: `${path}`,
      status: 'PASS',
      statusCode: response.status,
      message: `✓ Success - Got ${response.data.data?.length || 'N/A'} records`,
      sampleData: response.data.data?.[0] || response.data,
    };

    console.log(`  ✓ ${result.message}`);
    return result;
  } catch (error: any) {
    const statusCode = error.response?.status;
    let status: 'FAIL' | 'RATE_LIMITED' = 'FAIL';
    let message = '✗ Failed';

    if (statusCode === 401) {
      message = '✗ Unauthorized (check API key)';
    } else if (statusCode === 403) {
      message = '✗ Forbidden (endpoint not in your plan)';
    } else if (statusCode === 429) {
      status = 'RATE_LIMITED';
      message = '⚠ Rate limited';
    } else if (statusCode === 404) {
      message = '✗ Not found';
    } else {
      message = `✗ ${error.message}`;
    }

    const result: TestResult = {
      endpoint: path,
      status,
      statusCode,
      message,
    };

    console.log(`  ${message}`);
    return result;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🏀 BallDontLie API Access Verification');
  console.log('='.repeat(60));
  console.log();

  if (!API_KEY) {
    console.error('❌ BALLDONTLIE_API_KEY not found in .env file!');
    process.exit(1);
  }

  console.log(`🔑 API Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
  console.log();

  // Test current season (2024-25)
  const currentSeason = 2024;

  console.log('📊 Testing NBA Endpoints');
  console.log('-'.repeat(60));

  // Core endpoints (should work on all plans)
  results.push(await testEndpoint('NBA Players', '/v1/players'));
  results.push(await testEndpoint('NBA Teams', '/v1/teams'));
  results.push(await testEndpoint('NBA Games', '/v1/games', {
    'seasons[]': currentSeason
  }));

  console.log();
  console.log('💰 Testing PAID Tier Endpoints');
  console.log('-'.repeat(60));

  // These require paid plan
  results.push(await testEndpoint('Player Stats (CRITICAL)', '/v1/stats', {
    'seasons[]': currentSeason
  }));

  results.push(await testEndpoint('Season Averages', '/v1/season_averages', {
    season: currentSeason,
  }));

  results.push(await testEndpoint('Box Scores', '/v1/box_scores'));

  results.push(await testEndpoint('Advanced Stats', '/v1/advanced_stats', {
    'seasons[]': currentSeason
  }));

  console.log();
  console.log('🏈 Testing Other Sports (if available)');
  console.log('-'.repeat(60));

  results.push(await testEndpoint('NFL Teams', '/v1/nfl/teams'));
  results.push(await testEndpoint('NFL Players', '/v1/nfl/players'));
  results.push(await testEndpoint('MLB Teams', '/v1/mlb/teams'));

  console.log();
  console.log('='.repeat(60));
  console.log('📋 Summary Report');
  console.log('='.repeat(60));
  console.log();

  const passed = results.filter(r => r.status === 'PASS');
  const failed = results.filter(r => r.status === 'FAIL');
  const rateLimited = results.filter(r => r.status === 'RATE_LIMITED');

  console.log(`✅ Passed: ${passed.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`⚠️  Rate Limited: ${rateLimited.length}`);
  console.log();

  if (failed.length > 0) {
    console.log('Failed Endpoints:');
    failed.forEach(r => {
      console.log(`  - ${r.endpoint}: ${r.message}`);
    });
    console.log();
  }

  // Critical check for DFS functionality
  const statsAccess = results.find(r => r.endpoint === '/v1/stats');

  console.log('='.repeat(60));
  console.log('🎯 DFS Integration Status');
  console.log('='.repeat(60));
  console.log();

  if (statsAccess?.status === 'PASS') {
    console.log('✅ READY FOR DFS PROJECTIONS');
    console.log('   Your paid plan includes /stats endpoint access!');
    console.log('   You can now build ML projections with real data.');
    console.log();
    console.log('Sample stats data:');
    console.log(JSON.stringify(statsAccess.sampleData, null, 2));
  } else {
    console.log('❌ NOT READY FOR DFS PROJECTIONS');
    console.log('   The /stats endpoint is required for projections.');
    console.log('   Status:', statsAccess?.message);
    console.log();
    console.log('Action Required:');
    console.log('   1. Verify your plan includes stats access');
    console.log('   2. Check API key is correctly set in .env');
    console.log('   3. Contact BallDontLie support if issue persists');
  }

  console.log();
  console.log('='.repeat(60));

  // Save detailed results
  const reportPath = './balldontlie-access-report.json';
  writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    apiKey: `${API_KEY.substring(0, 8)}...`,
    results,
    summary: {
      passed: passed.length,
      failed: failed.length,
      rateLimited: rateLimited.length,
      dfsReady: statsAccess?.status === 'PASS',
    }
  }, null, 2));

  console.log(`📄 Detailed report saved to: ${reportPath}`);
  console.log();
}

main().catch(console.error);
