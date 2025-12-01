/**
 * RotoGrinders API Integration
 * https://rotogrinders.com/
 *
 * Provides DFS salaries, projections, and ownership data
 */

import axios, { type AxiosInstance } from "axios";
import type { Player } from "../types/sports.js";

interface RotoGrindersConfig {
  apiKey?: string;
  baseUrl: string;
  rateLimit: number;
}

interface RGPlayer {
  player_id: string;
  name: string;
  team: string;
  position: string;
  salary: number;
  site: "draftkings" | "fanduel" | "yahoo";
  slate_id: string;
  projection?: number;
  ownership?: number;
  value?: number;
  ceiling?: number;
  floor?: number;
}

interface RGSlate {
  slate_id: string;
  sport: string;
  site: string;
  name: string;
  start_time: string;
  game_count: number;
}

export interface SalaryData {
  playerId: string;
  playerName: string;
  team: string;
  position: string;
  dkSalary?: number;
  fdSalary?: number;
  yahooSalary?: number;
  slateId: string;
  sport: string;
  lastUpdate: Date;
}

export class RotoGrindersClient {
  private client: AxiosInstance;
  private requestCount = 0;
  private requestLimit: number;
  private lastRequestTime = Date.now();
  private apiKey?: string;

  constructor(config: RotoGrindersConfig) {
    this.requestLimit = config.rateLimit;
    this.apiKey = config.apiKey;

    this.client = axios.create({
      baseURL: config.baseUrl || "https://rotogrinders.com/api",
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "SportIntel-MCP/1.0",
        ...(this.apiKey && { "Authorization": `Bearer ${this.apiKey}` }),
      },
    });
  }

  /**
   * Get available slates for a sport
   */
  async getSlates(sport: string, date?: Date): Promise<RGSlate[]> {
    this.checkRateLimit();

    const dateStr = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    try {
      // RotoGrinders provides free slate data
      const response = await this.client.get<{ slates: RGSlate[] }>(
        `/slates/${sport.toLowerCase()}`,
        {
          params: { date: dateStr },
        }
      );

      this.requestCount++;
      return response.data.slates;
    } catch (error) {
      console.error("Error fetching slates:", error);

      // Return mock data for development
      return this.getMockSlates(sport, dateStr);
    }
  }

  /**
   * Get player salaries for a specific slate
   */
  async getPlayerSalaries(
    slateId: string,
    site: "draftkings" | "fanduel" | "yahoo" = "draftkings"
  ): Promise<SalaryData[]> {
    this.checkRateLimit();

    try {
      const response = await this.client.get<{ players: RGPlayer[] }>(
        `/players/${slateId}`,
        {
          params: { site },
        }
      );

      this.requestCount++;
      return this.transformPlayers(response.data.players, site);
    } catch (error) {
      console.error(`Error fetching player salaries for slate ${slateId}:`, error);

      // Fallback: Return empty array, will trigger DraftKings scraper
      return [];
    }
  }

  /**
   * Get all DFS salaries for today's slates
   */
  async getTodaysSalaries(
    sport: string,
    site: "draftkings" | "fanduel" | "yahoo" = "draftkings"
  ): Promise<SalaryData[]> {
    const slates = await this.getSlates(sport);

    if (slates.length === 0) {
      console.log(`No slates found for ${sport} today`);
      return [];
    }

    // Get main slate (usually the largest one)
    const mainSlate = slates.find(s => s.name.toLowerCase().includes('main')) || slates[0];

    console.log(`Fetching salaries for ${mainSlate.name} slate (${mainSlate.game_count} games)`);

    return this.getPlayerSalaries(mainSlate.slate_id, site);
  }

  /**
   * Transform RG players to our salary data format
   */
  private transformPlayers(players: RGPlayer[], site: string): SalaryData[] {
    return players.map(player => ({
      playerId: player.player_id,
      playerName: player.name,
      team: player.team,
      position: player.position,
      dkSalary: site === 'draftkings' ? player.salary : undefined,
      fdSalary: site === 'fanduel' ? player.salary : undefined,
      yahooSalary: site === 'yahoo' ? player.salary : undefined,
      slateId: player.slate_id,
      sport: 'NBA', // TODO: Parse from slate
      lastUpdate: new Date(),
    }));
  }

  /**
   * Mock slates for development (NBA)
   */
  private getMockSlates(sport: string, date: string): RGSlate[] {
    if (sport.toLowerCase() !== 'nba') {
      return [];
    }

    return [
      {
        slate_id: `${sport.toLowerCase()}_main_${date}`,
        sport: sport,
        site: 'draftkings',
        name: 'Main Slate',
        start_time: `${date}T19:00:00Z`,
        game_count: 8,
      },
      {
        slate_id: `${sport.toLowerCase()}_early_${date}`,
        sport: sport,
        site: 'draftkings',
        name: 'Early Slate',
        start_time: `${date}T17:00:00Z`,
        game_count: 3,
      },
    ];
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
