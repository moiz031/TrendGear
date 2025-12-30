
export interface BusinessData {
  businessName: string;
  productType: string;
  targetAudience: string;
  targetCountry: string;
  currentProblem: string;
  budget: string;
  currentSetup: string;
  url?: string;
  mainGoal: string;
}

export interface AuditIssue {
  issue: string;
  impact: string;
  solution: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SocialPlatformIdea {
  platform: string;
  reasoning: string;
  contentIdeas: string[];
  engagementTactics: string[];
}

export interface Task {
  day: number;
  phase: number;
  title: string;
  description: string;
  goal: string;
  creativeFocus: string;
  whyItMatters: string;
}

export interface GrowthStrategy {
  type: 'social' | 'seo';
  healthScore: number;
  
  // Professional Audit Sections
  onPageAudit: AuditIssue[];
  technicalAudit: AuditIssue[];
  offPageAudit: AuditIssue[];
  conversionAudit: AuditIssue[];
  
  // Summary & Roadmap
  topPriorityFixes: string[];
  roadmap: Task[];
  
  // Market & Metrics
  marketAnalysis: {
    competitorInsights: string;
    platformPriority: {
      platform: string;
      rankingTips: string;
    }[];
  };

  // NEW: Ad & Social Strategy
  adSocialStrategy: {
    platformSuggestions: SocialPlatformIdea[];
    overallTone: string;
    paidAdFocus: string;
  };

  dailyMetrics: {
    metricName: string;
    targetValue: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppStep {
  WELCOME = 'welcome',
  ONBOARDING = 'onboarding',
  PROCESSING = 'processing',
  DASHBOARD = 'dashboard'
}
