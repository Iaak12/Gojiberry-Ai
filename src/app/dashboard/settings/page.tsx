'use client';

import React, { useState } from 'react';
import { Settings, Linkedin, ToggleLeft, ToggleRight, Save, User } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [toggles, setToggles] = useState({
    autoEnrichEmail: true,
    autoEnrichPhone: false,
    autoGenerateMessages: true,
    excludeServiceProviders: true,
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Company Information & Settings</h1>
            <p className="text-[#64748B]">Manage your LinkedIn connection and AI preferences.</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm font-semibold hover:bg-[#F8FAFC]">
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          {/* LinkedIn Connection */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-[#F1F5F9] pb-4">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              <h2 className="font-bold text-[#0F172A] text-lg">LinkedIn Connection</h2>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0F172A]">Pierat (Mock Account)</p>
                  <p className="text-xs text-[#22C55E] flex items-center gap-1">● Connected via Chrome Extension</p>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-md bg-white text-xs font-semibold text-red-500 hover:bg-red-50">Disconnect</button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Weekly Quota (Invites/Msgs)</label>
                <input type="number" defaultValue={100} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#FF5A36]" />
                <p className="text-xs text-[#64748B] mt-1">Recommended: max 100/week to keep account safe.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Active Days</label>
                <div className="flex gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <button key={i} className={`w-8 h-8 rounded-md text-xs font-bold ${i < 5 ? 'bg-[#FF5A36] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#64748B] mt-1">Skip weekends selected.</p>
              </div>
            </div>
          </div>

          {/* AI Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-[#F1F5F9] pb-4">
              <Settings className="w-5 h-5 text-[#475569]" />
              <h2 className="font-bold text-[#0F172A] text-lg">AI & Enrichment Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer" onClick={() => toggle('autoEnrichEmail')}>
                <div>
                  <p className="font-bold text-sm text-[#0F172A]">Auto-enrich Email Addresses</p>
                  <p className="text-xs text-[#64748B]">Automatically find emails for new leads using credits.</p>
                </div>
                {toggles.autoEnrichEmail ? <ToggleRight className="w-8 h-8 text-[#FF5A36]" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer" onClick={() => toggle('autoEnrichPhone')}>
                <div>
                  <p className="font-bold text-sm text-[#0F172A]">Auto-enrich Phone Numbers</p>
                  <p className="text-xs text-[#64748B]">Find direct dials for prospects.</p>
                </div>
                {toggles.autoEnrichPhone ? <ToggleRight className="w-8 h-8 text-[#FF5A36]" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer" onClick={() => toggle('autoGenerateMessages')}>
                <div>
                  <p className="font-bold text-sm text-[#0F172A]">Auto-generate AI Messages</p>
                  <p className="text-xs text-[#64748B]">Generate contextual LinkedIn and Email messages upon lead discovery.</p>
                </div>
                {toggles.autoGenerateMessages ? <ToggleRight className="w-8 h-8 text-[#FF5A36]" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer" onClick={() => toggle('excludeServiceProviders')}>
                <div>
                  <p className="font-bold text-sm text-[#0F172A]">Exclude Service Providers globally</p>
                  <p className="text-xs text-[#64748B]">Automatically score agencies and freelancers as no-fit.</p>
                </div>
                {toggles.excludeServiceProviders ? <ToggleRight className="w-8 h-8 text-[#FF5A36]" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="px-6 py-3 rounded-lg font-bold text-white bg-[#FF5A36] hover:bg-[#E04826] shadow-md flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
