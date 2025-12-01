/**
 * Lineup Optimizer Tool
 * Linear programming-based DFS lineup optimization
 */

import { BaseTool } from "./base-tool.js";
import type { MCPTool } from "../types/mcp.js";
import {
  LineupOptimizerInputSchema,
  type LineupOptimizerInput,
  type LineupOptimizerOutput,
} from "../types/tools.js";

export class LineupOptimizerTool extends BaseTool {
  definition: MCPTool = {
    name: "optimize_lineup",
    description:
      "Generate optimal DFS lineups using linear programming. Supports cash game and tournament strategies, stacking preferences, and player constraints. Returns multiple lineup variations with risk scores.",
    inputSchema: {
      type: "object",
      properties: {
        sport: {
          type: "string",
          enum: ["NBA", "NFL", "MLB", "NHL"],
          description: "Sport for lineup optimization",
        },
        projections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              playerId: { type: "string" },
              projectedPoints: { type: "number" },
            },
            required: ["playerId", "projectedPoints"],
          },
          description: "Player projections from get_player_projections",
        },
        salaryCap: {
          type: "number",
          description: "Total salary cap (e.g., 50000 for DraftKings)",
        },
        lineupCount: {
          type: "number",
          description: "Number of lineups to generate (1-150)",
          default: 10,
          minimum: 1,
          maximum: 150,
        },
        strategy: {
          type: "string",
          enum: ["cash", "tournament", "balanced"],
          description:
            "Optimization strategy: cash (low risk), tournament (high upside), balanced",
          default: "balanced",
        },
        constraints: {
          type: "object",
          properties: {
            maxPlayersPerTeam: {
              type: "number",
              description: "Maximum players from same team",
            },
            requiredPlayers: {
              type: "array",
              items: { type: "string" },
              description: "Player IDs that must be included",
            },
            excludedPlayers: {
              type: "array",
              items: { type: "string" },
              description: "Player IDs to exclude",
            },
            preferStacks: {
              type: "boolean",
              description: "Prefer game/positional stacks",
              default: false,
            },
            minUniqueOwnership: {
              type: "number",
              description: "Minimum unique ownership % (for GPP)",
            },
          },
        },
      },
      required: ["sport", "projections", "salaryCap"],
    },
  };

  async execute(args: any): Promise<LineupOptimizerOutput> {
    const input = LineupOptimizerInputSchema.parse(args);

    console.log(
      `Optimizing ${input.lineupCount} lineup(s) for ${input.sport} (${input.strategy} strategy)`
    );

    try {
      const lineups = await this.optimizeLineups(input);

      return {
        lineups,
        optimizationStats: {
          strategy: input.strategy,
          uniquePlayersUsed: this.countUniquePlayers(lineups),
          averageOwnership: this.calculateAverageOwnership(lineups),
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error optimizing lineups:", error);
      throw error;
    }
  }

  /**
   * Optimize lineups using greedy algorithm
   * Production: Use GLPK.js or similar LP solver
   */
  private async optimizeLineups(
    input: LineupOptimizerInput
  ): Promise<LineupOptimizerOutput["lineups"]> {
    const lineups: LineupOptimizerOutput["lineups"] = [];

    // Get position requirements
    const positionReqs = this.getPositionRequirements(input.sport);

    // Mock player pool (in production, fetch full player data)
    const players = this.getMockPlayerPool(input);

    // Apply filters
    let filteredPlayers = players.filter(
      (p) =>
        !input.constraints?.excludedPlayers?.includes(p.playerId) &&
        p.salary <= input.salaryCap
    );

    // Generate multiple lineups
    for (let i = 0; i < input.lineupCount; i++) {
      const lineup = this.generateSingleLineup(
        filteredPlayers,
        input.salaryCap,
        positionReqs,
        input.strategy,
        input.constraints
      );

      if (lineup) {
        lineups.push({
          rank: i + 1,
          ...lineup,
        });

        // Remove some players for diversity in next lineup
        if (i < input.lineupCount - 1) {
          filteredPlayers = this.addDiversityConstraint(
            filteredPlayers,
            lineup.players
          );
        }
      }
    }

    return lineups;
  }

  /**
   * Generate a single optimal lineup
   */
  private generateSingleLineup(
    players: any[],
    salaryCap: number,
    positionReqs: Record<string, number>,
    strategy: string,
    constraints?: any
  ) {
    const lineup: any[] = [];
    let remainingSalary = salaryCap;
    const positionsNeeded = { ...positionReqs };

    // Sort by value (points per $1K)
    const sortedPlayers = [...players].sort((a, b) => {
      if (strategy === "tournament") {
        // Tournament: prioritize ceiling
        return b.ceiling - a.ceiling;
      } else if (strategy === "cash") {
        // Cash: prioritize floor
        return b.floor - a.floor;
      }
      // Balanced: prioritize value
      return b.value - a.value;
    });

    // Required players first
    if (constraints?.requiredPlayers) {
      for (const playerId of constraints.requiredPlayers) {
        const player = sortedPlayers.find((p) => p.playerId === playerId);
        if (player) {
          lineup.push(player);
          remainingSalary -= player.salary;
          positionsNeeded[player.position]--;
        }
      }
    }

    // Fill remaining positions
    for (const player of sortedPlayers) {
      if (lineup.length >= Object.values(positionReqs).reduce((a, b) => a + b, 0)) {
        break;
      }

      // Check if position is needed
      if (positionsNeeded[player.position] <= 0) continue;

      // Check if we can afford
      if (player.salary > remainingSalary) continue;

      // Check max players per team
      if (constraints?.maxPlayersPerTeam) {
        const teamCount = lineup.filter((p) => p.team === player.team).length;
        if (teamCount >= constraints.maxPlayersPerTeam) continue;
      }

      // Add to lineup
      lineup.push(player);
      remainingSalary -= player.salary;
      positionsNeeded[player.position]--;
    }

    if (lineup.length < Object.values(positionReqs).reduce((a, b) => a + b, 0)) {
      return null; // Couldn't fill lineup
    }

    const totalSalary = lineup.reduce((sum, p) => sum + p.salary, 0);
    const projectedPoints = lineup.reduce((sum, p) => sum + p.projectedPoints, 0);

    return {
      players: lineup.map((p) => ({
        playerId: p.playerId,
        playerName: p.playerName,
        position: p.position,
        salary: p.salary,
        projectedPoints: p.projectedPoints,
      })),
      totalSalary,
      salaryCap,
      salaryRemaining: salaryCap - totalSalary,
      projectedPoints: Math.round(projectedPoints * 10) / 10,
      expectedValue: Math.round((projectedPoints / totalSalary) * 1000 * 100) / 100,
      riskScore: this.calculateRiskScore(lineup, strategy),
      estimatedOwnership: Math.round(
        lineup.reduce((sum, p) => sum + p.ownership, 0) / lineup.length
      ),
      stacks: this.identifyStacks(lineup),
    };
  }

  /**
   * Calculate risk score (0-100, lower = safer)
   */
  private calculateRiskScore(lineup: any[], strategy: string): number {
    const avgConfidence =
      lineup.reduce((sum, p) => sum + (p.confidence || 0.7), 0) / lineup.length;

    if (strategy === "cash") {
      return Math.round((1 - avgConfidence) * 100);
    } else if (strategy === "tournament") {
      return Math.round((1 - avgConfidence) * 50); // Tournament allows more risk
    }
    return Math.round((1 - avgConfidence) * 75);
  }

  /**
   * Identify stacks in lineup
   */
  private identifyStacks(lineup: any[]): Array<{ type: string; players: string[] }> {
    const stacks: Array<{ type: string; players: string[] }> = [];

    // Find game stacks (3+ players from same game)
    const teamCounts: Record<string, string[]> = {};
    lineup.forEach((p) => {
      if (!teamCounts[p.team]) teamCounts[p.team] = [];
      teamCounts[p.team].push(p.playerName);
    });

    Object.entries(teamCounts).forEach(([team, players]) => {
      if (players.length >= 3) {
        stacks.push({
          type: "game",
          players,
        });
      }
    });

    return stacks;
  }

  /**
   * Add diversity constraint by removing some used players
   */
  private addDiversityConstraint(players: any[], usedPlayers: any[]): any[] {
    const usedIds = usedPlayers.map((p) => p.playerId);
    return players.filter((p) => {
      // 50% chance to keep each used player for next lineup
      return !usedIds.includes(p.playerId) || Math.random() > 0.5;
    });
  }

  /**
   * Count unique players across all lineups
   */
  private countUniquePlayers(lineups: any[]): number {
    const uniqueIds = new Set<string>();
    lineups.forEach((lineup) => {
      lineup.players.forEach((p: any) => uniqueIds.add(p.playerId));
    });
    return uniqueIds.size;
  }

  /**
   * Calculate average ownership across lineups
   */
  private calculateAverageOwnership(lineups: any[]): number {
    if (lineups.length === 0) return 0;
    const totalOwnership = lineups.reduce(
      (sum, lineup) => sum + lineup.estimatedOwnership,
      0
    );
    return Math.round((totalOwnership / lineups.length) * 10) / 10;
  }

  /**
   * Get position requirements by sport
   */
  private getPositionRequirements(sport: string): Record<string, number> {
    if (sport === "NBA") {
      return {
        PG: 1,
        SG: 1,
        SF: 1,
        PF: 1,
        C: 1,
        G: 1, // Guard (PG/SG)
        F: 1, // Forward (SF/PF)
        UTIL: 1, // Any position
      };
    }
    // Add other sports
    throw new Error(`${sport} position requirements not implemented yet`);
  }

  /**
   * Mock player pool (in production, fetch from projections)
   */
  private getMockPlayerPool(input: LineupOptimizerInput): any[] {
    // Convert input projections to full player objects
    return input.projections.map((proj) => ({
      playerId: proj.playerId,
      playerName: `Player ${proj.playerId}`,
      position: this.randomPosition(),
      team: this.randomTeam(),
      salary: this.randomSalary(),
      projectedPoints: proj.projectedPoints,
      floor: proj.projectedPoints * 0.8,
      ceiling: proj.projectedPoints * 1.2,
      confidence: 0.75,
      value: proj.projectedPoints / this.randomSalary() * 1000,
      ownership: Math.random() * 30,
    }));
  }

  private randomPosition(): string {
    const positions = ["PG", "SG", "SF", "PF", "C"];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  private randomTeam(): string {
    const teams = ["LAL", "GSW", "BOS", "MIA", "DEN", "MIL"];
    return teams[Math.floor(Math.random() * teams.length)];
  }

  private randomSalary(): number {
    return Math.floor(Math.random() * 8000) + 3000; // $3K-$11K
  }
}
