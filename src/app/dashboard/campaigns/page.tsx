'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Plus, Save, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CampaignsPage() {
  const [steps, setSteps] = useState([{ id: 1, type: 'invite', template: '', delayDays: 0 }]);

  const addStep = (type: string) => {
    setSteps([...steps, { id: steps.length + 1, type, template: '', delayDays: 1 }]);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Campaign Builder</h1>
            <p className="text-[#64748B]">Create automated outreach sequences.</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm font-semibold hover:bg-[#F8FAFC]">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 mb-6">
          <label className="block text-sm font-semibold text-[#475569] mb-2">Lead Source</label>
          <select className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36]">
            <option>Default List (All Leads)</option>
            <option>Founders Campaign 2026</option>
          </select>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={step.id} 
              className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.type === 'invite' ? 'bg-[#0A66C2]/10 text-[#0A66C2]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                    {step.type === 'invite' ? <Linkedin className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>
                  <h3 className="font-bold text-[#0F172A]">Step {index + 1}: {step.type === 'invite' ? 'LinkedIn Invite' : 'Follow-up Message'}</h3>
                </div>
                {index > 0 && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#64748B]">
                    <Clock className="w-4 h-4" /> Wait {step.delayDays} day(s)
                  </div>
                )}
              </div>
              <div className="p-6">
                <textarea 
                  rows={4}
                  placeholder={`Hi {{firstName}}, I saw you were doing X...`}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg outline-none focus:border-[#FF5A36] font-mono text-sm"
                ></textarea>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6 justify-center">
          <button onClick={() => addStep('message')} className="px-4 py-2 rounded-lg border border-dashed border-[#CBD5E1] text-[#64748B] text-sm font-semibold hover:bg-white hover:border-[#94A3B8] flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Follow-up Message
          </button>
        </div>

        <div className="mt-12 flex justify-end">
          <button className="px-6 py-3 rounded-lg font-bold text-white bg-[#FF5A36] hover:bg-[#E04826] shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" /> Save & Launch Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
