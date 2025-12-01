/**
 * HuggingFace Service
 * Provides AI-powered enhancements using HuggingFace models
 */

import { HfInference } from '@huggingface/inference';

export interface InjuryRisk {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  evidence: string[];
  adjustment: number; // Multiplier for projection (0.7-1.0)
  description: string;
}

export interface SentimentResult {
  label: string;
  score: number;
}

export class HuggingFaceService {
  private hf: HfInference;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';

    if (!this.apiKey) {
      console.warn('⚠️  HUGGINGFACE_API_KEY not set. AI enhancements disabled.');
    }

    this.hf = new HfInference(this.apiKey);
  }

  /**
   * Check if HuggingFace integration is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Analyze injury risk from text mentions
   * Uses sentiment analysis to detect negative injury-related news
   */
  async analyzeInjurySentiment(playerName: string, texts: string[]): Promise<InjuryRisk> {
    if (!this.isAvailable()) {
      return this.getDefaultInjuryRisk();
    }

    try {
      // Filter for injury-related content
      const injuryKeywords = [
        'injury', 'injured', 'hurt', 'pain', 'questionable', 'doubtful',
        'out', 'sore', 'strain', 'sprain', 'limited', 'sit out', 'miss',
        'ankle', 'knee', 'shoulder', 'back', 'hamstring', 'calf'
      ];

      const injuryTexts = texts.filter(text =>
        injuryKeywords.some(keyword =>
          text.toLowerCase().includes(keyword)
        )
      );

      if (injuryTexts.length === 0) {
        return {
          level: 'LOW',
          confidence: 0.95,
          evidence: [],
          adjustment: 1.0,
          description: 'No injury-related mentions detected'
        };
      }

      // Analyze sentiment of injury-related texts
      const sentiments = await Promise.all(
        injuryTexts.slice(0, 10).map(async (text) => { // Limit to 10 to save API calls
          try {
            const result = await this.hf.textClassification({
              model: 'cardiffnlp/twitter-roberta-base-sentiment',
              inputs: text
            });
            return { text, sentiment: result[0] };
          } catch (error) {
            console.error(`Error analyzing text: ${text}`, error);
            return null;
          }
        })
      );

      const validSentiments = sentiments.filter(s => s !== null);

      if (validSentiments.length === 0) {
        return this.getDefaultInjuryRisk();
      }

      // Count negative injury mentions with high confidence
      // Note: Model returns LABEL_0 (negative), LABEL_1 (neutral), LABEL_2 (positive)
      const negativeCount = validSentiments.filter(s =>
        s!.sentiment.label === 'LABEL_0' && s!.sentiment.score > 0.55
      ).length;

      // Determine risk level based on negative mentions
      let level: 'LOW' | 'MEDIUM' | 'HIGH';
      let adjustment: number;
      let description: string;

      if (negativeCount >= 5) {
        level = 'HIGH';
        adjustment = 0.7; // Reduce projection by 30%
        description = `High injury risk: ${negativeCount} negative mentions detected`;
      } else if (negativeCount >= 3) {
        level = 'MEDIUM';
        adjustment = 0.85; // Reduce by 15%
        description = `Moderate injury risk: ${negativeCount} negative mentions detected`;
      } else if (negativeCount >= 1) {
        level = 'LOW';
        adjustment = 0.95; // Reduce by 5%
        description = `Minor injury concerns: ${negativeCount} negative mention(s) detected`;
      } else {
        level = 'LOW';
        adjustment = 1.0;
        description = 'Injury mentions detected but sentiment is neutral/positive';
      }

      // Get top evidence (most negative sentiments)
      const evidence = validSentiments
        .filter(s => s!.sentiment.label === 'LABEL_0') // LABEL_0 = negative
        .sort((a, b) => b!.sentiment.score - a!.sentiment.score)
        .slice(0, 3)
        .map(s => s!.text);

      return {
        level,
        confidence: Math.min(0.95, negativeCount / 10 + 0.5),
        evidence,
        adjustment,
        description
      };

    } catch (error) {
      console.error('Error in injury sentiment analysis:', error);
      return this.getDefaultInjuryRisk();
    }
  }

  /**
   * Analyze sentiment of a single text
   */
  async analyzeSentiment(text: string): Promise<SentimentResult | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const result = await this.hf.textClassification({
        model: 'cardiffnlp/twitter-roberta-base-sentiment',
        inputs: text
      });
      return result[0];
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    }
  }

  /**
   * Summarize long text into shorter version
   */
  async summarizeText(text: string, maxLength: number = 50): Promise<string | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const result = await this.hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: Math.floor(maxLength / 3)
        }
      });
      return result.summary_text;
    } catch (error) {
      console.error('Error summarizing text:', error);
      return null;
    }
  }

  /**
   * Default injury risk when HuggingFace is not available or errors occur
   */
  private getDefaultInjuryRisk(): InjuryRisk {
    return {
      level: 'LOW',
      confidence: 0.5,
      evidence: [],
      adjustment: 1.0,
      description: 'HuggingFace analysis not available'
    };
  }
}
