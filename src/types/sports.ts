/**
 * Sports Data Models
 */

export type Sport = "NBA" | "NFL" | "MLB" | "NHL";
export type Position = "PG" | "SG" | "SF" | "PF" | "C" | "QB" | "RB" | "WR" | "TE" | "DST" | "K";
export type SlateType = "main" | "early" | "afternoon" | "evening" | "showdown";

export interface Player {
  id: string;
  name: string;
  team: string;
  position: Position;
  salary: number;
  sport: Sport;
  injuryStatus?: "out" | "questionable" | "probable" | "healthy";
  lastUpdate: Date;
}

export interface PlayerProjection {
  playerId: string;
  playerName: string;
  projectedPoints: number;
  floor: number;
  ceiling: number;
  confidence: number;
  value: number; // Projected points per $1000 salary
  ownership: number; // Estimated ownership %
  explainability: {
    topFactors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    reasoning: string;
  };
  lastUpdated: Date;
}

export interface Game {
  id: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  gameTime: Date;
  vegas: {
    spread: number;
    total: number;
    homeMoneyline: number;
    awayMoneyline: number;
  };
}

export interface Lineup {
  players: Player[];
  totalSalary: number;
  projectedPoints: number;
  expectedValue: number;
  riskScore: number; // 0-100, lower is safer
  ownership: number; // Estimated total ownership
  stacks: Array<{
    type: "game" | "qb-wr" | "rb-dst";
    players: string[];
  }>;
}

export interface OddsData {
  gameId: string;
  sport: Sport;
  bookmakers: Array<{
    name: string;
    markets: Array<{
      type: "spreads" | "totals" | "h2h" | "player_props";
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
      lastUpdate: Date;
    }>;
  }>;
}

export interface InjuryReport {
  playerId: string;
  playerName: string;
  team: string;
  status: "out" | "questionable" | "probable";
  injuryType: string;
  expectedReturn?: Date;
  impactedPlayers: Array<{
    playerId: string;
    playerName: string;
    valueChange: number; // % change in projected points
    reasoning: string;
  }>;
}

export interface LineupConstraints {
  maxSalary: number;
  sport: Sport;
  positions: Record<Position, number>; // Required count per position
  maxPlayersPerTeam?: number;
  requiredPlayers?: string[]; // Player IDs to lock in
  excludedPlayers?: string[]; // Player IDs to exclude
  stackPreferences?: {
    preferStacks: boolean;
    stackTypes: Array<"game" | "qb-wr" | "rb-dst">;
  };
  riskTolerance?: "low" | "medium" | "high"; // For cash vs tournament
  minUniqueOwnership?: number; // For tournament GPP
}
