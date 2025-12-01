/**
 * SportIntel MCP - Main Entry Point
 * Can run as standalone MCP server or Apify Actor
 */

import { SportIntelMCPServer } from "./mcp-server.js";

// Check if running in Apify environment
const isApify = process.env.APIFY_IS_AT_HOME === "1";

async function main() {
  try {
    if (isApify) {
      console.log("Running in Apify Actor mode");
      // Import Apify Actor logic dynamically
      const { runAsApifyActor } = await import("./apify-actor.js");
      await runAsApifyActor();
    } else {
      console.log("Running in standalone MCP server mode");
      const server = new SportIntelMCPServer();
      await server.start();
    }
  } catch (error) {
    console.error("Fatal error starting SportIntel MCP:", error);
    process.exit(1);
  }
}

main();
