/**
 * DraftKings Salary Scraper
 * Scrapes player salaries from DraftKings lobby
 *
 * Methods:
 * 1. DK Public API (reverse-engineered) - Fast, reliable
 * 2. Playwright browser automation - Fallback if API breaks
 */

import axios, { type AxiosInstance } from "axios";
import type { SalaryData } from "./rotogrinders.js";

interface DKConfig {
  baseUrl: string;
  rateLimit: number;
  useBrowserScraper?: boolean;
}

interface DKDraftGroup {
  draftGroupId: number;
  contestTypeId: number;
  sport: string;
  gameCount: number;
  startTimeType: string;
  minStartTime: string;
  maxStartTime: string;
}

interface DKPlayer {
  playerId: number;
  firstName: string;
  lastName: string;
  displayName: string;
  position: string;
  teamAbbreviation: string;
  salary: number;
  rosterSlots: string[];
  draftGroupId: number;
}

interface DKAvailablePlayersResponse {
  draftables: DKPlayer[];
  draftGroup: DKDraftGroup;
}

export class DraftKingsScraper {
  private client: AxiosInstance;
  private requestCount = 0;
  private requestLimit: number;
  private lastRequestTime = Date.now();
  private useBrowserScraper: boolean;

  constructor(config: DKConfig) {
    this.requestLimit = config.rateLimit;
    this.useBrowserScraper = config.useBrowserScraper || false;

    // DraftKings API endpoints (reverse-engineered from browser network tab)
    this.client = axios.create({
      baseURL: config.baseUrl || "https://api.draftkings.com/draftgroups/v1",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
        "Origin": "https://www.draftkings.com",
        "Referer": "https://www.draftkings.com/",
      },
    });
  }

  /**
   * Get available draft groups (slates) for a sport
   */
  async getDraftGroups(sport: string): Promise<DKDraftGroup[]> {
    this.checkRateLimit();

    const sportId = this.getSportId(sport);

    try {
      // DK API endpoint for getting available draft groups
      const response = await this.client.get<{ draftGroups: DKDraftGroup[] }>(
        `/draftgroups`,
        {
          params: {
            sport: sportId,
          },
        }
      );

      this.requestCount++;
      return response.data.draftGroups || [];
    } catch (error: any) {
      console.error("Error fetching draft groups:", error.message);

      // If API fails, try alternative endpoint
      return this.getDraftGroupsAlternative(sport);
    }
  }

  /**
   * Alternative method to get draft groups using contest endpoint
   */
  private async getDraftGroupsAlternative(sport: string): Promise<DKDraftGroup[]> {
    try {
      const sportId = this.getSportId(sport);

      // Try the contests endpoint which lists available slates
      const response = await axios.get(
        `https://www.draftkings.com/lobby/getcontests`,
        {
          params: { sport: sportId },
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );

      // Parse draft groups from contests
      const contests = response.data?.Contests || [];
      const draftGroupIds = new Set<number>();

      contests.forEach((contest: any) => {
        if (contest.dg) {
          draftGroupIds.add(contest.dg);
        }
      });

      // Return simplified draft group objects
      return Array.from(draftGroupIds).map(id => ({
        draftGroupId: id,
        contestTypeId: 5, // Classic DFS
        sport: sport,
        gameCount: 0,
        startTimeType: 'Normal',
        minStartTime: new Date().toISOString(),
        maxStartTime: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Alternative draft groups fetch failed:", error);
      return [];
    }
  }

  /**
   * Get player salaries for a specific draft group
   */
  async getPlayerSalaries(draftGroupId: number): Promise<SalaryData[]> {
    this.checkRateLimit();

    try {
      // DK API endpoint for getting available players
      const response = await this.client.get<DKAvailablePlayersResponse>(
        `/draftgroups/${draftGroupId}/draftables`,
        {
          params: {
            format: 'json',
          },
        }
      );

      this.requestCount++;

      if (!response.data.draftables) {
        console.log(`No players found for draft group ${draftGroupId}`);
        return [];
      }

      return this.transformDKPlayers(response.data.draftables, response.data.draftGroup);
    } catch (error: any) {
      console.error(`Error fetching players for draft group ${draftGroupId}:`, error.message);

      // Fallback: Try alternative endpoint
      return this.getPlayerSalariesAlternative(draftGroupId);
    }
  }

  /**
   * Alternative method using different DK endpoint
   */
  private async getPlayerSalariesAlternative(draftGroupId: number): Promise<SalaryData[]> {
    try {
      const response = await axios.get(
        `https://api.draftkings.com/draftgroups/v1/${draftGroupId}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        }
      );

      const draftables = response.data?.draftables || [];
      return this.transformDKPlayers(draftables, response.data?.draftGroup);
    } catch (error) {
      console.error("Alternative player fetch failed:", error);
      return [];
    }
  }

  /**
   * Get salaries for today's main slate
   */
  async getTodaysSalaries(sport: string): Promise<SalaryData[]> {
    const draftGroups = await this.getDraftGroups(sport);

    if (draftGroups.length === 0) {
      console.log(`No draft groups found for ${sport} today`);
      return [];
    }

    // Find main slate (usually has most games and starts in evening)
    const mainSlate = draftGroups.reduce((best, current) => {
      if (current.gameCount > best.gameCount) return current;
      if (current.gameCount === best.gameCount &&
          current.startTimeType === 'Normal') return current;
      return best;
    }, draftGroups[0]);

    console.log(
      `Fetching DraftKings salaries for draft group ${mainSlate.draftGroupId} ` +
      `(${mainSlate.gameCount} games, starts ${mainSlate.minStartTime})`
    );

    return this.getPlayerSalaries(mainSlate.draftGroupId);
  }

  /**
   * Transform DK players to our salary data format
   */
  private transformDKPlayers(players: DKPlayer[], draftGroup?: DKDraftGroup): SalaryData[] {
    return players.map(player => ({
      playerId: player.playerId.toString(),
      playerName: player.displayName || `${player.firstName} ${player.lastName}`,
      team: player.teamAbbreviation,
      position: this.normalizePosition(player.position),
      dkSalary: player.salary,
      slateId: draftGroup?.draftGroupId.toString() || 'unknown',
      sport: draftGroup?.sport || 'NBA',
      lastUpdate: new Date(),
    }));
  }

  /**
   * Normalize position codes
   */
  private normalizePosition(position: string): string {
    // DK uses different position codes for different sports
    const positionMap: Record<string, string> = {
      'PG': 'PG',
      'SG': 'SG',
      'SF': 'SF',
      'PF': 'PF',
      'C': 'C',
      'G': 'G',
      'F': 'F',
      'UTIL': 'UTIL',
      // NFL
      'QB': 'QB',
      'RB': 'RB',
      'WR': 'WR',
      'TE': 'TE',
      'DST': 'DST',
      'FLEX': 'FLEX',
      // MLB
      'P': 'P',
      'SP': 'SP',
      'RP': 'RP',
      '1B': '1B',
      '2B': '2B',
      '3B': '3B',
      'SS': 'SS',
      'OF': 'OF',
    };

    return positionMap[position.toUpperCase()] || position;
  }

  /**
   * Get sport ID for DK API
   */
  private getSportId(sport: string): number {
    const sportIds: Record<string, number> = {
      'NBA': 4,
      'NFL': 1,
      'MLB': 2,
      'NHL': 3,
      'SOCCER': 5,
      'GOLF': 6,
      'MMA': 7,
      'NASCAR': 8,
      'LOL': 10,
      'CSGO': 11,
    };

    return sportIds[sport.toUpperCase()] || 4; // Default to NBA
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

/**
 * Playwright-based browser scraper (fallback if API breaks)
 * Requires: npm install playwright
 */
export class DraftKingsBrowserScraper {
  /**
   * Scrape salaries using headless browser
   * This is a last-resort fallback if the API is blocked
   */
  async scrapeSalaries(sport: string): Promise<SalaryData[]> {
    console.warn(
      "Browser scraping is not implemented in MVP. " +
      "Use DraftKingsScraper API method instead. " +
      "To implement: npm install playwright and uncomment code below."
    );

    /*
    // Uncomment this code if you install playwright:

    const { chromium } = await import('playwright');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to DK lobby
    await page.goto(`https://www.draftkings.com/lobby?sport=${sport}`);

    // Wait for player salaries to load
    await page.waitForSelector('.player-salary');

    // Extract player data
    const players = await page.$$eval('.player-card', cards => {
      return cards.map(card => ({
        name: card.querySelector('.player-name')?.textContent || '',
        team: card.querySelector('.player-team')?.textContent || '',
        position: card.querySelector('.player-position')?.textContent || '',
        salary: parseInt(card.querySelector('.player-salary')?.textContent?.replace(/[^0-9]/g, '') || '0'),
      }));
    });

    await browser.close();

    return players.map(p => ({
      playerId: p.name.replace(/\s+/g, '-').toLowerCase(),
      playerName: p.name,
      team: p.team,
      position: p.position,
      dkSalary: p.salary,
      slateId: 'browser-scraped',
      sport: sport,
      lastUpdate: new Date(),
    }));
    */

    return [];
  }
}
