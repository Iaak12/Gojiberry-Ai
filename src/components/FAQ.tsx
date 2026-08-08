'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'How quickly can I launch my first sales campaign?',
    answer: 'Setup takes under 5 minutes. Simply enter your website URL, and Gojiberry automatically analyzes your value proposition, target ICP, and ideal buyer personas to start prospecting immediately.',
  },
  {
    question: 'How does Gojiberry AI find and verify buying signals?',
    answer: 'Gojiberry scans over 100,000+ daily social and web intent signals including hiring posts, product updates, executive changes, and competitor interactions to score and prioritize prospects. Signals are refreshed every 24 hours.',
  },
  {
    question: 'Will Gojiberry replace my existing sales tools?',
    answer: 'Yes! Gojiberry combines lead databases (Apollo, ZoomInfo), enrichment waterfalls (Clay), AI copywriting (Claude), and multi-channel sequencers into one unified autonomous agent — for a fraction of the combined cost.',
  },
  {
    question: 'Does Gojiberry integrate with HubSpot, Salesforce, and Pipedrive?',
    answer: 'Absolutely. Gojiberry features native bi-directional synchronization with major CRMs, ensuring all qualified leads, drafted replies, and booked calendar meetings flow straight into your pipeline without any manual work.',
  },
  {
    question: 'How does email enrichment and deliverability work?',
    answer: 'Gojiberry uses a 15+ provider waterfall enrichment process to guarantee 98%+ email accuracy, combined with automated warm-up and domain protection protocols so your emails land in inboxes, not spam.',
  },
  {
    question: 'What happens when a prospect replies to an outreach message?',
    answer: 'Gojiberry notifies you in a unified inbox and generates a recommended, hyper-personalized reply ready for your 1-click approval or auto-sending. You stay in control of every conversation.',
  },
  {
    question: 'Is Gojiberry compliant with GDPR and CAN-SPAM?',
    answer: 'Yes. Gojiberry is built with compliance in mind. It honors opt-out requests, never contacts blacklisted domains, and includes full data processing agreements. We are hosted in the EU and are fully GDPR compliant.',
  },
  {
    question: 'Can I use Gojiberry for LinkedIn outreach as well as email?',
    answer: 'Yes. Gojiberry handles multichannel outreach across email and LinkedIn simultaneously. Connection requests, follow-up DMs, and email sequences are all coordinated automatically in one workflow.',
  },
  {
    question: 'What is the difference between the Pro and Custom plans?',
    answer: 'The Pro plan gives you 2 AI agents contacting up to 1,800 prospects per month — ideal for founders and solo operators. The Custom plan is for teams of 5+ or agencies that need custom agent counts, volume, senders, and a dedicated CSM.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32 bg-[#FFF9F6] relative border-b border-[#FFE0D6]/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative p-1">
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#111827]/30" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#111827]/30" />
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight p-3">
            Frequently Asked <span className="text-[#FF5A36]">Questions</span>
          </h2>
          <p className="mt-2 text-base text-[#475569]">
            Everything you need to know about setting up your AI sales agent.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="relative p-0.5"
              >
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#111827]/20" />
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#111827]/20" />
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#111827]/20" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#111827]/20" />

                <div className={`bg-white border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 ${isOpen ? 'border-[#FF5A36]/30' : 'border-[#E2E8F0]'}`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#0F172A] hover:text-[#FF5A36] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#FF5A36] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-[#475569] leading-relaxed border-t border-[#F1F5F9] pt-4"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chat with us CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="text-[#475569] text-sm mb-4">Still have questions? We&apos;re here to help.</p>
          <a
            href="/signup"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border border-[#E2E8F0] rounded-xl shadow-sm text-sm font-semibold text-[#0F172A] hover:border-[#FF5A36] hover:text-[#FF5A36] transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#FF5A36]" />
            <span>Chat with us</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};
