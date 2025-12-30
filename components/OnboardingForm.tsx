
import React, { useState } from 'react';
import { BusinessData } from '../types';

interface OnboardingFormProps {
  onSubmit: (data: BusinessData) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BusinessData>({
    businessName: '',
    productType: '',
    targetAudience: '',
    targetCountry: '',
    currentProblem: '',
    budget: '',
    currentSetup: 'No Website',
    url: '',
    mainGoal: 'Sales'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hasWebsite = !formData.currentSetup.includes('No Website');
  const isFormValid = formData.businessName && formData.productType && formData.currentProblem;

  return (
    <div className="max-w-3xl mx-auto glass-card p-8 md:p-10 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-3">Intelligence Gathering</h2>
        <p className="text-slate-400 max-w-xl mx-auto italic">Provide the data. Our AI models will architect your market domination strategy.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Company Identity</label>
            <input name="businessName" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Nexus Labs" value={formData.businessName} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Current Goal</label>
            <select name="mainGoal" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.mainGoal} onChange={handleChange}>
              <option>Sales & Revenue</option>
              <option>Lead Generation</option>
              <option>Brand Authority</option>
              <option>Search Ranking</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Digital Setup</label>
            <select name="currentSetup" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.currentSetup} onChange={handleChange}>
              <option>No Website / Starting New</option>
              <option>Shopify / E-commerce Store</option>
              <option>WordPress / Service Website</option>
              <option>FB/IG Pages Only</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Target Region</label>
            <input name="targetCountry" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., UK, Global" value={formData.targetCountry} onChange={handleChange} />
          </div>
        </div>

        {hasWebsite && (
          <div className="space-y-1 animate-in slide-in-from-top-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Website URL</label>
            <input name="url" className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl p-4 text-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://yourstore.com" value={formData.url} onChange={handleChange} />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product/Service Value Proposition</label>
          <textarea name="productType" rows={3} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="What do you sell and why should people buy it?" value={formData.productType} onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Current Bottleneck</label>
          <textarea name="currentProblem" rows={2} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Zero organic traffic, no conversions..." value={formData.currentProblem} onChange={handleChange} />
        </div>

        <button onClick={() => onSubmit(formData)} disabled={!isFormValid} className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${isFormValid ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:scale-[1.01]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
          Generate Professional Blueprint
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;
