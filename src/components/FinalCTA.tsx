'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Star } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = websiteUrl.trim() || 'https://yourwebsite.com';
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = `/signup?website=${encodeURIComponent(url)}`;
      setSubmitted(false);
      setWebsiteUrl('');
    }, 600);
  };

  return (
    <section className="py-20 md:py-32 bg-[#FFF9F6] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative p-1">
          <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FF5A36]" />
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FF5A36]" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FF5A36]" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FF5A36]" />

          <div className="bg-gradient-to-b from-[#FFF2ED] via-white to-[#FFE2D8] border border-[#FFD9CD] rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-hex-pattern opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF5A36]/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Your next <span className="text-[#FF5A36]">10 customers</span> are already out there.
              </h2>
              <p className="mt-4 text-base sm:text-xl font-medium text-[#475569]">
                Let your agent find them.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="url"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="flex-1 px-4 py-3.5 bg-white border border-[#CBD5E1] rounded-xl text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/20 shadow-sm placeholder-[#94A3B8]"
                />
                <button
                  type="submit"
                  disabled={submitted}
                  className="px-6 py-3.5 bg-[#111827] hover:bg-black disabled:opacity-70 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {submitted ? (
                    <span className="animate-pulse">Launching...</span>
                  ) : (
                    <>
                      <span>Launch my agent for free</span>
                      <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
                    </>
                  )}
                </button>
              </form>

              {/* Micro trust badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#64748B]">
                <span>Free Trial</span>
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                <span>Live in 5 minutes</span>
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                <span>Cancel anytime</span>
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                <span>No credit card required</span>
              </div>

              {/* Trust row */}
              <div className="mt-10 pt-8 border-t border-[#FFD9CD] flex flex-wrap items-center justify-center gap-6">
                {/* YC Badge */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white/70 border border-[#FFD9CD] rounded-lg">
                  <span className="w-5 h-5 bg-[#FF6600] text-white font-bold flex items-center justify-center text-[10px] rounded-[2px] font-mono">Y</span>
                  <span className="text-xs font-bold text-[#111827]">Y Combinator P26</span>
                </div>

                {/* Product Hunt */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white/70 border border-[#FFD9CD] rounded-lg">
                  <span className="text-base">🏅</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#FF5A36]">Product Hunt</div>
                    <div className="text-[11px] font-extrabold text-[#0F172A]">#1 Product of the Day</div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white/70 border border-[#FFD9CD] rounded-lg">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#111827]">4.9 / 5</span>
                </div>

                {/* GDPR */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white/70 border border-[#FFD9CD] rounded-lg">
                  <Shield className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-xs font-bold text-[#111827]">GDPR Compliant · EU Hosted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
