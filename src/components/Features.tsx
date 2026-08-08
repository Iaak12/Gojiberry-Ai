'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle, Sparkles, MessageSquare, ArrowRight, Zap, Globe, Mail, Linkedin, BarChart2, RefreshCw } from 'lucide-react';

const TAB_CONTENT = {
  connect: {
    heading: 'Connect in 3 minutes',
    subheading: 'Enter your website URL. Gojiberry reads your business, your ICP, and your value prop — no manual setup needed.',
    steps: [
      { icon: <Globe className="w-5 h-5 text-[#FF5A36]" />, label: 'Enter your website URL', detail: 'Gojiberry reads your homepage, product pages, and positioning.' },
      { icon: <Sparkles className="w-5 h-5 text-[#FF5A36]" />, label: 'AI builds your ICP', detail: 'Your ideal customer profile is created automatically based on your business.' },
      { icon: <CheckCircle className="w-5 h-5 text-[#FF5A36]" />, label: 'Agent activates instantly', detail: 'Your AI sales rep is live and scanning for prospects within minutes.' },
    ],
  },
  prospect: {
    heading: 'Find warm leads automatically',
    subheading: 'Your agent scans 15+ signals every day — job posts, funding rounds, competitor activity — and scores every lead.',
    steps: [
      { icon: <Zap className="w-5 h-5 text-[#FF5A36]" />, label: '15+ intent signals monitored', detail: 'Hiring for sales roles, new funding, LinkedIn activity, competitor reviews & more.' },
      { icon: <BarChart2 className="w-5 h-5 text-[#FF5A36]" />, label: 'AI lead scoring against ICP', detail: 'Every prospect is ranked 0–100 based on fit, recency, and intent signal strength.' },
      { icon: <RefreshCw className="w-5 h-5 text-[#FF5A36]" />, label: 'Refreshed daily', detail: 'New leads are added and re-scored every 24 hours so your pipeline stays warm.' },
    ],
  },
  convert: {
    heading: 'Book demos on autopilot',
    subheading: 'Your agent reaches out via email and LinkedIn with hyper-personalized messages — and handles replies for you.',
    steps: [
      { icon: <Mail className="w-5 h-5 text-[#FF5A36]" />, label: 'Personalized email sequences', detail: 'Claude-powered icebreakers that reference the exact signal that triggered the outreach.' },
      { icon: <Linkedin className="w-5 h-5 text-[#FF5A36]" />, label: 'LinkedIn DM outreach', detail: 'Automated connection requests and messages coordinated with email timing.' },
      { icon: <MessageSquare className="w-5 h-5 text-[#FF5A36]" />, label: '1-click reply approval', detail: 'When prospects reply, Gojiberry drafts the perfect response for your approval.' },
    ],
  },
};

