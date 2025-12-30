
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessData, GrowthStrategy, ChatMessage } from "../types";

export class GeminiService {
  async generateStrategy(data: BusinessData): Promise<GrowthStrategy> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
      4. NEW MANDATORY SECTION: Ad & Social Strategy.
         - If targeting younger demographics (Gen Z, Millennials) or visual products, suggest platforms like TikTok, Instagram, and Pinterest.
         - Provide specific content ideas (e.g., "Day in the life", "ASMR unboxing").
         - Provide engagement tactics (e.g., "Reply to comments with video", "User-generated content contests").

      REQUIRED JSON SCHEMA:
      {
        "type": "social" | "seo",
        "healthScore": number,
        "onPageAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "HIGH|MEDIUM|LOW"}],
        "technicalAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "HIGH|MEDIUM|LOW"}],
        "offPageAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "HIGH|MEDIUM|LOW"}],
        "conversionAudit": [{"issue": "string", "impact": "string", "solution": "string", "priority": "HIGH|MEDIUM|LOW"}],
        "topPriorityFixes": ["string"],
        "roadmap": [{"day": number, "phase": 1, "title": "string", "description": "string", "goal": "string", "creativeFocus": "string"}],
        "adSocialStrategy": {
          "platformSuggestions": [{"platform": "string", "reasoning": "string", "contentIdeas": ["string"], "engagementTactics": ["string"]}],
          "overallTone": "string",
          "paidAdFocus": "string"
        },
        "marketAnalysis": {
          "competitorInsights": "string",
          "platformPriority": [{"platform": "string", "rankingTips": "string"}]
        },
        "dailyMetrics": [{"metricName": "string", "targetValue": "string"}]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              healthScore: { type: Type.NUMBER },
              onPageAudit: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    issue: { type: Type.STRING },
                    impact: { type: Type.STRING },
                    solution: { type: Type.STRING },
                    priority: { type: Type.STRING }
                  }
                }
              },
              technicalAudit: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { issue: { type: Type.STRING }, impact: { type: Type.STRING }, solution: { type: Type.STRING }, priority: { type: Type.STRING } } } },
              offPageAudit: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { issue: { type: Type.STRING }, impact: { type: Type.STRING }, solution: { type: Type.STRING }, priority: { type: Type.STRING } } } },
              conversionAudit: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { issue: { type: Type.STRING }, impact: { type: Type.STRING }, solution: { type: Type.STRING }, priority: { type: Type.STRING } } } },
              topPriorityFixes: { type: Type.ARRAY, items: { type: Type.STRING } },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    phase: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    creativeFocus: { type: Type.STRING }
                  }
                }
              },
              adSocialStrategy: {
                type: Type.OBJECT,
                properties: {
                  platformSuggestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                        contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                        engagementTactics: { type: Type.ARRAY, items: { type: Type.STRING } }
                      }
                    }
                  },
                  overallTone: { type: Type.STRING },
                  paidAdFocus: { type: Type.STRING }
                }
              },
              marketAnalysis: {
                type: Type.OBJECT,
                properties: {
                  competitorInsights: { type: Type.STRING },
                  platformPriority: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, rankingTips: { type: Type.STRING } } } }
                }
              },
              dailyMetrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    metricName: { type: Type.STRING },
                    targetValue: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["type", "healthScore", "onPageAudit", "technicalAudit", "topPriorityFixes", "roadmap", "adSocialStrategy", "dailyMetrics"]
          }
        }
      });

      return JSON.parse(response.text || '{}') as GrowthStrategy;
    } catch (error) {
      console.error("Audit failed:", error);
      throw error;
    }
  }

  async chatWithConsultant(history: ChatMessage[], message: string, context: BusinessData, strategy: GrowthStrategy) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const formattedHistory = history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
    
    const systemInstruction = `
      You are a professional senior digital marketing consultant acting as a live chat support agent.
      The client may ask ANY question related to digital marketing (SEO, Ads, Sales, Social Media, Budget, Strategy).

      Client Context:
      - Business Name: ${context.businessName}
      - Business Type: ${context.productType}
      - Product/Service: ${context.productType}
      - Target Audience: ${context.targetAudience}
      - Target Location: ${context.targetCountry}
      - Website: ${context.url ? 'YES (' + context.url + ')' : 'NO'}
      - Monthly Budget: ${context.budget}
      - Current Situation/Problem: ${context.currentProblem}
      - Strategy Goal: ${context.mainGoal}
      - Active Blueprint Type: ${strategy.type.toUpperCase()}

      YOUR ROLE:
      1. Understand the question clearly.
      2. Identify the REAL problem behind the question.
      3. Guide step-by-step like a human consultant.
      4. Use simple, clear, non-technical language.
      5. Give practical advice for immediate application.
      6. If confused, ask ONE short clarifying question before answering.
      7. Correct wrong assumptions politely and logically.
      8. Do NOT over-promise results.
      9. Focus on solutions that increase traffic, leads, or sales.

      GUIDELINES:
      - Be calm, professional, and supportive.
      - Avoid generic motivational talk.
      - Use checklists, steps, and examples.
      - If NO website: Guide towards social-media-first strategy.
      - If Website but NO traffic: Focus on SEO or ads.
      - If traffic exists but NO sales: Focus on conversion and trust issues.
      - Budget-aware: low budget = organic; high budget = paid + organic mix.
      
      Response Style:
      - Short explanation
      - Clear steps (numbered or bullet points)
      - Actionable next move
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: formattedHistory,
      config: {
        systemInstruction: systemInstruction.trim()
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text || '';
  }
}

export const geminiService = new GeminiService();
