/**
 * SportIntel MCP Server Implementation
 * Provides AI-powered sports analytics tools via Model Context Protocol
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { MCPTool, MCPToolResponse } from "./types/mcp.js";
import { ToolRegistry } from "./tools/index.js";

export class SportIntelMCPServer {
  private server: Server;
  private toolRegistry: ToolRegistry;

  constructor() {
    this.server = new Server(
      {
        name: "sportintel-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.toolRegistry = new ToolRegistry();
    this.setupHandlers();
  }

  /**
   * Set up MCP protocol handlers
   */
  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.toolRegistry.getAllTools();
      return {
        tools: tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    // Execute tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Validate tool exists
        const tool = this.toolRegistry.getTool(name);
        if (!tool) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  error: `Unknown tool: ${name}`,
                  availableTools: this.toolRegistry.getAllTools().map((t) => t.name),
                }),
              },
            ],
            isError: true,
          };
        }

        // Execute tool
        console.log(`Executing tool: ${name}`);
        console.log(`Arguments:`, JSON.stringify(args, null, 2));

        const result = await this.toolRegistry.executeTool(name, args);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                tool: name,
                arguments: args,
              }),
            },
          ],
          isError: true,
        };
      }
    });

    // Error handler
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    // Close handler
    process.on("SIGINT", async () => {
      console.log("\nShutting down SportIntel MCP Server...");
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Start the MCP server
   */
  async start() {
    console.log("🏈 SportIntel MCP Server Starting...");
    console.log("Version: 1.0.0");
    console.log("Tools available:", this.toolRegistry.getAllTools().length);
    console.log("\nAvailable tools:");
    this.toolRegistry.getAllTools().forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.log("\n✅ SportIntel MCP Server is ready!");
    console.log("Waiting for requests...\n");
  }

  /**
   * Get server info for health checks
   */
  getInfo() {
    return {
      name: "sportintel-mcp",
      version: "1.0.0",
      tools: this.toolRegistry.getAllTools().map((t) => t.name),
      status: "running",
    };
  }
}
