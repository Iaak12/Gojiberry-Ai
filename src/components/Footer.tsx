import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

const FOOTER_LINKS = {
  Sections: [
    { label: 'Features', href: '#features' },
    { label: 'Playbooks', href: '#playbooks' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Features: [
    { label: 'Intent Signals', href: '#features' },
    { label: 'Lead Scoring', href: '#features' },
    { label: 'Multichannel Outreach', href: '#features' },
    { label: 'Connect MCP', href: '/mcp' },
    { label: 'AI Copilot', href: '#features' },
  ],
  Information: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Affiliate Program', href: '/affiliate' },
    { label: 'General Terms', href: '/terms' },
    { label: 'Legal Notice', href: '/legal' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Opt-out & Privacy Request', href: '/opt-out' },
    { label: 'System Status', href: 'https://status.gojiberry.ai' },
    { label: 'Jobs', href: '/careers' },
    { label: 'Cookie Settings', href: '#' },
  ],
};

const LANGUAGES = [
  { code: 'EN', label: 'English', href: 'https://gojiberry.ai/' },
  { code: 'FR', label: 'Français', href: 'https://gojiberry.ai/fr/' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-16 pb-12 relative text-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[#F1F5F9]">

          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF5A36] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                gb
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[#0F172A]">
                gojiberry
              </span>
            </div>
            <p className="text-sm font-semibold text-[#475569]">Your AI GTM Team.</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xs">
              Gojiberry AI detects warm leads from 15+ buying signals, filters by your ICP, and runs personalized outreach to book qualified demos automatically.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com/gojiberry_ai"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-sm font-bold text-[#0F172A] transition-colors"
                aria-label="Gojiberry on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/gojiberry"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-sm font-bold text-[#0F172A] transition-colors"
                aria-label="Gojiberry on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Link Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title} className={title === 'Information' ? 'col-span-2 sm:col-span-1' : ''}>
                <h4 className="font-bold text-[#0F172A] text-sm mb-4">{title}</h4>
                <ul className="space-y-2.5 text-[#475569]">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="hover:text-[#FF5A36] transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#64748B]">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 GojiberryAI — Made &amp; Hosted in the EU 🇪🇺</span>

            {/* Language selector */}
            <div className="flex items-center gap-1 border border-[#E2E8F0] rounded-lg overflow-hidden">
              {LANGUAGES.map((lang, i) => (
                <a
                  key={lang.code}
                  href={lang.href}
                  className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                    i === 0
                      ? 'bg-[#FFF2ED] text-[#FF5A36]'
                      : 'text-[#475569] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {lang.code}
                </a>
              ))}
            </div>
          </div>

          {/* Product Hunt Badge */}
          <div className="px-4 py-2 border border-[#FFD9CD] bg-[#FFF2ED] rounded-xl flex items-center gap-2 shadow-sm">
            <span className="text-base">🏅</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#FF5A36]">Product Hunt</div>
              <div className="text-xs font-extrabold text-[#0F172A]">#1 Product of the Day</div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