type TabKey = keyof typeof TAB_CONTENT;

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('connect');

  return (
    <section id="features" className="py-20 md:py-32 bg-[#FFF9F6] relative overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="relative inline-block mb-3">
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-[#FF5A36]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#FF5A36]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-[#FF5A36]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-[#FF5A36]" />
            <span className="px-3 py-1 bg-[#FFF2ED] text-[#FF5A36] text-xs font-bold uppercase tracking-wider rounded-[2px]">
              Autonomous Sales Agent
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Your sales agent runs <span className="text-[#FF5A36]">24/7.</span> And gets <span className="text-[#FF5A36]">better every week.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            From finding the right leads to sending the right message, your agent handles it all, automatically.
          </p>
        </div>

        {/* Mindmap Visualization */}
        <div className="relative p-1 mb-20 max-w-4xl mx-auto">
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 sm:p-12 shadow-sm relative overflow-hidden text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {['Follows your company', 'Active in your space', 'Competitor engagement'].map((label) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="p-3 bg-[#FFF2ED] border border-[#FFDCD0] rounded-lg text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                  {label}
                </motion.div>
              ))}
            </div>

            {/* Central Node */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-28 h-28 bg-gradient-to-b from-[#E2E8F0] to-[#CBD5E1] rounded-2xl shadow-inner flex items-center justify-center relative border border-white"
              >
                <div className="w-16 h-16 bg-[#FF5A36] rounded-xl flex items-center justify-center text-white shadow-lg font-bold text-2xl">
                  gb
                </div>
              </motion.div>
              <span className="mt-3 text-xs font-bold text-[#64748B] uppercase tracking-widest">Gojiberry AI Core Engine</span>
            </div>

            <div className="mt-8 text-xs text-[#64748B] font-medium">
              Continuously processing 100,000+ daily social &amp; intent signals
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-16">

          {/* Card 1/4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative p-1"
          >
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-10 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF2ED] text-[#FF5A36] text-xs font-bold rounded-sm mb-4">
                <span>🧱 1/4</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
                Finds &amp; scores your best leads first
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[#475569] max-w-3xl">
                Your agent detects buying &amp; social signals, scores every prospect against your ideal customer, and prioritizes the ones most likely to convert — before reaching out.
              </p>
              <div className="mt-8 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 max-w-xl space-y-3">
                {[
                  { init: 'ET', bg: '#3B82F6', name: 'Emma Thompson', role: 'Marketing Director', score: 76, color: '#FF5A36', label: 'high intent' },
                  { init: 'NP', bg: '#10B981', name: 'Noah Patel', role: 'Product Manager', score: 67, color: '#EAB308', label: 'medium intent' },
                  { init: 'OG', bg: '#8B5CF6', name: 'Olivia Garcia', role: 'Customer Success Manager', score: 42, color: '#94A3B8', label: 'low intent' },
                ].map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="p-3 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: p.bg }}>{p.init}</div>
                      <div>
                        <div className="text-sm font-bold text-[#0F172A]">{p.name}</div>
                        <div className="text-xs text-[#64748B]">{p.role}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-white text-[11px] font-bold rounded-full" style={{ backgroundColor: p.color }}>
                      {p.label} {p.score}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2/4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative p-1"
          >
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-10 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF2ED] text-[#FF5A36] text-xs font-bold rounded-sm mb-4">
                <span>🧱 2/4</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
                Only your best prospects. Nothing else.
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[#475569] max-w-3xl">
                Every lead is pre-filtered to match your ideal buyer profile. Your agent never wastes a message on someone who was never going to buy.
              </p>
              <div className="mt-8 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 overflow-x-auto">
                <div className="min-w-[420px] space-y-4">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
                    <div className="w-20 shrink-0">10:00 AM</div>
                    <div className="flex-1 h-px bg-[#E2E8F0]" />
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-20 shrink-0 text-[#64748B] font-mono pt-3">11:00 AM</div>
                    <div className="flex-1 p-3 bg-[#FFD9D0] border-l-4 border-[#FF5A36] rounded text-[#0F172A]">
                      <div className="font-bold">HubSpot &lt;&gt; Gojiberry AI</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">11:00 - 11:30 AM · Discovery Call</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-20 shrink-0 text-[#64748B] font-mono pt-3">11:45 AM</div>
                    <div className="flex-1 p-3 bg-[#FEF08A] border-l-4 border-[#EAB308] rounded text-[#0F172A]">
                      <div className="font-bold">Demo Gojiberry AI</div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">11:45 - 01:00 PM · Venue: Zoom Call</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
                    <div className="w-20 shrink-0">01:00 PM</div>
                    <div className="flex-1 h-px bg-[#E2E8F0]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3/4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative p-1"
          >
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-10 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF2ED] text-[#FF5A36] text-xs font-bold rounded-sm">
                  <span>🧱 3/4</span>
                </div>
                <div className="px-3 py-1 bg-[#F4F4F5] border border-[#E4E4E7] rounded-full text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <span>Powered by</span>
                  <span className="font-bold text-[#D97706]">✴ Claude</span>
                </div>
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
                Multichannel outreach that books demos
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[#475569] max-w-3xl">
                Your agent reaches out via email and LinkedIn with AI-personalized messages, coordinated automatically — no sequences to build.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {[
                  { week: 'Week 1', count: 'Initial 50 Verified Leads', dots: 1 },
                  { week: 'Week 3', count: '280 Qualified Prospects', dots: 3 },
                  { week: 'Week 5', count: 'Exponential Outreach', dots: 5 },
                ].map((item) => (
                  <motion.div
                    key={item.week}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="p-6 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center min-h-[160px]"
                  >
                    <div className="flex gap-1 mb-3 flex-wrap justify-center">
                      {[...Array(item.dots)].map((_, j) => (
                        <span key={j} className="w-3 h-3 rounded-full bg-[#FF5A36]" style={{ opacity: 0.5 + j * 0.1 }} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{item.week}</span>
                    <span className="text-xs text-[#64748B] mt-1">{item.count}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 4/4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative p-1"
          >
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-10 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF2ED] text-[#FF5A36] text-xs font-bold rounded-sm mb-4">
                <span>🧱 4/4</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
                Gets better every week
              </h3>
              <p className="mt-3 text-base sm:text-lg text-[#475569] max-w-3xl">
                Your agent tracks what converts, adjusts automatically, and benchmarks your campaigns against top performers in your industry.
              </p>
              <div className="mt-8">
                <a
                  href="/signup"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#111827] hover:bg-black text-white text-sm font-bold rounded-lg shadow-md transition-all"
                >
                  Launch my agent for free
                  <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3 Minutes Setup Tabs Section */}
        <div className="mt-28 relative p-1">
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 sm:p-12 shadow-sm">
            <div className="text-center">
              <h3 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                <span className="text-[#FF5A36]">3 minutes</span> to set up. First results today.
              </h3>
              <p className="mt-3 text-base text-[#475569]">Enter your website. Your agent takes it from there.</p>
            </div>

            {/* Tabs */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 border-b border-[#E2E8F0] pb-0 text-lg font-bold">
              {(Object.keys(TAB_CONTENT) as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 capitalize transition-all duration-200 relative ${
                    activeTab === tab
                      ? 'text-[#FF5A36]'
                      : 'text-[#94A3B8] hover:text-[#0F172A]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A36]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h4 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                      {TAB_CONTENT[activeTab].heading}
                    </h4>
                    <p className="mt-3 text-[#475569] text-base leading-relaxed">
                      {TAB_CONTENT[activeTab].subheading}
                    </p>
                    <ul className="mt-8 space-y-5">
                      {TAB_CONTENT[activeTab].steps.map((step, i) => (
                        <motion.li
                          key={step.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#FFF2ED] border border-[#FFD9CD] flex items-center justify-center shrink-0">
                            {step.icon}
                          </div>
                          <div>
                            <div className="font-bold text-[#0F172A] text-sm">{step.label}</div>
                            <div className="text-xs text-[#64748B] mt-1 leading-relaxed">{step.detail}</div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                    <a
                      href="/signup"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-sm rounded-lg shadow transition-all"
                    >
                      Get started free <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Visual panel */}
                  <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl p-6 min-h-[280px] flex items-center justify-center">
                    <motion.div
                      key={activeTab + '-visual'}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-20 h-20 mx-auto bg-[#FF5A36]/10 rounded-2xl border border-[#FFD9CD] flex items-center justify-center">
                        {activeTab === 'connect' && <Globe className="w-9 h-9 text-[#FF5A36]" />}
                        {activeTab === 'prospect' && <Zap className="w-9 h-9 text-[#FF5A36]" />}
                        {activeTab === 'convert' && <Calendar className="w-9 h-9 text-[#FF5A36]" />}
                      </div>
                      <p className="text-sm font-semibold text-[#475569] max-w-[200px] mx-auto">
                        {activeTab === 'connect' && 'Setup takes under 3 minutes with no manual configuration'}
                        {activeTab === 'prospect' && 'Fresh warm leads discovered and scored every single day'}
                        {activeTab === 'convert' && 'Demos booked automatically while you focus on closing'}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
