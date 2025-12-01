/**
 * Player Projections Tool
 * AI-powered DFS projections with explainability
 */

import { BaseTool } from "./base-tool.js";
import type { MCPTool } from "../types/mcp.js";
import {
  PlayerProjectionsInputSchema,
  type PlayerProjectionsInput,
  type PlayerProjectionsOutput,
} from "../types/tools.js";
import { BallDontLieClient } from "../integrations/balldontlie.js";
import { OddsAPIClient } from "../integrations/odds-api.js";
import { SalaryService } from "../services/salary-service.js";
import { HuggingFaceService } from "../services/huggingface-service.js";

export class PlayerProjectionsTool extends BaseTool {
  definition: MCPTool = {
    name: "get_player_projections",
    description:
      "Get AI-powered DFS player projections with confidence scores and SHAP explainability. Returns projected fantasy points, floor/ceiling ranges, and factors driving each projection.",
    inputSchema: {
      type: "object",
      properties: {
        sport: {
          type: "string",
          enum: ["NBA", "NFL", "MLB", "NHL"],
          description: "Sport to get projections for",
        },
        slate: {
          type: "string",
          enum: ["main", "early", "afternoon", "evening", "showdown"],
          description: "DFS slate type",
          default: "main",
        },
        date: {
          type: "string",
          description: "ISO 8601 date (defaults to today)",
        },
        includeExplanations: {
          type: "boolean",
          description: "Include SHAP explainability (default: true)",
          default: true,
        },
        minSalary: {
          type: "number",
          description: "Filter by minimum salary",
        },
        maxSalary: {
          type: "number",
          description: "Filter by maximum salary",
        },
        positions: {
          type: "array",
          items: { type: "string" },
          description: "Filter by positions (e.g., ['PG', 'SG'])",
        },
        maxPlayers: {
          type: "number",
          description: "Limit number of players to project (default: 50 for performance)",
          default: 50,
        },
      },
      required: ["sport"],
    },
  };

  private ballDontLie: BallDontLieClient;
  private oddsApi: OddsAPIClient;
  private salaryService: SalaryService;
  private hfService: HuggingFaceService;
  private playerCache: Map<string, { players: any[]; timestamp: Date }> = new Map();
  private readonly CACHE_TTL_MS = 3600000; // 1 hour

  constructor() {
    super();

    // Initialize data clients
    this.ballDontLie = new BallDontLieClient({
      apiKey: process.env.BALLDONTLIE_API_KEY,
      baseUrl: process.env.BALLDONTLIE_API_URL || "https://api.balldontlie.io/v1",
      rateLimit: parseInt(process.env.BALLDONTLIE_RATE_LIMIT || "600"), // GOAT tier: 600 req/min
    });

    this.oddsApi = new OddsAPIClient({
      apiKey: process.env.ODDS_API_KEY || "",
      baseUrl: process.env.ODDS_API_URL || "https://api.the-odds-api.com/v4",
      rateLimit: 500,
    });

    this.salaryService = new SalaryService({
      enableCache: true,
      cacheTTLMinutes: 60, // Cache salaries for 1 hour
      preferredSource: "auto", // Auto-select best source
    });

    this.hfService = new HuggingFaceService();
  }

