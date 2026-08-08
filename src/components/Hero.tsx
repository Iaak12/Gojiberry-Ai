'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX, Sparkles, X, Play, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEMO_PROSPECTS = [
  { initials: 'EG', color: '#FF5A36', name: 'Emma Garcia', signal: 'Viewed pricing page 3x', score: 98, label: 'High Intent', labelColor: '#22C55E' },
  { initials: 'NP', color: '#111827', name: 'Noah Patel', signal: 'Booked Demo · 11:30 AM', score: 95, label: 'Demo Booked', labelColor: '#3B82F6' },
  { initials: 'OL', color: '#8B5CF6', name: 'Olivia Lee', signal: 'Followed on LinkedIn', score: 81, label: 'Engaged', labelColor: '#F59E0B' },
  { initials: 'MR', color: '#10B981', name: 'Marcus Reed', signal: 'Competitor search intent', score: 76, label: 'High Intent', labelColor: '#22C55E' },
];

export const Hero: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);

  // Stagger prospect cards
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    DEMO_PROSPECTS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCards(i + 1), 600 + i * 350));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = websiteUrl.trim() || 'https://yourwebsite.com';
    window.location.href = `/signup?website=${encodeURIComponent(url)}`;
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-goji-mesh bg-hex-pattern">

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#FF5A36]/10 via-[#FF8A65]/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Y Combinator Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="relative inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#FFF2ED] border border-[#FFD9CD] rounded-sm text-xs font-semibold text-[#111827]">
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-[#FF5A36]/60" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#FF5A36]/60" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-[#FF5A36]/60" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-[#FF5A36]/60" />
            <span className="w-4 h-4 bg-[#FF6600] text-white font-bold flex items-center justify-center text-[10px] rounded-[2px] font-mono">Y</span>
            <span>Backed by <span className="text-[#FF5A36] font-bold">Y Combinator</span> P26</span>
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-[1.08] max-w-5xl mx-auto"
        >
          Your AI agent finds high intent leads and contacts them for you.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Enter your website. Gojiberry learns your business, identifies your best
          prospects, and runs multichannel outreach automatically.
        </motion.p>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-9 max-w-2xl mx-auto"
        >
          <div className="relative p-1">
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#111827]/40" />

            <form
              onSubmit={handleLaunch}
              className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-[#E2E8F0] shadow-md rounded-lg"
            >
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 text-sm sm:text-base text-[#0F172A] placeholder-[#94A3B8] outline-none bg-transparent"
              />
              <button
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap px-6 py-3 bg-[#111827] hover:bg-[#000000] text-white font-semibold text-sm rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Launch my agent for free</span>
                <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
              </button>
            </form>
          </div>
          <p className="mt-3 text-xs text-[#94A3B8] text-center">Free trial · No credit card required · Live in 5 minutes</p>
        </motion.div>

        {/* Hero App Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-14 max-w-4xl mx-auto relative"
        >
          <div className="relative p-1">
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#111827]/40" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#111827]/40" />

            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xl overflow-hidden text-left">

              {/* Browser Bar */}
              <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-md text-xs font-mono text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
                  <span>localhost:3000/dashboard</span>
                </div>
                <div className="w-10" />
              </div>

              {/* Mockup Content */}
              <div className="relative min-h-[380px] sm:min-h-[460px] bg-gradient-to-br from-[#FFF9F6] via-white to-[#FFF2ED] flex flex-col items-center justify-center p-6 text-center overflow-hidden">

                <div className="absolute inset-0 opacity-30 bg-hex-pattern pointer-events-none" />

                <div className="relative z-10 w-full max-w-2xl space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] text-xs font-semibold border border-[#FF5A36]/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Autonomous GTM Engine · Running</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse ml-1" />
                  </div>

                  <h3 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    Identifying <span className="text-[#FF5A36]">480+</span> High Intent Prospects
                  </h3>

                  {/* Animated Prospect Cards */}
                  <div className="flex flex-col gap-2.5 max-w-sm mx-auto w-full">
                    {DEMO_PROSPECTS.map((p, i) => (
                      <AnimatePresence key={p.name}>
                        {visibleCards > i && (
                          <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="px-3 py-2.5 bg-white border border-[#FFE2D8] rounded-lg shadow-sm flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                                style={{ backgroundColor: p.color }}
                              >
                                {p.initials}
                              </div>
                              <div className="text-left">
                                <div className="font-bold text-[#0F172A] text-xs">{p.name}</div>
                                <div className="text-[10px] text-[#64748B] mt-0.5">{p.signal}</div>
                              </div>
                            </div>
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap ml-2"
                              style={{ backgroundColor: p.labelColor }}
                            >
                              {p.label} · {p.score}%
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>
                </div>

                {/* Play Demo Button */}
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 bg-[#111827] hover:bg-[#000] text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 text-[#FF5A36] fill-[#FF5A36]" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-14 flex justify-center"
        >
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-xs text-[#94A3B8] hover:text-[#FF5A36] transition-colors group"
          >
            <span>Explore features</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-[#FF5A36]" />
          </a>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Gojiberry AI Demo"
                allow="autoplay; fullscreen"
                className="absolute inset-0 w-full h-full"
              />
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
