
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import { AppStep, BusinessData, GrowthStrategy } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [strategy, setStrategy] = useState<GrowthStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Initializing Consultant Engine...");

  const handleOnboardingSubmit = async (data: BusinessData) => {
    setBusinessData(data);
    setStep(AppStep.PROCESSING);
    setIsLoading(true);

    const messages = [
      "Performing deep market diagnostics...",
      "Simulating search engine crawlers...",
      "Analyzing competitor authority...",
      "Mapping customer acquisition funnel...",
      "Architecting multi-phase roadmap...",
      "Optimizing daily growth vectors..."
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2500);

    try {
      const result = await geminiService.generateStrategy(data);
      setStrategy(result);
      setStep(AppStep.DASHBOARD);
    } catch (error) {
      alert("Consultant link failed. Ensure API access is valid.");
      setStep(AppStep.ONBOARDING);
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <Layout>
      {step === AppStep.WELCOME && (
        <div className="flex flex-col items-center justify-center text-center py-24 space-y-10 animate-in fade-in duration-1000">
          <div className="inline-flex items-center space-x-2 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">AI-Powered Powerhouse</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter max-w-5xl">
            DOMINATE YOUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">DIGITAL NICHE</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
            Professional SEO audits, social storefront architectures, and data-driven growth targets. Stop guessing. Start winning.
          </p>

          <button 
            onClick={() => setStep(AppStep.ONBOARDING)}
            className="group relative px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.05] active:scale-[0.98] border border-white/10"
          >
            Access AI Consultant
            <svg className="w-6 h-6 ml-3 inline transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {[
              { t: "SEO DIAGNOSTICS", d: "Deep technical audits for websites & social search ranking." },
              { t: "90-DAY ROADMAPS", d: "Daily actionable tasks grouped by strategic phases." },
              { t: "SALES FUNNELS", d: "High-converting lead systems for DMs, WhatsApp, or Checkout." }
            ].map((f, i) => (
              <div key={i} className="p-8 glass-card rounded-3xl border-white/5 text-left group hover:border-indigo-500/30 transition-all">
                <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] mb-4 uppercase">{f.t}</div>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors font-medium leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === AppStep.ONBOARDING && <OnboardingForm onSubmit={handleOnboardingSubmit} />}

      {step === AppStep.PROCESSING && (
        <div className="flex flex-col items-center justify-center py-48 space-y-10">
          <div className="relative">
            <div className="w-24 h-24 border-[6px] border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl animate-pulse blur-[15px] opacity-50"></div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Analyzing Empire Data</h2>
            <p className="text-indigo-400 font-bold text-sm uppercase tracking-widest">{loadingMessage}</p>
          </div>
        </div>
      )}

      {step === AppStep.DASHBOARD && strategy && businessData && (
        <Dashboard strategy={strategy} businessData={businessData} />
      )}
    </Layout>
  );
};

export default App;
