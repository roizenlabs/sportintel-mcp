/**
 * BallDontLie API Integration (Free NBA Stats)
 * https://balldontlie.io/
 */

import axios, { type AxiosInstance } from "axios";
import type { Player, Game } from "../types/sports.js";

interface BallDontLieConfig {
  apiKey?: string;
  baseUrl: string;
  rateLimit: number; // Requests per minute
}

interface BallDontLiePlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  team: {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
  };
}

interface BallDontLieGame {
  id: number;
  date: string;
  home_team: {
    id: number;
    abbreviation: string;
    full_name: string;
  };
  visitor_team: {
    id: number;
    abbreviation: string;
    full_name: string;
  };
  home_team_score: number;
  visitor_team_score: number;
  status: string;
}

interface BallDontLieStats {
  id: number;
  player: BallDontLiePlayer;
  game: BallDontLieGame;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  min: string;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
}

export class BallDontLieClient {
  private client: AxiosInstance;
  private requestCount = 0;
  private requestLimit: number;
  private lastRequestTime = Date.now();

  constructor(config: BallDontLieConfig) {
    this.requestLimit = config.rateLimit;
    this.client = axios.create({
      baseURL: config.baseUrl || "https://api.balldontlie.io/v1",
      timeout: 30000, // Increased to 30s (BallDontLie API can be slow)
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { "Authorization": config.apiKey }),
      },
    });
  }

  /**
   * Get all NBA players
   */
  async getPlayers(search?: string): Promise<Player[]> {
    this.checkRateLimit();

    try {
      const response = await this.client.get<{ data: BallDontLiePlayer[] }>(
        "/players",
        {
          params: {
            per_page: 100,
            ...(search && { search }),
          },
        }
      );

      this.requestCount++;
      return this.transformPlayers(response.data.data);
    } catch (error) {
      console.error("Error fetching players:", error);
      throw new Error(`Failed to fetch players: ${error}`);
    }
  }

  /**
   * Get player by ID
   */
  async getPlayer(playerId: number): Promise<Player> {
    this.checkRateLimit();

    try {
      const response = await this.client.get<BallDontLiePlayer>(
        `/players/${playerId}`
      );

      this.requestCount++;
      return this.transformPlayer(response.data);
    } catch (error) {
      console.error(`Error fetching player ${playerId}:`, error);
      throw new Error(`Failed to fetch player: ${error}`);
    }
  }

  /**
   * Get games for a specific date
   */
  async getGames(date?: Date): Promise<Game[]> {
    this.checkRateLimit();

    const dateParam = date
      ? date.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    try {
      const response = await this.client.get<{ data: BallDontLieGame[] }>(
        "/games",
        {
          params: {
            dates: [dateParam],
            per_page: 100,
          },
        }
      );

      this.requestCount++;
      return this.transformGames(response.data.data);
    } catch (error) {
      console.error("Error fetching games:", error);
      throw new Error(`Failed to fetch games: ${error}`);
    }
  }

  /**
   * Get player stats for a specific game or season
   */
  async getPlayerStats(
    playerId?: number,
    gameId?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<BallDontLieStats[]> {
    this.checkRateLimit();

    const params: Record<string, any> = {
      per_page: 100,
    };

    if (playerId) params.player_ids = [playerId];
    if (gameId) params.game_ids = [gameId];
    if (startDate)
      params.start_date = startDate.toISOString().split("T")[0];
    if (endDate) params.end_date = endDate.toISOString().split("T")[0];

    try {
      const response = await this.client.get<{ data: BallDontLieStats[] }>(
        "/stats",
        { params }
      );

      this.requestCount++;
      return response.data.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw new Error(`Failed to fetch stats: ${error}`);
    }
  }

  /**
   * Calculate fantasy points from stats (DraftKings scoring)
   */
  calculateFantasyPoints(stats: BallDontLieStats): number {
    return (
      stats.pts * 1.0 +
      stats.reb * 1.25 +
      stats.ast * 1.5 +
      stats.stl * 2.0 +
      stats.blk * 2.0 +
      stats.turnover * -0.5 +
      (stats.pts >= 10 ? 1 : 0) + // Double-double bonuses
      (stats.reb >= 10 ? 1 : 0) +
      (stats.ast >= 10 ? 1 : 0) +
      (stats.pts >= 10 && stats.reb >= 10 && stats.ast >= 10 ? 3 : 0) // Triple-double
    );
  }

  /**
   * Get player averages over last N games
   */
  async getPlayerAverages(
    playerId: number,
    gameCount = 10
  ): Promise<{
    avgPoints: number;
    avgRebounds: number;
    avgAssists: number;
    avgFantasyPoints: number;
    gamesPlayed: number;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - gameCount * 2); // Buffer for games not played

    const stats = await this.getPlayerStats(
      playerId,
      undefined,
      startDate,
      endDate
    );

    const recentStats = stats.slice(-gameCount);

    if (recentStats.length === 0) {
      return {
        avgPoints: 0,
        avgRebounds: 0,
        avgAssists: 0,
        avgFantasyPoints: 0,
        gamesPlayed: 0,
      };
    }

    const totals = recentStats.reduce(
      (acc, stat) => ({
        points: acc.points + stat.pts,
        rebounds: acc.rebounds + stat.reb,
        assists: acc.assists + stat.ast,
        fantasyPoints:
          acc.fantasyPoints + this.calculateFantasyPoints(stat),
      }),
      { points: 0, rebounds: 0, assists: 0, fantasyPoints: 0 }
    );

    return {
      avgPoints: totals.points / recentStats.length,
      avgRebounds: totals.rebounds / recentStats.length,
      avgAssists: totals.assists / recentStats.length,
      avgFantasyPoints: totals.fantasyPoints / recentStats.length,
      gamesPlayed: recentStats.length,
    };
  }

  /**
   * Transform API player to our model
   */
  private transformPlayer(player: BallDontLiePlayer): Player {
    return {
      id: player.id.toString(),
      name: `${player.first_name} ${player.last_name}`,
      team: player.team.abbreviation,
      position: this.normalizePosition(player.position),
      salary: 0, // Need to fetch from DFS site
      sport: "NBA",
      injuryStatus: "healthy",
      lastUpdate: new Date(),
    };
  }

  /**
   * Transform API players to our model
   */
  private transformPlayers(players: BallDontLiePlayer[]): Player[] {
    return players.map((p) => this.transformPlayer(p));
  }

  /**
   * Transform API games to our model
   */
  private transformGames(games: BallDontLieGame[]): Game[] {
    return games.map((game) => ({
      id: game.id.toString(),
      sport: "NBA",
      homeTeam: game.home_team.abbreviation,
      awayTeam: game.visitor_team.abbreviation,
      gameTime: new Date(game.date),
      vegas: {
        spread: 0, // Need to fetch from odds API
        total: 0,
        homeMoneyline: 0,
        awayMoneyline: 0,
      },
    }));
  }

  /**
   * Normalize position abbreviations
   */
  private normalizePosition(
    position: string
  ): "PG" | "SG" | "SF" | "PF" | "C" {
    const normalized = position.toUpperCase();
    if (["PG", "SG", "SF", "PF", "C"].includes(normalized)) {
      return normalized as any;
    }
    // Default to guard if unknown
    return "PG";
  }

  /**
   * Check if we're within rate limits
   */
  private checkRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // Reset counter if it's been more than a minute
    if (timeSinceLastRequest > 60000) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    if (this.requestCount >= this.requestLimit) {
      throw new Error(
        `Rate limit exceeded: ${this.requestCount}/${this.requestLimit} requests per minute`
      );
    }

    this.lastRequestTime = now;
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus() {
    return {
      used: this.requestCount,
      limit: this.requestLimit,
      remaining: this.requestLimit - this.requestCount,
    };
  }
}
