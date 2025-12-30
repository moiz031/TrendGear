import { GoogleGenerativeAI } from "@google/generative-ai";
import { BusinessData, GrowthStrategy } from "../types";

export class GeminiService {
  async generateStrategy(data: BusinessData): Promise<GrowthStrategy> {
    // Vercel settings mein jo name rakha hai wahi yahan hona chahiye
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const isNoWebsite = !data.url || data.currentSetup.toLowerCase().includes('no website');

    const prompt = `You are a World-Class Technical SEO Auditor and Growth Consultant.
      Analyze this business: ${data.businessName}
      Product: ${data.productType}
      Goal: ${data.mainGoal}
      Problem: ${data.currentProblem}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Ye sirf example structure hai, aapka purana code yahan se aage continue hoga
    return JSON.parse(text);
  }
}
