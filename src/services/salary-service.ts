/**
 * DFS Salary Service
 * Orchestrates multiple salary data sources with caching and fallbacks
 *
 * Priority order:
 * 1. RotoGrinders API (most reliable)
 * 2. DraftKings Public API (real-time)
 * 3. Cache (if sources fail)
 */

import { RotoGrindersClient, type SalaryData } from "../integrations/rotogrinders.js";
import { DraftKingsScraper } from "../integrations/draftkings-scraper.js";

interface SalaryServiceConfig {
  enableCache: boolean;
  cacheTTLMinutes: number;
  preferredSource: "rotogrinders" | "draftkings" | "auto";
}

interface CachedSalaries {
  data: SalaryData[];
  timestamp: Date;
  source: string;
  slateId: string;
}

export class SalaryService {
  private rotoGrinders: RotoGrindersClient;
  private draftKings: DraftKingsScraper;
  private cache: Map<string, CachedSalaries>;
  private config: SalaryServiceConfig;

  constructor(config: Partial<SalaryServiceConfig> = {}) {
    this.config = {
      enableCache: config.enableCache ?? true,
      cacheTTLMinutes: config.cacheTTLMinutes ?? 60, // 1 hour default
      preferredSource: config.preferredSource ?? "auto",
    };

    // Initialize data sources
    this.rotoGrinders = new RotoGrindersClient({
      apiKey: process.env.ROTOGRINDERS_API_KEY,
      baseUrl: process.env.ROTOGRINDERS_API_URL || "https://rotogrinders.com/api",
      rateLimit: 60,
    });

    this.draftKings = new DraftKingsScraper({
      baseUrl: process.env.DRAFTKINGS_API_URL || "https://api.draftkings.com/draftgroups/v1",
      rateLimit: 30, // Be conservative with DK API
    });

    this.cache = new Map();
  }

  /**
   * Get player salaries for a sport (tries all sources with fallbacks)
   */
  async getSalaries(
    sport: string,
    site: "draftkings" | "fanduel" | "yahoo" = "draftkings",
    slateType: "main" | "early" | "late" = "main"
  ): Promise<SalaryData[]> {
    const cacheKey = this.getCacheKey(sport, site, slateType);

    // Check cache first
    if (this.config.enableCache) {
      const cached = this.getCachedSalaries(cacheKey);
      if (cached) {
        console.log(`✓ Using cached salaries from ${cached.source} (${cached.data.length} players)`);
        return cached.data;
      }
    }

    // Try sources in order
    const sources = this.getSourceOrder(site);

    for (const source of sources) {
      try {
        console.log(`Attempting to fetch salaries from ${source}...`);

        let salaries: SalaryData[] = [];

        switch (source) {
          case "rotogrinders":
            salaries = await this.fetchFromRotoGrinders(sport, site);
            break;

          case "draftkings":
            if (site === "draftkings") {
              salaries = await this.fetchFromDraftKings(sport);
            }
            break;
        }

        if (salaries.length > 0) {
          console.log(`✓ Successfully fetched ${salaries.length} salaries from ${source}`);

          // Cache the results
          if (this.config.enableCache) {
            this.setCachedSalaries(cacheKey, salaries, source);
          }

          return salaries;
        }
      } catch (error: any) {
        console.error(`✗ Failed to fetch from ${source}:`, error.message);
        // Continue to next source
      }
    }

    // All sources failed - return empty array to allow fallback to mock data
    console.warn(`⚠️  Failed to fetch salaries from all sources for ${sport} ${site}`);
    console.warn(`⚠️  Falling back to mock salary data`);
    return [];
  }

  /**
   * Get salaries for a specific player by name
   */
  async getPlayerSalary(
    playerName: string,
    sport: string,
    site: "draftkings" | "fanduel" | "yahoo" = "draftkings"
  ): Promise<SalaryData | null> {
    const salaries = await this.getSalaries(sport, site);

    return (
      salaries.find(
        (s) => s.playerName.toLowerCase() === playerName.toLowerCase()
      ) || null
    );
  }

