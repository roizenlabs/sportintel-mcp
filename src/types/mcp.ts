/**
 * MCP Protocol Types for SportIntel
 * Based on Model Context Protocol specification
 */

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPToolResponse {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface ExplainabilityMetadata {
  method: "shap" | "lime" | "feature_importance";
  featureImportance: Array<{
    feature: string;
    importance: number;
    direction: "positive" | "negative";
  }>;
  confidenceScore: number;
  reasoning: string;
}

export interface ToolContext {
  userId?: string;
  requestId: string;
  timestamp: Date;
  apiKeys: {
    oddsApi?: string;
  };
  rateLimit: {
    remaining: number;
    resetAt: Date;
  };
}
