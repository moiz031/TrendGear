import { GoogleGenerativeAI } from "@google/generative-ai";
import { BusinessData, GrowthStrategy, ChatMessage } from "../types";

export class GeminiService {
  async generateStrategy(data: BusinessData): Promise<GrowthStrategy> {
    const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-pro" });

    const isNoWebsite = !data.url || data.currentSetup.toLowerCase().includes('no website');

    const prompt = `
      You are a World-Class Technical SEO Auditor and Growth Consultant.
      
      Client Details:
      - Name: ${data.businessName}
      - Product: ${data.productType}
      - Target Audience: ${data.targetAudience}
      - URL: ${data.url || 'None Provided'}
      - Problem: ${data.currentProblem}
      - Goal: ${data.mainGoal}

      TASK:
      1. Perform a professional audit based on their setup.
      2. If they have a website, perform a full SEO audit.
      3. If they don't, focus on Social SEO.
      4. Provide Ad & Social Strategy suggestions for engagement.

      REQUIRED JSON SCHEMA:
      {
        "type": "string",
        "healthScore": "number",
        "onPageAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "string"}],
        "technicalAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "string"}],
        "offPageAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "string"}],
        "conversionAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "string"}],
        "topPriorityFixes": ["string"],
        "roadmap": [{"day": "number", "phase": "number", "title": "string", "description": "string", "goal": "string", "creativeFocus": "string"}],
        "adSocialStrategy": {"platformSuggestions": [{"platform": "string", "reasoning": "string", "contentIdeas": ["string"], "engagementTactics": ["string"]}], "overallTone": "string", "paidAdFocus": "string"},
        "marketAnalysis": {"competitorInsights": "string", "platformPriority": [{"platform": "string", "rankingTips": "string"}]},
        "dailyMetrics": [{"metricName": "string", "targetValue": "string"}]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: Type.ANY // Relaxed parsing for now
        }
      });

      if (!response.text) {
        console.error("Empty AI response");
        return {} as GrowthStrategy;
      }

      try {
        return JSON.parse(response.text) as GrowthStrategy;
      } catch (parseError) {
        console.error("Failed to parse AI JSON:", parseError, "Response:", response.text);
        return {} as GrowthStrategy;
      }

    } catch (error) {
      console.error("Audit failed:", error);
      return {} as GrowthStrategy;
    }
  }

  async chatWithConsultant(history: ChatMessage[], message: string, context: BusinessData, strategy: GrowthStrategy) {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const formattedHistory = history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));

    const systemInstruction = `
      You are a professional senior digital marketing consultant acting as a live chat support agent.
      Client Context:
      - Business Name: ${context.businessName}
      - Product/Service: ${context.productType}
      - Target Audience: ${context.targetAudience}
      - Website: ${context.url ? 'YES (' + context.url + ')' : 'NO'}
      - Monthly Budget: ${context.budget}
      - Current Problem: ${context.currentProblem}
      - Strategy Goal: ${context.mainGoal}
      - Active Blueprint Type: ${strategy.type || 'N/A'}

      Your Role:
      1. Understand the question.
      2. Identify the real problem.
      3. Give step-by-step advice in simple language.
      4. Provide actionable solutions.
    `;

    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: formattedHistory,
        config: { systemInstruction: systemInstruction.trim() }
      });

      const response = await chat.sendMessage({ message });
      return response.text || '';
    } catch (error) {
      console.error("Chat failed:", error);
      return "Sorry, I couldn't process the chat right now.";
    }
  }
}

export const geminiService = new GeminiService();
