/**
 * Apify Actor Entry Point
 * Wraps MCP server for Apify platform
 */

import { Actor } from "apify";
import { SportIntelMCPServer } from "./mcp-server.js";

export async function runAsApifyActor() {
  await Actor.init();

  try {
    const input = await Actor.getInput<{
      mode: "server" | "batch";
      tool?: string;
      arguments?: any;
    }>();

    if (!input) {
      throw new Error("No input provided");
    }

    if (input.mode === "batch") {
      // Batch processing mode - execute tool and return result
      console.log(`Batch mode: executing tool ${input.tool}`);

      const server = new SportIntelMCPServer();
      const toolRegistry = (server as any).toolRegistry;

      const result = await toolRegistry.executeTool(
        input.tool,
        input.arguments
      );

      await Actor.setValue("OUTPUT", result);
      await Actor.pushData(result);

      console.log("Batch execution completed");
    } else {
      // Server mode - keep running as MCP server
      console.log("Server mode: starting MCP server");

      const server = new SportIntelMCPServer();
      await server.start();

      // Keep actor alive
      await Actor.setValue("STATUS", "running");
    }

    await Actor.exit();
  } catch (error) {
    console.error("Actor failed:", error);
    await Actor.fail(error instanceof Error ? error.message : String(error));
  }
}
