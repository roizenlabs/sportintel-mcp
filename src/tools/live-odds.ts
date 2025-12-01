/**
 * Live Odds Tool
 * Real-time odds from multiple sportsbooks
 */

import { BaseTool } from "./base-tool.js";
import type { MCPTool } from "../types/mcp.js";
import {
  LiveOddsInputSchema,
  type LiveOddsInput,
  type LiveOddsOutput,
} from "../types/tools.js";
import { OddsAPIClient } from "../integrations/odds-api.js";

export class LiveOddsTool extends BaseTool {
  definition: MCPTool = {
    name: "get_live_odds",
    description:
      "Get real-time betting odds from multiple sportsbooks. Returns current spreads, totals, moneylines, and player props with line movement history. Identifies best available odds across bookmakers.",
    inputSchema: {
      type: "object",
      properties: {
        sport: {
          type: "string",
          enum: ["NBA", "NFL", "MLB", "NHL"],
          description: "Sport to get odds for",
        },
        gameIds: {
          type: "array",
          items: { type: "string" },
          description: "Specific game IDs (optional, defaults to all upcoming)",
        },
        markets: {
          type: "array",
          items: {
            type: "string",
            enum: ["spreads", "totals", "h2h", "player_props"],
          },
          description: "Markets to include",
          default: ["spreads", "totals"],
        },
        bookmakers: {
          type: "array",
          items: { type: "string" },
          description: "Filter by specific sportsbooks",
        },
      },
      required: ["sport"],
    },
  };

  private oddsApi: OddsAPIClient;

  constructor() {
    super();

    this.oddsApi = new OddsAPIClient({
      apiKey: process.env.ODDS_API_KEY || "",
      baseUrl: process.env.ODDS_API_URL || "https://api.the-odds-api.com/v4",
      rateLimit: 500,
    });
  }

  async execute(args: any): Promise<LiveOddsOutput> {
    const input = LiveOddsInputSchema.parse(args);

    console.log(`Fetching live odds for ${input.sport}`);
    console.log(`Markets: ${input.markets.join(", ")}`);

    try {
      // Fetch odds from API
      const oddsData = await this.oddsApi.getOdds(
        input.sport,
        input.markets,
        input.bookmakers
      );

      // Transform to output format
      const games = oddsData.map((gameOdds) => {
        // Find home/away teams from bookmaker data
        const firstBookmaker = gameOdds.bookmakers[0];
        const spreadMarket = firstBookmaker?.markets.find(
          (m) => m.type === "spreads"
        );

        const homeTeam =
          spreadMarket?.outcomes.find((o) => o.point && o.point < 0)?.name ||
          "Unknown";
        const awayTeam =
          spreadMarket?.outcomes.find((o) => o.point && o.point > 0)?.name ||
          "Unknown";

        return {
          gameId: gameOdds.gameId,
          homeTeam,
          awayTeam,
          gameTime: new Date().toISOString(), // Would come from API
          bookmakers: gameOdds.bookmakers.map((bookmaker) => ({
            name: bookmaker.name,
            markets: bookmaker.markets.map((market) => ({
              type: market.type,
              outcomes: market.outcomes,
              lastUpdate: market.lastUpdate.toISOString(),
            })),
          })),
          bestOdds: this.findBestOdds(gameOdds),
        };
      });

      return {
        sport: input.sport,
        games,
        metadata: {
          fetchedAt: new Date().toISOString(),
          dataSource: "the-odds-api",
          marketsCovered: input.markets,
        },
      };
    } catch (error) {
      console.error("Error fetching odds:", error);
      throw error;
    }
  }

  /**
   * Find best available odds across all bookmakers
   */
  private findBestOdds(gameOdds: any): LiveOddsOutput["games"][0]["bestOdds"] {
    const bestOdds: LiveOddsOutput["games"][0]["bestOdds"] = {};

    // Find best spreads
    gameOdds.bookmakers.forEach((bookmaker: any) => {
      const spreadMarket = bookmaker.markets.find((m: any) => m.type === "spreads");

      if (spreadMarket) {
        spreadMarket.outcomes.forEach((outcome: any) => {
          if (outcome.point < 0) {
            // Home team spread
            if (
              !bestOdds.homeSpread ||
              outcome.price > bestOdds.homeSpread.price
            ) {
              bestOdds.homeSpread = {
                line: outcome.point,
                price: outcome.price,
                bookmaker: bookmaker.name,
              };
            }
          } else {
            // Away team spread
            if (
              !bestOdds.awaySpread ||
              outcome.price > bestOdds.awaySpread.price
            ) {
              bestOdds.awaySpread = {
                line: outcome.point,
                price: outcome.price,
                bookmaker: bookmaker.name,
              };
            }
          }
        });
      }

      // Find best totals
      const totalsMarket = bookmaker.markets.find((m: any) => m.type === "totals");

      if (totalsMarket) {
        totalsMarket.outcomes.forEach((outcome: any) => {
          if (outcome.name === "Over") {
            if (
              !bestOdds.overTotal ||
              outcome.price > bestOdds.overTotal.price
            ) {
              bestOdds.overTotal = {
                line: outcome.point,
                price: outcome.price,
                bookmaker: bookmaker.name,
              };
            }
          } else if (outcome.name === "Under") {
            if (
              !bestOdds.underTotal ||
              outcome.price > bestOdds.underTotal.price
            ) {
              bestOdds.underTotal = {
                line: outcome.point,
                price: outcome.price,
                bookmaker: bookmaker.name,
              };
            }
          }
        });
      }
    });

    return bestOdds;
  }
}
