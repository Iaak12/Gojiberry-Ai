'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, ChevronDown, Zap, Users, BarChart2, Mail, Link2, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FEATURES_DROPDOWN = [
  { icon: <Zap className="w-4 h-4 text-[#FF5A36]" />, label: 'Intent Signals', desc: '15+ buying signals detected daily' },
  { icon: <Users className="w-4 h-4 text-[#FF5A36]" />, label: 'Lead Scoring', desc: 'AI-powered ICP match scoring' },
  { icon: <Mail className="w-4 h-4 text-[#FF5A36]" />, label: 'Multichannel Outreach', desc: 'Email & social outreach automated' },
  { icon: <BarChart2 className="w-4 h-4 text-[#FF5A36]" />, label: 'Analytics', desc: 'Campaign performance tracking' },
  { icon: <Link2 className="w-4 h-4 text-[#FF5A36]" />, label: 'Integrations', desc: 'HubSpot, Pipedrive, Claude & more' },
  { icon: <Brain className="w-4 h-4 text-[#FF5A36]" />, label: 'AI Copilot', desc: 'Draft replies & approve with 1 click' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active section tracking
      const sections = ['features', 'playbooks', 'case-studies', 'pricing'];
      const offsets = sections.map((id) => {
        const el = document.getElementById(id);
        return el ? { id, top: el.getBoundingClientRect().top } : null;
      }).filter(Boolean) as { id: string; top: number }[];

      const current = offsets.filter((s) => s.top <= 120).pop();
      setActiveSection(current ? current.id : '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    setFeaturesOpen(false);
  };

  const isActive = (id: string) => activeSection === id;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav-light py-3 border-b border-[#FFE8E0]/70 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Gojiberry Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A36] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 2.89.21 5.37 1.83 6.64 4.28 1.12 2.15 1.08 4.29.15 5.44zm1.14-11.85c-1.63-.78-2.97-2.09-3.76-3.72-.78 1.63-2.12 2.94-3.75 3.72 1.63.78 2.97 2.09 3.75 3.72.79-1.63 2.13-2.94 3.76-3.72zM19.79 10.21c.13.58.21 1.17.21 1.79 0 4.08-3.05 7.44-7 7.93-.93-1.15-.97-3.29.15-5.44 1.27-2.45 3.75-4.07 6.64-4.28z"/>
              </svg>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-[#111827]">
              gojiberry
            </span>
          </a>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">

            {/* Features with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, 'features')}
                className={`hover:text-[#111827] transition-colors flex items-center gap-1 group ${isActive('features') ? 'text-[#FF5A36]' : ''}`}
              >
                <span>Features</span>
                <sup className={`text-[10px] font-mono group-hover:text-[#FF5A36] ${isActive('features') ? 'text-[#FF5A36]' : 'text-[#94A3B8]'}`}>01</sup>
                <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`} />
              </a>

              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-3 grid grid-cols-2 gap-1.5"
                  >
                    {FEATURES_DROPDOWN.map((f) => (
                      <a
                        key={f.label}
                        href="#features"
                        onClick={(e) => scrollToSection(e, 'features')}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[#FFF2ED] transition-colors group"
                      >
                        <div className="mt-0.5 shrink-0">{f.icon}</div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#FF5A36] transition-colors">{f.label}</div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">{f.desc}</div>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#playbooks"
              onClick={(e) => scrollToSection(e, 'playbooks')}
              className={`hover:text-[#111827] transition-colors flex items-center gap-1 group ${isActive('playbooks') ? 'text-[#FF5A36]' : ''}`}
            >
              <span>Playbooks</span>
              <sup className={`text-[10px] font-mono group-hover:text-[#FF5A36] ${isActive('playbooks') ? 'text-[#FF5A36]' : 'text-[#94A3B8]'}`}>02</sup>
            </a>
            <a
              href="#case-studies"
              onClick={(e) => scrollToSection(e, 'case-studies')}
              className={`hover:text-[#111827] transition-colors flex items-center gap-1 group ${isActive('case-studies') ? 'text-[#FF5A36]' : ''}`}
            >
              <span>Case Studies</span>
              <sup className={`text-[10px] font-mono group-hover:text-[#FF5A36] ${isActive('case-studies') ? 'text-[#FF5A36]' : 'text-[#94A3B8]'}`}>03</sup>
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className={`hover:text-[#111827] transition-colors flex items-center gap-1 group ${isActive('pricing') ? 'text-[#FF5A36]' : ''}`}
            >
              <span>Pricing</span>
              <sup className={`text-[10px] font-mono group-hover:text-[#FF5A36] ${isActive('pricing') ? 'text-[#FF5A36]' : 'text-[#94A3B8]'}`}>04</sup>
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">

            {/* Login */}
            <div className="relative group p-0.5">
              <span className="absolute -top-1 -left-1 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-[#FF5A36]/40" />
              <span className="absolute -top-1 -right-1 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#FF5A36]/40" />
              <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-[#FF5A36]/40" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-[#FF5A36]/40" />
              <a
                href="/login"
                className="block px-5 py-2 text-sm font-medium text-[#111827] bg-[#FFF2ED]/80 hover:bg-[#FFE5DC] transition-colors rounded-sm"
              >
                Login
              </a>
            </div>

            {/* Start for free */}
            <div className="relative p-0.5 group">
              <span className="absolute -top-1 -left-1 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-[#111827]/40" />
              <span className="absolute -top-1 -right-1 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#111827]/40" />
              <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-[#111827]/40" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-[#111827]/40" />
              <a
                href="/signup"
                className="inline-flex items-center bg-[#F4F4F5] hover:bg-[#E4E4E7] border border-[#E4E4E7] transition-all overflow-hidden rounded-sm group"
              >
                <div className="w-9 h-9 bg-[#FF5A36] flex items-center justify-center text-white group-hover:bg-[#E04826] transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="px-4 text-sm font-semibold text-[#111827]">
                  Start for free
                </span>
              </a>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#111827] hover:bg-[#FFEAE2] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-nav-light border-b border-[#FFE0D6] overflow-hidden"
          >
            <div className="px-5 py-6 space-y-3">
              {[
                { label: 'Features', id: 'features', num: '01' },
                { label: 'Playbooks', id: 'playbooks', num: '02' },
                { label: 'Case Studies', id: 'case-studies', num: '03' },
                { label: 'Pricing', id: 'pricing', num: '04' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-base font-medium hover:bg-[#FFEFEA] transition-colors ${isActive(item.id) ? 'text-[#FF5A36] bg-[#FFF2ED]' : 'text-[#111827]'}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-[#94A3B8] font-mono">{item.num}</span>
                </a>
              ))}

              <div className="pt-4 border-t border-[#FFE0D6] flex flex-col gap-3">
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-[#111827] bg-[#FFF2ED] hover:bg-[#FFE5DC] rounded-lg transition-colors"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-[#111827] rounded-lg shadow-md"
                >
                  <span>Start for free</span>
                  <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
