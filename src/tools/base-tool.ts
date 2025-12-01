/**
 * Base class for all MCP tools
 */

import type { MCPTool } from "../types/mcp.js";

export abstract class BaseTool {
  abstract definition: MCPTool;
  abstract execute(args: any): Promise<any>;

  /**
   * Validate input against schema
   */
  protected validateInput(schema: any, input: any): void {
    // Schema validation using Zod happens in the tool implementation
    // This is a placeholder for additional validation if needed
  }

  /**
   * Format error response
   */
  protected formatError(error: unknown): any {
    return {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format success response
   */
  protected formatSuccess(data: any): any {
    return {
      ...data,
      timestamp: new Date().toISOString(),
      success: true,
    };
  }
}