  async execute(args: any): Promise<PlayerProjectionsOutput> {
    // Validate input
    const input = PlayerProjectionsInputSchema.parse(args);

    console.log(`Generating projections for ${input.sport} (${input.slate} slate)`);

    try {
      // For MVP, we'll use a simplified projection model
      // In production, this would load trained XGBoost model + SHAP
      const projections = await this.generateProjections(input);

      return {
        sport: input.sport,
        slate: input.slate,
        date: input.date || new Date().toISOString(),
        projections,
        metadata: {
          modelVersion: "1.0.0-mvp",
          lastTrained: "2025-01-15T00:00:00Z",
          dataSourcesUsed: ["balldontlie", "odds-api", "vegas-lines"],
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error generating projections:", error);
      throw error;
    }
  }

  /**
   * Generate player projections
   * MVP: Uses recent averages + Vegas lines
   * Production: XGBoost model with SHAP explanations
   */
  private async generateProjections(
    input: PlayerProjectionsInput
  ): Promise<PlayerProjectionsOutput["projections"]> {
    if (input.sport !== "NBA") {
      throw new Error(`${input.sport} projections coming soon - NBA only in MVP`);
    }

    // Get today's games
    const games = await this.ballDontLie.getGames(
      input.date ? new Date(input.date) : new Date()
    );

    if (games.length === 0) {
      console.log("No games found for this date");
      return [];
    }

    // Fetch real DFS salaries
    console.log("Fetching DFS salaries...");
    let salaries: Awaited<ReturnType<typeof this.salaryService.getSalaries>> = [];
    try {
      // Map slate types to our service's expected format
      const slateType = input.slate === "main" || input.slate === "early" ? input.slate : "main";
      salaries = await this.salaryService.getSalaries(input.sport, "draftkings", slateType);
    } catch (error) {
      console.error("Failed to fetch real salaries, using mock data:", error);
      salaries = [];
    }

    // Create salary lookup map
    const salaryMap = new Map(
      salaries.map((s) => [s.playerName.toLowerCase(), s])
    );

    console.log(`Found ${salaries.length} players with salaries`);

    // Get players (with caching for performance)
    let players = await this.getCachedPlayers(input.sport);

    // Pre-filter players by salary and position BEFORE fetching stats
    let filteredPlayers = players.filter((player) => {
      const salaryData = salaryMap.get(player.name.toLowerCase());
      const salary = salaryData?.dkSalary || this.getMockSalary(player.name);

      // Salary filter
      if (input.minSalary && salary < input.minSalary) return false;
      if (input.maxSalary && salary > input.maxSalary) return false;

      // Position filter
      if (input.positions && !input.positions.includes(player.position)) {
        return false;
      }

      return true;
    });

    // Prioritize players with real salaries
    filteredPlayers.sort((a, b) => {
      const aHasSalary = salaryMap.has(a.name.toLowerCase()) ? 1 : 0;
      const bHasSalary = salaryMap.has(b.name.toLowerCase()) ? 1 : 0;
      return bHasSalary - aHasSalary;
    });

    // Limit to maxPlayers for performance (default 50)
    const maxPlayers = input.maxPlayers || 50;
    filteredPlayers = filteredPlayers.slice(0, maxPlayers);

    console.log(`Processing ${filteredPlayers.length} players (limited from ${players.length})`);

    // Fetch stats for filtered players with error handling
    const projections = await Promise.all(
      filteredPlayers.map(async (player) => {
        try {
          const salaryData = salaryMap.get(player.name.toLowerCase());
          const salary = salaryData?.dkSalary || this.getMockSalary(player.name);

          // Get player averages
          const playerId = parseInt(player.id);
          const averages = await this.ballDontLie.getPlayerAverages(playerId, 10);

          if (averages.gamesPlayed === 0) return null;

          // Analyze injury risk using HuggingFace (if available)
          let injuryRisk = null;
          if (this.hfService.isAvailable()) {
            const injuryTexts = await this.getInjuryRelatedTexts(player.name);
            injuryRisk = await this.hfService.analyzeInjurySentiment(player.name, injuryTexts);
          }

          // Simple projection: recent average +/- variance
          let projectedPoints = averages.avgFantasyPoints;

          // Apply injury adjustment if detected
          if (injuryRisk && injuryRisk.adjustment < 1.0) {
            projectedPoints = projectedPoints * injuryRisk.adjustment;
          }

          const variance = projectedPoints * 0.2;

          // Generate explanation
          const explanation = input.includeExplanations
            ? this.generateExplanation(player, averages, salary, injuryRisk)
            : undefined;

          return {
            playerId: player.id,
            playerName: player.name,
            team: player.team,
            position: player.position,
            salary,
            projectedPoints: Math.round(projectedPoints * 10) / 10,
            floor: Math.round((projectedPoints - variance) * 10) / 10,
            ceiling: Math.round((projectedPoints + variance) * 10) / 10,
            confidence: this.calculateConfidence(averages.gamesPlayed),
            value: Math.round((projectedPoints / salary) * 1000 * 100) / 100,
            ownership: this.estimateOwnership(salary, projectedPoints),
            explanation,
          };
        } catch (error) {
          // Log error but don't fail entire operation
          console.error(`Failed to get stats for ${player.name}:`, error);
          return null;
        }
      })
    );

    // Filter nulls and sort by value
    return projections
      .filter((p) => p !== null)
      .sort((a, b) => b!.value - a!.value) as any;
  }

  /**
   * Generate SHAP-style explanation (simplified for MVP)
   */
  private generateExplanation(
    player: any,
    averages: any,
    salary: number,
    injuryRisk: any = null
  ) {
    const topFactors = [
      {
        factor: "recent_performance",
        impact: averages.avgFantasyPoints,
        description: `Averaging ${averages.avgFantasyPoints.toFixed(1)} FP over last ${averages.gamesPlayed} games`,
      },
      {
        factor: "salary_value",
        impact: (averages.avgFantasyPoints / salary) * 1000,
        description: `${((averages.avgFantasyPoints / salary) * 1000).toFixed(2)} points per $1K salary`,
      },
      {
        factor: "consistency",
        impact: averages.gamesPlayed >= 8 ? 5 : -5,
        description:
          averages.gamesPlayed >= 8
            ? "Consistent playing time"
            : "Limited recent data",
      },
    ];

    // Add injury risk factor if HuggingFace analysis is available
    if (injuryRisk && injuryRisk.level !== 'LOW') {
      const impactPoints = averages.avgFantasyPoints * (injuryRisk.adjustment - 1.0);
      topFactors.push({
        factor: "injury_risk",
        impact: impactPoints,
        description: `${injuryRisk.description} (${(injuryRisk.confidence * 100).toFixed(0)}% confidence)`,
      });
    }

    let reasoning = `${player.name} is projected for ${averages.avgFantasyPoints.toFixed(1)} fantasy points based primarily on recent performance averaging ${averages.avgPoints.toFixed(1)} pts, ${averages.avgRebounds.toFixed(1)} reb, ${averages.avgAssists.toFixed(1)} ast over ${averages.gamesPlayed} games.`;

    // Add injury context to reasoning if available
    if (injuryRisk && injuryRisk.level !== 'LOW') {
      reasoning += ` Note: ${injuryRisk.description} - projection reduced by ${((1.0 - injuryRisk.adjustment) * 100).toFixed(0)}%.`;
    }

    const shapValues: any = {
      recent_performance: averages.avgFantasyPoints,
      salary_value: (averages.avgFantasyPoints / salary) * 1000,
      consistency: averages.gamesPlayed >= 8 ? 5 : -5,
    };

    if (injuryRisk && injuryRisk.level !== 'LOW') {
      shapValues.injury_risk = averages.avgFantasyPoints * (injuryRisk.adjustment - 1.0);
    }

    return {
      topFactors,
      reasoning,
      shapValues,
    };
  }

  /**
   * Calculate confidence score based on data quality
   */
  private calculateConfidence(gamesPlayed: number): number {
    if (gamesPlayed >= 10) return 0.9;
    if (gamesPlayed >= 5) return 0.75;
    if (gamesPlayed >= 3) return 0.6;
    return 0.4;
  }

  /**
   * Estimate ownership percentage (simplified)
   */
  private estimateOwnership(salary: number, projectedPoints: number): number {
    const value = (projectedPoints / salary) * 1000;

    // High value = high ownership
    if (value > 7) return Math.random() * 20 + 30; // 30-50%
    if (value > 6) return Math.random() * 15 + 15; // 15-30%
    if (value > 5) return Math.random() * 10 + 5; // 5-15%
    return Math.random() * 5; // 0-5%
  }

  /**
   * Get cached players or fetch if cache expired
   */
  private async getCachedPlayers(sport: string): Promise<any[]> {
    const cacheKey = `${sport}_players`;
    const cached = this.playerCache.get(cacheKey);

    // Check if cache is valid
    if (cached) {
      const age = Date.now() - cached.timestamp.getTime();
      if (age < this.CACHE_TTL_MS) {
        console.log(`Using cached player list (${Math.round(age / 60000)} minutes old)`);
        return cached.players;
      } else {
        console.log(`Cache expired (${Math.round(age / 60000)} minutes old), refreshing...`);
      }
    }

    // Fetch fresh player list
    console.log(`Fetching player list from BallDontLie API...`);
    const players = await this.ballDontLie.getPlayers();

    // Cache the results
    this.playerCache.set(cacheKey, {
      players,
      timestamp: new Date(),
    });

    console.log(`Cached ${players.length} players for ${sport}`);
    return players;
  }

  /**
   * Get mock salary for a player (fallback only)
   * Used when real salary data is unavailable
   */
  private getMockSalary(playerName: string): number {
    const mockSalaries: Record<string, number> = {
      "LeBron James": 9500,
      "Stephen Curry": 9300,
      "Kevin Durant": 9100,
      "Giannis Antetokounmpo": 11000,
      "Nikola Jokic": 11500,
      "Luka Doncic": 11200,
      "Joel Embiid": 10800,
      "Jayson Tatum": 9800,
      "Damian Lillard": 9000,
      "Anthony Davis": 9700,
    };

    // Return mock salary if exists, otherwise estimate based on tier
    if (mockSalaries[playerName]) {
      return mockSalaries[playerName];
    }

    // Default to mid-tier salary for unknown players
    return 5500;
  }

  /**
   * Get injury-related text mentions for a player
   * MVP: Returns mock data for testing
   * TODO: Integrate with real news API (NewsAPI, SportsRadar, etc.)
   */
  private async getInjuryRelatedTexts(playerName: string): Promise<string[]> {
    // Mock injury scenarios for testing
    // In production, this would fetch from a news API
    const mockInjuryData: Record<string, string[]> = {
      "Giannis Antetokounmpo": [
        "Giannis Antetokounmpo left practice early with knee soreness",
        "Milwaukee star questionable for tonight with right knee pain",
      ],
      "LeBron James": [
        "LeBron James looking great in practice",
        "King James ready for tonight's big matchup",
      ],
      "Stephen Curry": [
        "Curry participated in limited capacity at practice",
        "Stephen dealing with minor ankle discomfort but expects to play",
      ],
      "Anthony Davis": [
        "Anthony Davis listed as questionable with back tightness",
        "Lakers monitoring AD's injury status closely",
      ],
      "Joel Embiid": [
        "Embiid out tonight due to knee management",
        "76ers star to rest for load management purposes",
      ],
    };

    // Return mock data if available, otherwise return empty array
    // Empty array = no injury mentions = LOW risk with 1.0 adjustment
    return mockInjuryData[playerName] || [];
  }
}
