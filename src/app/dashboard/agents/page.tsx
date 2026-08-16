'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Search, CheckCircle, ChevronRight, Save } from 'lucide-react';
import Link from 'next/link';

export default function AgentsPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6 lg:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-[#F1F5F9] px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">Create AI Agent</h1>
            <p className="text-sm text-[#64748B]">Configure your agent to run 24/7 and find warm leads.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-[#64748B] hover:text-[#0F172A]">
            Cancel
          </Link>
        </div>

        {/* Stepper */}
        <div className="bg-[#F8FAFC] px-8 py-4 border-b border-[#F1F5F9] flex items-center gap-4">
          {[
            { id: 1, label: 'ICP Definition', icon: <Search className="w-4 h-4" /> },
            { id: 2, label: 'Configure Signals', icon: <Settings className="w-4 h-4" /> },
            { id: 3, label: 'Leads Management', icon: <CheckCircle className="w-4 h-4" /> }
          ].map((s) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 ${step >= s.id ? 'text-[#FF5A36]' : 'text-[#94A3B8]'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= s.id ? 'border-[#FF5A36] bg-[#FF5A36]/10' : 'border-[#E2E8F0] bg-white'}`}>
                  {s.icon}
                </div>
                <span className="font-semibold text-sm">{s.label}</span>
              </div>
              {s.id !== 3 && <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />}
            </React.Fragment>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-8 min-h-[400px]">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">1. Define Ideal Customer Profile (ICP)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Job Titles</label>
                  <input type="text" placeholder="e.g., Founders, CMOs, Head of Sales" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Target Industries</label>
                  <input type="text" placeholder="e.g., SaaS, Technology" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36]" />
                  <p className="text-xs text-[#64748B] mt-1">Prompt: e.g., "focus on SaaS companies only"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#475569] mb-1">Company Size</label>
                    <select className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36]">
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>51-200</option>
                      <option>201+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#475569] mb-1">Locations</label>
                    <input type="text" placeholder="e.g., North America, US" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1">Exclusions (Prompt)</label>
                  <textarea placeholder="e.g., Can you score very low salespeople or service providers?" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36]" rows={3}></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">2. Configure Signals</h2>
              <p className="text-sm text-[#64748B] mb-6">Select 10-15 optimal signals for best results.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border border-[#E2E8F0] rounded-xl">
                  <h3 className="font-bold text-[#0F172A] text-sm mb-2">Engagement & Interest</h3>
                  <input type="text" placeholder="Keywords: cold email, lead generation" className="w-full px-3 py-2 border rounded-md text-sm mb-2" />
                </div>
                <div className="p-4 border border-[#E2E8F0] rounded-xl">
                  <h3 className="font-bold text-[#0F172A] text-sm mb-2">Expert & Creator</h3>
                  <input type="text" placeholder="LinkedIn profiles to track" className="w-full px-3 py-2 border rounded-md text-sm mb-2" />
                </div>
                <div className="p-4 border border-[#E2E8F0] rounded-xl">
                  <h3 className="font-bold text-[#0F172A] text-sm mb-2">Change & Trigger Events</h3>
                  <label className="flex items-center gap-2 text-sm text-[#475569] mb-2"><input type="checkbox" /> Track top 5% of ICP (active)</label>
                  <label className="flex items-center gap-2 text-sm text-[#475569] mb-2"><input type="checkbox" /> Companies that raised funds (12mo)</label>
                  <label className="flex items-center gap-2 text-sm text-[#475569]"><input type="checkbox" /> Recent job changes</label>
                </div>
                <div className="p-4 border border-[#E2E8F0] rounded-xl">
                  <h3 className="font-bold text-[#0F172A] text-sm mb-2">Community & Events</h3>
                  <input type="text" placeholder="LinkedIn Groups (exact name)" className="w-full px-3 py-2 border rounded-md text-sm mb-2" />
                  <input type="text" placeholder="LinkedIn Events (exact name)" className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">3. Leads Management</h2>
              <div className="max-w-md">
                <label className="block text-sm font-semibold text-[#475569] mb-2">Target List for Agent</label>
                <select className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36] mb-6">
                  <option>Default List</option>
                  <option>Founders Campaign 2026</option>
                </select>
                
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <h3 className="font-bold text-[#0F172A] text-sm mb-2">Agent Logs (Preview)</h3>
                  <p className="text-xs text-[#64748B font-mono]">Initializing agent configuration...</p>
                  <p className="text-xs text-[#64748B font-mono]">Will run 24/7 to analyze incoming signals.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#F1F5F9] px-8 py-4 bg-[#FAFAFA] flex items-center justify-between">
          <button 
            disabled={step === 1}
            onClick={() => setStep(s => s - 1)}
            className="px-6 py-2 rounded-lg font-semibold text-sm text-[#475569] hover:bg-[#F1F5F9] disabled:opacity-50"
          >
            Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-[#FF5A36] hover:bg-[#E04826]"
            >
              Next Step
            </button>
          ) : (
            <button 
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-[#FF5A36] hover:bg-[#E04826] flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save & Launch Agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
