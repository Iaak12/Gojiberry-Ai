'use client';

import React from 'react';
import { Star } from 'lucide-react';

const LOGOS = [
  { name: 'genesis', badge: 'COMPUTING', color: '#111827' },
  { name: 'HubSpot', badge: '', color: '#FF7A59' },
  { name: 'NOKIA', badge: '', color: '#005AFF' },
  { name: 'mindflow', badge: '•', color: '#111827' },
  { name: 'FREEP!K', badge: '', color: '#1264E7' },
  { name: 'noota.', badge: '', color: '#111827' },
  { name: 'salesforce', badge: '', color: '#00A1E0' },
  { name: 'MariaDB', badge: '', color: '#003545' },
  { name: 'Decathlon', badge: '', color: '#0082C3' },
  { name: 'Allianz', badge: '', color: '#003781' },
  { name: 'Pipedrive', badge: '', color: '#2B2D36' },
  { name: 'Zapier', badge: '', color: '#FF4A00' },
];

// Duplicate for seamless loop
const ALL_LOGOS = [...LOGOS, ...LOGOS];

export const LogoCloud: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FFF9F6] relative border-b border-[#FFE2D8]/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        {/* Star Rating Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="flex items-center gap-1 text-[#FF5A36]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current text-[#FF5A36]" />
            ))}
          </div>
          <span className="text-base sm:text-lg font-bold text-[#0F172A]">
            Trusted by 2,000+ sales &amp; GTM teams worldwide
          </span>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#FFF9F6] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#FFF9F6] to-transparent pointer-events-none" />

        <div
          className="flex gap-4 w-max"
          style={{
            animation: 'marquee 32s linear infinite',
          }}
        >
          {ALL_LOGOS.map((logo, index) => (
            <div
              key={index}
              className="relative p-0.5 group shrink-0"
            >
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30 group-hover:border-[#FF5A36] transition-colors" />

              <div className="h-20 w-44 bg-[#FFF2ED]/70 hover:bg-[#FFE8E0] border border-[#FFDCD0] rounded-sm flex items-center justify-center px-5 transition-all duration-200">
                <span
                  className="font-heading font-extrabold text-lg tracking-tight group-hover:scale-105 transition-transform select-none"
                  style={{ color: logo.color }}
                >
                  {logo.name}
                  {logo.badge && (
                    <span className="ml-1 text-[10px] px-1 py-0.5 bg-[#FF5A36] text-white rounded font-mono">
                      {logo.badge}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};
