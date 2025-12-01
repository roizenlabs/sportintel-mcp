/**
 * Tool Input/Output Schemas
 */

import { z } from "zod";
import type { Sport, SlateType, Position } from "./sports.js";

// ============================================
// PLAYER PROJECTIONS TOOL
// ============================================

export const PlayerProjectionsInputSchema = z.object({
  sport: z.enum(["NBA", "NFL", "MLB", "NHL"]),
  slate: z.enum(["main", "early", "afternoon", "evening", "showdown"]).default("main"),
  date: z.string().datetime().optional(), // ISO 8601 date, defaults to today
  includeExplanations: z.boolean().default(true),
  minSalary: z.number().optional(),
  maxSalary: z.number().optional(),
  positions: z.array(z.string()).optional(), // Filter by positions
  maxPlayers: z.number().default(50), // Limit number of players for performance
});

export type PlayerProjectionsInput = z.infer<typeof PlayerProjectionsInputSchema>;

export interface PlayerProjectionsOutput {
  sport: Sport;
  slate: SlateType;
  date: string;
  projections: Array<{
    playerId: string;
    playerName: string;
    team: string;
    position: Position;
    salary: number;
    projectedPoints: number;
    floor: number;
    ceiling: number;
    confidence: number;
    value: number;
    ownership: number;
    explanation?: {
      topFactors: Array<{
        factor: string;
        impact: number;
        description: string;
      }>;
      reasoning: string;
      shapValues?: Record<string, number>;
    };
  }>;
  metadata: {
    modelVersion: string;
    lastTrained: string;
    dataSourcesUsed: string[];
    generatedAt: string;
  };
}

// ============================================
// LINEUP OPTIMIZER TOOL
// ============================================

export const LineupOptimizerInputSchema = z.object({
  sport: z.enum(["NBA", "NFL", "MLB", "NHL"]),
  projections: z.array(z.object({
    playerId: z.string(),
    projectedPoints: z.number(),
  })),
  salaryCap: z.number(),
  lineupCount: z.number().min(1).max(150).default(10),
  strategy: z.enum(["cash", "tournament", "balanced"]).default("balanced"),
  constraints: z.object({
    maxPlayersPerTeam: z.number().optional(),
    requiredPlayers: z.array(z.string()).optional(),
    excludedPlayers: z.array(z.string()).optional(),
    preferStacks: z.boolean().default(false),
    minUniqueOwnership: z.number().optional(),
  }).optional(),
});

export type LineupOptimizerInput = z.infer<typeof LineupOptimizerInputSchema>;

export interface LineupOptimizerOutput {
  lineups: Array<{
    rank: number;
    players: Array<{
      playerId: string;
      playerName: string;
      position: Position;
      salary: number;
      projectedPoints: number;
    }>;
    totalSalary: number;
    salaryCap: number;
    salaryRemaining: number;
    projectedPoints: number;
    expectedValue: number;
    riskScore: number;
    estimatedOwnership: number;
    stacks: Array<{
      type: string;
      players: string[];
    }>;
  }>;
  optimizationStats: {
    strategy: string;
    uniquePlayersUsed: number;
    averageOwnership: number;
    generatedAt: string;
  };
}

// ============================================
// LIVE ODDS TOOL
// ============================================

export const LiveOddsInputSchema = z.object({
  sport: z.enum(["NBA", "NFL", "MLB", "NHL"]),
  gameIds: z.array(z.string()).optional(), // If omitted, returns all upcoming
  markets: z.array(z.enum(["spreads", "totals", "h2h", "player_props"])).default(["spreads", "totals"]),
  bookmakers: z.array(z.string()).optional(), // Filter by sportsbook
});

export type LiveOddsInput = z.infer<typeof LiveOddsInputSchema>;

export interface LiveOddsOutput {
  sport: Sport;
  games: Array<{
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    gameTime: string;
    bookmakers: Array<{
      name: string;
      markets: Array<{
        type: "spreads" | "totals" | "h2h" | "player_props";
        outcomes: Array<{
          name: string;
          price: number;
          point?: number;
        }>;
        lastUpdate: string;
      }>;
    }>;
    bestOdds: {
      homeSpread?: { line: number; price: number; bookmaker: string };
      awaySpread?: { line: number; price: number; bookmaker: string };
      overTotal?: { line: number; price: number; bookmaker: string };
      underTotal?: { line: number; price: number; bookmaker: string };
    };
  }>;
  metadata: {
    fetchedAt: string;
    dataSource: string;
    marketsCovered: string[];
  };
}

// ============================================
// EXPLAIN RECOMMENDATION TOOL
// ============================================

export const ExplainRecommendationInputSchema = z.object({
  playerId: z.string(),
  sport: z.enum(["NBA", "NFL", "MLB", "NHL"]),
  explainerType: z.enum(["shap", "lime", "feature_importance"]).default("shap"),
  includeVisualizations: z.boolean().default(false),
});

export type ExplainRecommendationInput = z.infer<typeof ExplainRecommendationInputSchema>;

export interface ExplainRecommendationOutput {
  playerId: string;
  playerName: string;
  projectedPoints: number;
  explanation: {
    method: "shap" | "lime" | "feature_importance";
    topFactors: Array<{
      feature: string;
      value: number;
      impact: number;
      direction: "positive" | "negative";
      humanReadable: string;
    }>;
    baseValue: number;
    predictionValue: number;
    reasoning: string;
  };
  visualizations?: {
    waterfallPlot?: string; // Base64 encoded image
    forceplot?: string;
  };
  confidence: number;
  generatedAt: string;
}
