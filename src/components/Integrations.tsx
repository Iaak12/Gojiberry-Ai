'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Users, Building2, ArrowRight } from 'lucide-react';

const TOOLS = [
  { name: 'ClickUp', icon: '⚡', angle: 0 },
  { name: 'Pipedrive', icon: '🅿️', angle: 51 },
  { name: 'HubSpot', icon: '🧡', angle: 102 },
  { name: 'Slack', icon: '💬', angle: 153 },
  { name: 'Claude', icon: '✳️', angle: 204 },
  { name: 'Zapier', icon: '💥', angle: 255 },
  { name: 'Salesforce', icon: '☁️', angle: 306 },
];

const PLAYBOOKS = [
  {
    icon: <Zap className="w-6 h-6 text-[#FF5A36]" />,
    title: 'B2B SaaS Founders',
    tag: 'Most popular',
    desc: 'Identify and contact decision-makers at companies using competing tools or actively hiring for roles your product solves.',
    steps: ['Detect companies hiring for your ICP role', 'Score by tech stack match', 'Send personalized cold email + LinkedIn'],
    cta: 'Use this playbook',
  },
  {
    icon: <Users className="w-6 h-6 text-[#FF5A36]" />,
    title: 'Sales Teams (5+)',
    tag: 'Enterprise',
    desc: 'Arm every rep with a personal AI agent that surfaces warm leads from their territory and drafts outreach automatically.',
    steps: ['Assign territory & ICP per rep', 'Autonomous lead discovery daily', 'Unified inbox with 1-click approve'],
    cta: 'Get a demo',
  },
  {
    icon: <Building2 className="w-6 h-6 text-[#FF5A36]" />,
    title: 'Outbound Agencies',
    tag: 'Agency',
    desc: 'Run multichannel outreach campaigns for multiple clients simultaneously with separate agent instances and reporting.',
    steps: ['Multi-client agent management', 'White-label campaign reporting', 'Volume outreach with deliverability'],
    cta: 'Talk with us',
  },
];

const STACK_REPLACEMENTS = [
  {
    category: 'Lead Finding',
    replaces: 'Apollo & ZoomInfo',
    desc: 'Finds verified emails and mobile numbers automatically based on ICP.',
  },
  {
    category: 'Signal Tracking',
    replaces: 'Clay & PhantomBuster',
    desc: 'Monitors job changes, funding news, and social media activity 24/7.',
  },
  {
    category: 'Copywriting',
    replaces: 'AI Writers',
    desc: 'Crafts hyper-personalized icebreakers using Claude & GPT-4o.',
  },
  {
    category: 'Sequencing',
    replaces: 'Lemlist & Outreach',
    desc: 'Executes multi-step email and LinkedIn messages seamlessly.',
  },
];

export const Integrations: React.FC = () => {
  const [activePlaybook, setActivePlaybook] = useState(0);

  return (
    <section id="playbooks" className="py-20 md:py-32 bg-[#FFF9F6] relative border-b border-[#FFE0D6]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── SECTION 1: Works with the tools you already use ─── */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative p-1">
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight p-3">
            Works with the <span className="text-[#FF5A36]">tools you already use.</span>
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#475569]">
            Connects natively with your CRM, Claude, and internal tools. No manual setup.
          </p>
        </div>

        {/* Integration Hub */}
        <div className="relative py-16 px-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm mb-28 overflow-hidden">
          <div className="absolute inset-0 bg-hex-pattern opacity-20 pointer-events-none" />

          {/* Radial layout */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Central node */}
            <motion.div
              animate={{ boxShadow: ['0 0 0 0 rgba(255,90,54,0.3)', '0 0 0 20px rgba(255,90,54,0)', '0 0 0 0 rgba(255,90,54,0)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="relative p-1 mb-14"
            >
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF5A36]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF5A36]" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF5A36]" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF5A36]" />
              <div className="w-20 h-20 bg-[#FFF2ED] border-2 border-[#FFD9CD] rounded-xl flex items-center justify-center font-bold text-2xl text-[#FF5A36] shadow-md">
                gb
              </div>
            </motion.div>

            {/* Tool badges in a flex wrap */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              {TOOLS.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="relative p-0.5 group cursor-pointer"
                >
                  <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <div className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg shadow-sm flex items-center gap-2.5 group-hover:border-[#FF5A36] transition-colors">
                    <span className="text-lg leading-none">{tool.icon}</span>
                    <span className="text-xs font-bold text-[#0F172A]">{tool.name}</span>
                    <motion.div
                      animate={{ scaleX: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: Stack Replacement ─── */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative p-1">
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight p-3">
            One agent. Replaces your <span className="text-[#FF5A36]">entire outreach stack.</span>
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#475569]">
            Stop paying for tools that don&apos;t talk to each other. Gojiberry handles it end to end, for a fraction of the price.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-12 shadow-sm mb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STACK_REPLACEMENTS.map((item, i) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-5 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl hover:border-[#FF5A36]/40 transition-colors"
              >
                <span className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">{item.category}</span>
                <h4 className="text-base font-bold text-[#0F172A] mt-2">
                  Replaces <span className="line-through text-[#94A3B8] font-normal">{item.replaces}</span>
                </h4>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── SECTION 3: Playbooks ─── */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative p-1">
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight p-3">
            Ready-to-run <span className="text-[#FF5A36]">Playbooks.</span>
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#475569]">
            Launch proven outbound strategies with one click — built for your exact use case.
          </p>
        </div>

        {/* Playbook Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {PLAYBOOKS.map((pb, i) => (
            <button
              key={pb.title}
              onClick={() => setActivePlaybook(i)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg border transition-all ${
                activePlaybook === i
                  ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-md'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#FF5A36] hover:text-[#FF5A36]'
              }`}
            >
              {pb.title}
            </button>
          ))}
        </div>

        <motion.div
          key={activePlaybook}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative p-1"
        >
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#FF5A36]" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#FF5A36]" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#FF5A36]" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#FF5A36]" />

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF2ED] border border-[#FFD9CD] flex items-center justify-center">
                    {PLAYBOOKS[activePlaybook].icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">{PLAYBOOKS[activePlaybook].tag}</span>
                    <h3 className="font-heading text-xl font-extrabold text-[#0F172A]">{PLAYBOOKS[activePlaybook].title}</h3>
                  </div>
                </div>
                <p className="text-[#475569] text-sm leading-relaxed">{PLAYBOOKS[activePlaybook].desc}</p>
                <a
                  href="/signup"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] hover:bg-black text-white text-sm font-bold rounded-lg shadow transition-all"
                >
                  {PLAYBOOKS[activePlaybook].cta} <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
                </a>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl p-6">
                <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">Workflow Steps</div>
                <ol className="space-y-3">
                  {PLAYBOOKS[activePlaybook].steps.map((step, i) => (
                    <motion.li
                      key={step}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.25 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#FF5A36] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[#334155] leading-relaxed">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
