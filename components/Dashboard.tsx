
import React, { useState, useRef, useEffect } from 'react';
import { GrowthStrategy, BusinessData, ChatMessage, AuditIssue, SocialPlatformIdea } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  strategy: GrowthStrategy;
  businessData: BusinessData;
}

// Move helpers outside to avoid re-creation on every render and fix TS scoping issues
const getPriorityColor = (p: string) => {
  if (p === 'HIGH') return 'text-red-400 bg-red-500/10 border-red-500/20';
  if (p === 'MEDIUM') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-green-400 bg-green-500/10 border-green-500/20';
};

// Sub-components typed with React.FC to handle React-specific props like 'key' in maps
const AuditCard: React.FC<{ data: AuditIssue[], title: string }> = ({ data, title }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center">
      <span className="w-1.5 h-4 bg-indigo-600 rounded-full mr-3" />
      {title}
    </h3>
    <div className="grid grid-cols-1 gap-4">
      {data.map((item, i) => (
        <div key={i} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl hover:border-indigo-500/20 transition-all">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-white font-bold text-base max-w-[80%]">{item.issue}</h4>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.impact}</p>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-indigo-300 font-bold uppercase mb-1 tracking-tighter">Recommended Fix</p>
            <p className="text-xs text-slate-300 font-medium">{item.solution}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Sub-components typed with React.FC to handle React-specific props like 'key' in maps
const SocialPlatformCard: React.FC<{ platform: SocialPlatformIdea }> = ({ platform }) => (
  <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
    <div className="flex items-center justify-between">
      <h4 className="text-xl font-black text-white">{platform.platform}</h4>
      <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">{platform.reasoning}</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Content Ideas</span>
        <ul className="space-y-2">
          {platform.contentIdeas.map((idea, idx) => (
            <li key={idx} className="text-[11px] text-slate-300 flex items-start">
              <span className="text-indigo-500 mr-2">•</span> {idea}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Engagement Tactics</span>
        <ul className="space-y-2">
          {platform.engagementTactics.map((tactic, idx) => (
            <li key={idx} className="text-[11px] text-slate-300 flex items-start">
              <span className="text-indigo-500 mr-2">→</span> {tactic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ strategy, businessData }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'priority' | 'ads' | 'roadmap' | 'consultant'>('audit');
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi, I'm your Senior Marketing Advisor. I've finished the deep audit of ${businessData.businessName}. Your Health Score is ${strategy.healthScore}/100. How can I help you dominate your market today? Ask me about specific fixes, ads, or scaling tips.` }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [chatMessages, activeTab]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || isChatLoading) return;
    const userMsg = { role: 'user' as const, text: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsChatLoading(true);
    try {
      const response = await geminiService.chatWithConsultant(chatMessages, userInput, businessData, strategy);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Support link briefly interrupted. Re-connecting to your Advisor..." }]);
    } finally { setIsChatLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Sidebar Overview */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-card p-6 rounded-3xl border-indigo-500/20 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <div className="text-center mb-6">
            <div className="text-5xl font-black text-white mb-1">{strategy.healthScore}</div>
            <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Health Score</div>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-500 font-black uppercase block mb-2 tracking-widest">Audit Summary</span>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">High Priority</span>
                  <span className="text-red-400 font-bold">{strategy.onPageAudit.filter(i => i.priority === 'HIGH').length + strategy.technicalAudit.filter(i => i.priority === 'HIGH').length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Tasks Total</span>
                  <span className="text-white font-bold">{strategy.roadmap.length}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-black uppercase block tracking-widest">Target Metrics</span>
              {strategy.dailyMetrics.map((m, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 font-medium">{m.metricName}</span>
                  <span className="text-[10px] font-black text-green-400">{m.targetValue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-white/5 flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth={2} /></svg>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-slate-950 rounded-full animate-pulse"></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Live Advisor</p>
            <p className="text-[10px] text-green-400 font-bold uppercase">Connected & Active</p>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="lg:col-span-9 space-y-6">
        <div className="flex space-x-1 bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-white/5 overflow-x-auto max-w-full no-scrollbar">
          <button onClick={() => setActiveTab('audit')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Technical Audit</button>
          <button onClick={() => setActiveTab('priority')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'priority' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Top Fixes</button>
          <button onClick={() => setActiveTab('ads')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'ads' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Ad Strategy</button>
          <button onClick={() => setActiveTab('roadmap')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Fix Roadmap</button>
          <button onClick={() => setActiveTab('consultant')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'consultant' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-400 hover:bg-white/5'}`}>Live Support</button>
        </div>

        <div className="glass-card rounded-3xl p-8 min-h-[700px] border-white/5 shadow-2xl overflow-hidden">
          {activeTab === 'audit' && (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-white">Comprehensive Professional Audit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <AuditCard title="On-Page SEO" data={strategy.onPageAudit} />
                <AuditCard title="Technical Performance" data={strategy.technicalAudit} />
                <AuditCard title="Conversion & Trust" data={strategy.conversionAudit || []} />
                <AuditCard title="Off-Page Signals" data={strategy.offPageAudit || []} />
              </div>
            </div>
          )}

          {activeTab === 'priority' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-white">Top Critical Fixes</h2>
              <div className="space-y-4">
                {strategy.topPriorityFixes.map((fix, i) => (
                  <div key={i} className="flex items-center space-x-4 p-5 bg-slate-900/40 rounded-2xl border border-white/5 group hover:border-indigo-500/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <p className="text-slate-200 font-medium text-sm">{fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Ad & Social Strategy</h2>
                  <p className="text-xs text-slate-400 mt-1">Targeting {businessData.targetAudience} across visual platforms.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-indigo-400 uppercase block mb-1">Brand Tone</span>
                  <span className="text-xs text-white font-bold">{strategy.adSocialStrategy.overallTone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-3xl">
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-2">Paid Advertising Focus</h3>
                  <p className="text-sm text-slate-300 leading-relaxed italic">"{strategy.adSocialStrategy.paidAdFocus}"</p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Social Media Platforms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {strategy.adSocialStrategy.platformSuggestions.map((platform, i) => (
                      <SocialPlatformCard key={i} platform={platform} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-10 animate-in slide-in-from-right-4">
              <h2 className="text-3xl font-black text-white">Fix Roadmap</h2>
              <div className="space-y-6">
                {strategy.roadmap.map((task, idx) => (
                  <div key={idx} className="relative pl-10 border-l-2 border-slate-800 hover:border-indigo-500/30 transition-all">
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-slate-950 bg-slate-800" />
                    <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Target Day {task.day}</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase">KPI: {task.goal}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{task.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'consultant' && (
            <div className="flex flex-col h-[650px] animate-in slide-in-from-right-4">
              <div className="flex-grow overflow-y-auto space-y-6 mb-6 pr-4 scrollbar-thin scrollbar-thumb-slate-800">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-xl border ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none border-indigo-500' : 'bg-slate-900 border-white/10 text-slate-200 rounded-bl-none'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{msg.role === 'user' ? 'You' : 'Senior Advisor'}</span>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Advisor is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="relative mt-auto">
                <input 
                  type="text" 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)} 
                  placeholder="Ask any marketing question... (e.g., 'Why aren't I getting sales?')" 
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-2xl p-6 pr-20 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xl transition-all placeholder:text-slate-600" 
                />
                <button 
                  type="submit" 
                  disabled={isChatLoading || !userInput.trim()} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeWidth={2.5} /></svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