  /**
   * Get salaries for multiple players by name
   */
  async getPlayersSalaries(
    playerNames: string[],
    sport: string,
    site: "draftkings" | "fanduel" | "yahoo" = "draftkings"
  ): Promise<Map<string, SalaryData>> {
    const salaries = await this.getSalaries(sport, site);
    const results = new Map<string, SalaryData>();

    for (const name of playerNames) {
      const salary = salaries.find(
        (s) => s.playerName.toLowerCase() === name.toLowerCase()
      );
      if (salary) {
        results.set(name, salary);
      }
    }

    return results;
  }

  /**
   * Refresh salaries (bypass cache)
   */
  async refreshSalaries(
    sport: string,
    site: "draftkings" | "fanduel" | "yahoo" = "draftkings"
  ): Promise<SalaryData[]> {
    const cacheKey = this.getCacheKey(sport, site, "main");
    this.cache.delete(cacheKey);

    return this.getSalaries(sport, site);
  }

  /**
   * Get all cached slates
   */
  getCachedSlates(): Array<{ sport: string; site: string; count: number; age: number }> {
    return Array.from(this.cache.entries()).map(([key, cached]) => ({
      sport: cached.data[0]?.sport || "unknown",
      site: key.split(":")[1],
      count: cached.data.length,
      age: Math.floor((Date.now() - cached.timestamp.getTime()) / 60000), // minutes
    }));
  }

  /**
   * Clear all cached salaries
   */
  clearCache() {
    this.cache.clear();
    console.log("Salary cache cleared");
  }

  // ===========================
  // PRIVATE HELPER METHODS
  // ===========================

  /**
   * Fetch salaries from RotoGrinders
   */
  private async fetchFromRotoGrinders(
    sport: string,
    site: "draftkings" | "fanduel" | "yahoo"
  ): Promise<SalaryData[]> {
    return this.rotoGrinders.getTodaysSalaries(sport, site);
  }

  /**
   * Fetch salaries from DraftKings API
   */
  private async fetchFromDraftKings(sport: string): Promise<SalaryData[]> {
    return this.draftKings.getTodaysSalaries(sport);
  }

  /**
   * Get source order based on preferences and site
   */
  private getSourceOrder(
    site: "draftkings" | "fanduel" | "yahoo"
  ): ("rotogrinders" | "draftkings")[] {
    // If user specified a preference, use it
    if (this.config.preferredSource !== "auto") {
      return [this.config.preferredSource as any];
    }

    // Auto mode: smart fallbacks
    if (site === "draftkings") {
      // For DraftKings, try their API first (more accurate)
      return ["draftkings", "rotogrinders"];
    } else {
      // For other sites, RotoGrinders is only option
      return ["rotogrinders"];
    }
  }

  /**
   * Get cached salaries if still valid
   */
  private getCachedSalaries(cacheKey: string): CachedSalaries | null {
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    const ageMinutes = (Date.now() - cached.timestamp.getTime()) / 60000;

    if (ageMinutes > this.config.cacheTTLMinutes) {
      console.log(`Cache expired for ${cacheKey} (${Math.floor(ageMinutes)} minutes old)`);
      this.cache.delete(cacheKey);
      return null;
    }

    return cached;
  }

  /**
   * Store salaries in cache
   */
  private setCachedSalaries(
    cacheKey: string,
    data: SalaryData[],
    source: string
  ) {
    this.cache.set(cacheKey, {
      data,
      timestamp: new Date(),
      source,
      slateId: data[0]?.slateId || "unknown",
    });

    console.log(`Cached ${data.length} salaries for ${cacheKey} (TTL: ${this.config.cacheTTLMinutes}m)`);
  }

  /**
   * Generate cache key
   */
  private getCacheKey(
    sport: string,
    site: string,
    slateType: string
  ): string {
    const today = new Date().toISOString().split('T')[0];
    return `${sport}:${site}:${slateType}:${today}`;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      cache: {
        enabled: this.config.enableCache,
        ttl: this.config.cacheTTLMinutes,
        entries: this.cache.size,
      },
      sources: {
        preferred: this.config.preferredSource,
        rotogrinders: this.rotoGrinders.getRateLimitStatus(),
        draftkings: this.draftKings.getRateLimitStatus(),
      },
    };
  }
}
