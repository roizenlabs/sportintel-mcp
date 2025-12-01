/**
 * Explain Recommendation Tool
 * SHAP/LIME explainability for AI projections
 */

import { BaseTool } from "./base-tool.js";
import type { MCPTool } from "../types/mcp.js";
import {
  ExplainRecommendationInputSchema,
  type ExplainRecommendationInput,
  type ExplainRecommendationOutput,
} from "../types/tools.js";

export class ExplainRecommendationTool extends BaseTool {
  definition: MCPTool = {
    name: "explain_recommendation",
    description:
      "Get detailed explainability for AI projection decisions using SHAP values. Shows which features contributed most to a player's projection and why the model recommends them. Perfect for understanding the 'why' behind projections.",
    inputSchema: {
      type: "object",
      properties: {
        playerId: {
          type: "string",
          description: "Player ID to explain",
        },
        sport: {
          type: "string",
          enum: ["NBA", "NFL", "MLB", "NHL"],
          description: "Sport context",
        },
        explainerType: {
          type: "string",
          enum: ["shap", "lime", "feature_importance"],
          description: "Explainability method",
          default: "shap",
        },
        includeVisualizations: {
          type: "boolean",
          description: "Include waterfall/force plots (base64 images)",
          default: false,
        },
      },
      required: ["playerId", "sport"],
    },
  };

  async execute(args: any): Promise<ExplainRecommendationOutput> {
    const input = ExplainRecommendationInputSchema.parse(args);

    console.log(
      `Explaining projection for player ${input.playerId} using ${input.explainerType}`
    );

    try {
      // In production, this would:
      // 1. Load the trained model
      // 2. Get player features
      // 3. Calculate SHAP values
      // 4. Generate visualizations

      const explanation = this.generateExplanation(input);

      return explanation;
    } catch (error) {
      console.error("Error generating explanation:", error);
      throw error;
    }
  }

  /**
   * Generate SHAP explanation (MVP: mock data)
   * Production: Use actual SHAP library
   */
  private generateExplanation(
    input: ExplainRecommendationInput
  ): ExplainRecommendationOutput {
    // Mock SHAP values for demonstration
    const baseValue = 25.0; // Average projection
    const prediction = 32.5; // This player's projection

    const topFactors = [
      {
        feature: "recent_ppg",
        value: 28.5,
        impact: +4.2,
        direction: "positive" as const,
        humanReadable:
          "Averaging 28.5 points per game over last 10 games (+4.2 fantasy points)",
      },
      {
        feature: "vegas_total",
        value: 225,
        impact: +2.1,
        direction: "positive" as const,
        humanReadable:
          "High Vegas total (225) suggests fast-paced game (+2.1 fantasy points)",
      },
      {
        feature: "opponent_def_rating",
        value: 118,
        impact: +1.8,
        direction: "positive" as const,
        humanReadable:
          "Facing weak defense (118 rating) (+1.8 fantasy points)",
      },
      {
        feature: "home_away",
        value: 1,
        impact: +0.7,
        direction: "positive" as const,
        humanReadable: "Playing at home (+0.7 fantasy points)",
      },
      {
        feature: "rest_days",
        value: 1,
        impact: -0.3,
        direction: "negative" as const,
        humanReadable: "Only 1 day of rest (-0.3 fantasy points)",
      },
    ];

    const reasoning = this.generateReasoningText(topFactors, baseValue, prediction);

    const result: ExplainRecommendationOutput = {
      playerId: input.playerId,
      playerName: `Player ${input.playerId}`, // Would fetch real name
      projectedPoints: prediction,
      explanation: {
        method: input.explainerType,
        topFactors,
        baseValue,
        predictionValue: prediction,
        reasoning,
      },
      confidence: 0.85,
      generatedAt: new Date().toISOString(),
    };

    // Add visualizations if requested
    if (input.includeVisualizations) {
      result.visualizations = {
        waterfallPlot: this.generateMockWaterfallPlot(),
        forceplot: this.generateMockForcePlot(),
      };
    }

    return result;
  }

  /**
   * Generate human-readable reasoning
   */
  private generateReasoningText(
    factors: any[],
    baseValue: number,
    prediction: number
  ): string {
    const delta = prediction - baseValue;
    const topPositive = factors.filter((f) => f.direction === "positive");
    const topNegative = factors.filter((f) => f.direction === "negative");

    let reasoning = `This player's projection is ${delta > 0 ? "above" : "below"} the baseline by ${Math.abs(delta).toFixed(1)} fantasy points. `;

    if (topPositive.length > 0) {
      reasoning += `The main positive factors are: ${topPositive.map((f) => f.feature).join(", ")}. `;
    }

    if (topNegative.length > 0) {
      reasoning += `However, ${topNegative.map((f) => f.feature).join(" and ")} work against this projection. `;
    }

    reasoning += `Overall, the model has ${Math.round((prediction / (baseValue + delta)) * 100)}% confidence in this projection.`;

    return reasoning;
  }

  /**
   * Generate mock waterfall plot (base64 image)
   * Production: Use actual plotting library
   */
  private generateMockWaterfallPlot(): string {
    // This would be a real base64-encoded PNG
    // For MVP, return a placeholder
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  }

  /**
   * Generate mock force plot (base64 image)
   */
  private generateMockForcePlot(): string {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  }
}
