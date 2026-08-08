import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service – Gojiberry AI',
  description: 'Read the Gojiberry AI Terms of Service.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using Gojiberry AI ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: '2. Description of Service',
    content: `Gojiberry AI provides an autonomous AI-powered sales prospecting and outreach platform. The Service includes lead discovery, intent signal tracking, personalized outreach generation, CRM integrations, and related analytics features. Features may be added, modified, or removed at our discretion.`,
  },
  {
    title: '3. Account Registration',
    content: `You must register for an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information and keep your account information up-to-date. You must be at least 18 years old and authorized to enter into contracts on behalf of your organization.`,
  },
  {
    title: '4. Acceptable Use',
    content: `You agree not to use the Service for unlawful purposes, to send spam or unsolicited commercial communications in violation of applicable law, to harvest or collect contact information without consent, to circumvent opt-out mechanisms, to upload malicious code, or to interfere with the Service's operation. You are solely responsible for ensuring your use of the Service complies with applicable anti-spam laws including CAN-SPAM, GDPR, and CASL.`,
  },
  {
    title: '5. Subscription and Billing',
    content: `Some features of the Service require a paid subscription. You agree to pay all fees in accordance with the pricing plan selected. Fees are billed in advance on a monthly or annual basis. All fees are exclusive of taxes. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. No refunds are provided for partial periods.`,
  },
  {
    title: '6. Data and Privacy',
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We process personal data in accordance with the GDPR and other applicable data protection laws. We maintain appropriate technical and organizational measures to protect your data. We act as a data processor for personal data you provide; you act as data controller.`,
  },
  {
    title: '7. Intellectual Property',
    content: `The Service and its original content, features, and functionality are owned by GojiberryAI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of any data you upload or generate through the Service. We grant you a limited, non-exclusive, non-transferable license to use the Service for your internal business purposes.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `In no event shall GojiberryAI be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, goodwill, or other intangible losses, resulting from your use of the Service. Our total cumulative liability shall not exceed the amount paid by you to us in the twelve months preceding the claim.`,
  },
  {
    title: '9. Termination',
    content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately. All provisions that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will notify you of material changes via email or a prominent notice in the Service at least 14 days before the effective date. Your continued use of the Service after the effective date constitutes acceptance of the revised Terms.`,
  },
  {
    title: '11. Contact',
    content: `If you have any questions about these Terms, please contact us at legal@gojiberry.ai or GojiberryAI, 1 Rue de Rivoli, 75001 Paris, France.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F6]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A36] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 2.89.21 5.37 1.83 6.64 4.28 1.12 2.15 1.08 4.29.15 5.44zm1.14-11.85c-1.63-.78-2.97-2.09-3.76-3.72-.78 1.63-2.12 2.94-3.75 3.72 1.63.78 2.97 2.09 3.75 3.72.79-1.63 2.13-2.94 3.76-3.72zM19.79 10.21c.13.58.21 1.17.21 1.79 0 4.08-3.05 7.44-7 7.93-.93-1.15-.97-3.29.15-5.44 1.27-2.45 3.75-4.07 6.64-4.28z"/>
              </svg>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-[#111827]">gojiberry</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#FF5A36] transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">Legal</span>
          <h1 className="font-heading text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-[#64748B] mt-3">Last updated: August 1, 2026 · Effective date: August 8, 2026</p>
        </div>

        <div className="bg-[#FFF2ED] border border-[#FFD9CD] rounded-xl p-5 mb-10 text-sm text-[#475569] leading-relaxed">
          <strong className="text-[#111827]">Summary:</strong> These terms govern your use of the Gojiberry AI platform. By using our Service you agree to these terms. We&apos;re committed to transparency — if you have questions, contact us at{' '}
          <a href="mailto:legal@gojiberry.ai" className="text-[#FF5A36] hover:underline font-semibold">legal@gojiberry.ai</a>.
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-lg font-bold text-[#0F172A] mb-3">{section.title}</h2>
              <p className="text-sm text-[#475569] leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#94A3B8]">© 2026 GojiberryAI — Made & Hosted in the EU 🇪🇺</p>
          <div className="flex gap-4 text-xs text-[#475569]">
            <Link href="/privacy" className="hover:text-[#FF5A36] transition-colors">Privacy Policy</Link>
            <a href="mailto:legal@gojiberry.ai" className="hover:text-[#FF5A36] transition-colors">Contact</a>
          </div>
        </div>
      </main>
    </div>
  );
}
