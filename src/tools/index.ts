/**
 * Tool Registry
 * Manages all available MCP tools
 */

import type { MCPTool } from "../types/mcp.js";
import { BaseTool } from "./base-tool.js";
import { PlayerProjectionsTool } from "./player-projections.js";
import { LineupOptimizerTool } from "./lineup-optimizer.js";
import { LiveOddsTool } from "./live-odds.js";
import { ExplainRecommendationTool } from "./explain-recommendation.js";

export { BaseTool } from "./base-tool.js";

export class ToolRegistry {
  private tools: Map<string, BaseTool>;

  constructor() {
    this.tools = new Map();
    this.registerTools();
  }

  /**
   * Register all available tools
   */
  private registerTools() {
    this.register(new PlayerProjectionsTool());
    this.register(new LineupOptimizerTool());
    this.register(new LiveOddsTool());
    this.register(new ExplainRecommendationTool());

    console.log(`Registered ${this.tools.size} tools`);
  }

  /**
   * Register a single tool
   */
  private register(tool: BaseTool) {
    this.tools.set(tool.definition.name, tool);
  }

  /**
   * Get tool by name
   */
  getTool(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all tool definitions
   */
  getAllTools(): MCPTool[] {
    return Array.from(this.tools.values()).map((tool) => tool.definition);
  }

  /**
   * Execute a tool
   */
  async executeTool(name: string, args: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    return tool.execute(args);
  }
}
