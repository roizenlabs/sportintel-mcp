/**
 * The Odds API Integration
 * https://the-odds-api.com/
 */

import axios, { type AxiosInstance } from "axios";
import type { Sport, OddsData } from "../types/sports.js";

interface OddsAPIConfig {
  apiKey: string;
  baseUrl: string;
  rateLimit: number; // Requests per hour
}

interface OddsAPIResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

export class OddsAPIClient {
  private client: AxiosInstance;
  private apiKey: string;
  private requestCount = 0;
  private requestLimit: number;

  // Sport key mappings
  private sportKeyMap: Record<Sport, string> = {
    NBA: "basketball_nba",
    NFL: "americanfootball_nfl",
    MLB: "baseball_mlb",
    NHL: "icehockey_nhl",
  };

  constructor(config: OddsAPIConfig) {
    this.apiKey = config.apiKey;
    this.requestLimit = config.rateLimit;
    this.client = axios.create({
      baseURL: config.baseUrl || "https://api.the-odds-api.com/v4",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Get current odds for a sport
   */
  async getOdds(
    sport: Sport,
    markets: string[] = ["spreads", "totals"],
    bookmakers?: string[]
  ): Promise<OddsData[]> {
    this.checkRateLimit();

    const sportKey = this.sportKeyMap[sport];
    const params: Record<string, any> = {
      apiKey: this.apiKey,
      regions: "us",
      markets: markets.join(","),
      oddsFormat: "american",
    };

    if (bookmakers) {
      params.bookmakers = bookmakers.join(",");
    }

    try {
      const response = await this.client.get<OddsAPIResponse[]>(
        `/sports/${sportKey}/odds`,
        { params }
      );

      this.requestCount++;
      this.logRateLimitInfo(response.headers);

      return this.transformOddsResponse(response.data, sport);
    } catch (error) {
      console.error(`Error fetching odds for ${sport}:`, error);
      throw new Error(`Failed to fetch odds: ${error}`);
    }
  }

  /**
   * Get historical odds (for model training)
   */
  async getHistoricalOdds(
    sport: Sport,
    date: Date
  ): Promise<OddsData[]> {
    // Historical endpoint requires different access
    // Implementation depends on your Odds API plan
    throw new Error("Historical odds require premium API access");
  }

  /**
   * Get player prop odds
   */
  async getPlayerProps(
    sport: Sport,
    gameId?: string
  ): Promise<any[]> {
    this.checkRateLimit();

    const sportKey = this.sportKeyMap[sport];
    const params: Record<string, any> = {
      apiKey: this.apiKey,
      regions: "us",
      markets: "player_points,player_rebounds,player_assists",
      oddsFormat: "american",
    };

    try {
      const endpoint = gameId
        ? `/sports/${sportKey}/events/${gameId}/odds`
        : `/sports/${sportKey}/odds`;

      const response = await this.client.get(endpoint, { params });
      this.requestCount++;

      return response.data;
    } catch (error) {
      console.error(`Error fetching player props for ${sport}:`, error);
      throw new Error(`Failed to fetch player props: ${error}`);
    }
  }

  /**
   * Transform API response to our data model
   */
  private transformOddsResponse(
    data: OddsAPIResponse[],
    sport: Sport
  ): OddsData[] {
    return data.map((game) => ({
      gameId: game.id,
      sport,
      bookmakers: game.bookmakers.map((bookmaker) => ({
        name: bookmaker.title,
        markets: bookmaker.markets.map((market) => ({
          type: this.normalizeMarketType(market.key),
          outcomes: market.outcomes,
          lastUpdate: new Date(market.last_update),
        })),
      })),
    }));
  }

  /**
   * Normalize market type names
   */
  private normalizeMarketType(
    key: string
  ): "spreads" | "totals" | "h2h" | "player_props" {
    if (key.includes("spread")) return "spreads";
    if (key.includes("total")) return "totals";
    if (key.includes("h2h") || key.includes("moneyline")) return "h2h";
    return "player_props";
  }

  /**
   * Check if we're within rate limits
   */
  private checkRateLimit() {
    if (this.requestCount >= this.requestLimit) {
      throw new Error(
        `Rate limit exceeded: ${this.requestCount}/${this.requestLimit} requests`
      );
    }
  }

  /**
   * Log rate limit information from response headers
   */
  private logRateLimitInfo(headers: any) {
    const remaining = headers["x-requests-remaining"];
    const used = headers["x-requests-used"];

    if (remaining !== undefined) {
      console.log(`Odds API Rate Limit: ${used} used, ${remaining} remaining`);
    }
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
