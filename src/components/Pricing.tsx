'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';

const PRO_FEATURES = [
  '2 AI agents prospecting 24/7',
  'Up to 1,800 prospects contacted/month',
  'Warm leads sourced automatically (signals + lookalikes)',
  'Unified inbox',
  'Smart lead scoring',
  'AI Copilot mode',
  'Email waterfall enrichment (15+ data providers)',
  'CRM, API and MCP integrations (HubSpot, Pipedrive, Claude...)',
  'Live chat support',
];

const CUSTOM_FEATURES = [
  { text: 'Everything in Pro', bold: true },
  { text: 'Custom number of AI Agents prospecting 24/7' },
  { text: 'Custom number of prospects contacted/month' },
  { text: 'More senders across all channels' },
  { text: 'Dedicated customer success manager' },
  { text: 'Deep & custom integrations' },
  { text: 'Admin access & view' },
  { text: 'Priority onboarding & SLA' },
];

export const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);

  const monthlyPrice = 99;
  const annualPrice = Math.round(monthlyPrice * 0.8); // 20% off
  const displayPrice = annual ? annualPrice : monthlyPrice;

  return (
    <section id="pricing" className="py-20 md:py-32 bg-[#FFF9F6] relative border-b border-[#FFE0D6]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 relative p-1">
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight p-3">
            Simple <span className="text-[#FF5A36]">pricing</span> for all your needs
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#475569]">
            Warm Leads Found. Multichannel campaigns deployed. All in 10 Minutes.
          </p>
        </div>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-semibold transition-colors ${!annual ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
              annual ? 'bg-[#FF5A36]' : 'bg-[#E2E8F0]'
            }`}
            aria-label="Toggle annual billing"
          >
            <motion.span
              layout
              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md"
              animate={{ x: annual ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
            Annual
            <span className="ml-2 px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] font-bold rounded-full">Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* PRO PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="relative p-1 transition-all duration-300"
          >
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 sm:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#111827]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">PRO</span>
              </div>

              {/* Animated price */}
              <div className="flex items-baseline gap-1">
                <motion.span
                  key={displayPrice}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl font-extrabold text-[#0F172A]"
                >
                  ${displayPrice}
                </motion.span>
                <span className="text-sm font-semibold text-[#64748B]">/month</span>
                {annual && (
                  <span className="ml-2 text-xs text-[#94A3B8] line-through">${monthlyPrice}</span>
                )}
              </div>
              {annual && (
                <p className="mt-1 text-xs text-[#22C55E] font-semibold">Billed ${annualPrice * 12}/year — save ${(monthlyPrice - annualPrice) * 12}</p>
              )}

              <p className="mt-4 text-sm sm:text-base text-[#475569] min-h-[48px]">
                Your first AI sales rep. For founders and operators running their own outbound.
              </p>

              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-[#A7F3D0] text-[#065F46] text-xs font-bold rounded-full">Email</span>
                <span className="px-3 py-1 bg-[#FEF08A] text-[#854D0E] text-xs font-bold rounded-full">Socials</span>
                <span className="px-3 py-1 bg-[#E0E7FF] text-[#3730A3] text-xs font-bold rounded-full">LinkedIn</span>
              </div>

              <div className="mt-8">
                <a
                  href="/signup"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center group"
                >
                  <span>Try Gojiberry for free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="mt-10 pt-8 border-t border-[#E2E8F0]">
                <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">What&apos;s included</h4>
                <ul className="space-y-3 text-sm text-[#334155]">
                  {PRO_FEATURES.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#FFF2ED] text-[#FF5A36] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CUSTOM PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ y: -6 }}
            className="relative p-1 transition-all duration-300"
          >
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 sm:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#111827]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">CUSTOM</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Talk with us</h3>

              <p className="mt-4 text-sm sm:text-base text-[#475569] min-h-[48px]">
                For sales teams (5+) &amp; outbound agencies looking to scale their multichannel outreach with AI.
              </p>

              <div className="mt-14">
                <a
                  href="https://calendly.com/gojiberry/demo"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center group"
                >
                  <span>Get a demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="mt-10 pt-8 border-t border-[#E2E8F0]">
                <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">What&apos;s included</h4>
                <ul className="space-y-3 text-sm text-[#334155]">
                  {CUSTOM_FEATURES.map((feat) => (
                    <li key={feat.text} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#FFF2ED] text-[#FF5A36] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span className={feat.bold ? 'font-semibold text-[#0F172A]' : ''}>{feat.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-[#94A3B8] mt-8">
          All prices in USD. Cancel anytime. Free trial available — no credit card required.
        </p>

      </div>
    </section>
  );
};
