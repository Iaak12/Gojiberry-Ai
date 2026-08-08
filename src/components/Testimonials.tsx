'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// Count-up hook
function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const STATS = [
  { value: 2000, suffix: '+', label: 'Customers booking meetings with their agent' },
  { value: 3, suffix: 'hrs', label: 'Saved per day on prospecting' },
  { value: 5, prefix: '<', suffix: 'mins', label: 'From signup to agent running' },
];

const REVIEWS = [
  {
    name: 'Alessandro Paladin',
    role: 'Co-Founder at KubaLabs (B2B SaaS)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    quote: 'From just 30 leads found by Gojiberry AI, they gave us direct responses and booked meetings with Tier 1 accounts without manual effort.',
  },
  {
    name: 'Louis Debusschere',
    role: 'Founder @ Wipra (AI Company)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    quote: "We're booking 15+ demos per week with Gojiberry AI. It helped us close key accounts like Decathlon, Allianz, and AXA effortlessly.",
  },
  {
    name: 'Stuart Brent',
    role: 'Founder at SaasyDB (B2B SaaS)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    quote: 'We made our money back in the first week. Our calendar is now fully booked with warm leads Gojiberry AI found and nurtured for us.',
  },
  {
    name: 'Sophie Martin',
    role: 'Head of Sales at TechFlow',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    quote: 'Gojiberry replaced our entire SDR workflow. What used to take a team of 3 now runs autonomously. Our pipeline tripled in 60 days.',
  },
  {
    name: 'James Wu',
    role: 'CEO at DataBridge (Series A)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    quote: "The ICP filtering is incredible. We stopped wasting time on dead ends. Every lead that comes through is genuinely interested — it's night and day.",
  },
  {
    name: 'Priya Sharma',
    role: 'VP Growth at CloudOps',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    quote: 'Setup took 4 minutes. By the next morning we had 12 qualified prospects ready for outreach. Gojiberry is the best GTM investment we have made.',
  },
];

function StatCard({ value, suffix, prefix, label, animate }: { value: number; suffix: string; prefix?: string; label: string; animate: boolean }) {
  const count = useCountUp(value, 1600, animate);
  return (
    <div className="p-6 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="font-heading text-5xl sm:text-6xl font-extrabold text-[#0F172A] tracking-tight">
        {prefix}{count}{suffix}
      </div>
      <p className="mt-3 text-sm sm:text-base font-semibold text-[#475569]">{label}</p>
    </div>
  );
}

export const Testimonials: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Visible testimonials — show 3 at a time on desktop
  const CARDS_PER_PAGE = 3;
  const maxIndex = REVIEWS.length - CARDS_PER_PAGE;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const prev = () => setCarouselIndex((i) => Math.max(0, i - 1));
  const next = () => setCarouselIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section id="case-studies" className="py-20 md:py-32 bg-[#FFF9F6] relative border-b border-[#FFE0D6]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative p-1">
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight p-4">
            <span className="text-[#FF5A36]">2,000</span> teams stopped manual prospecting. Their Agents run outbound for them.
          </h2>
        </div>

        {/* Stats with Count-Up */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <StatCard {...stat} animate={statsVisible} />
            </motion.div>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Cards container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${carouselIndex * (100 / CARDS_PER_PAGE)}%` }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              style={{ width: `${(REVIEWS.length / CARDS_PER_PAGE) * 100}%` }}
            >
              {REVIEWS.map((review, index) => (
                <div
                  key={index}
                  className="relative p-1 group"
                  style={{ width: `${100 / REVIEWS.length}%` }}
                >
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 h-full flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow duration-300">
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#FFE0D6] shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">{review.name}</h4>
                          <p className="text-xs text-[#64748B] font-medium">{review.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#334155] leading-relaxed italic">
                        &ldquo;{review.quote}&rdquo;
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
                      <span className="font-medium text-[#64748B]">Verified Customer</span>
                      <Quote className="w-4 h-4 text-[#FF5A36]/50" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              disabled={carouselIndex === 0}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#475569] hover:text-[#FF5A36] hover:border-[#FF5A36] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    carouselIndex === i ? 'bg-[#FF5A36] w-6' : 'bg-[#E2E8F0] w-2 hover:bg-[#FFD9CD]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={carouselIndex >= maxIndex}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#475569] hover:text-[#FF5A36] hover:border-[#FF5A36] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
