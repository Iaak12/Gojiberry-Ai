import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – Gojiberry AI',
  description: 'Learn how Gojiberry AI collects, uses, and protects your personal data.',
};

const sections = [
  {
    title: '1. Who We Are',
    content: `GojiberryAI ("we", "us", "our") is the data controller for personal data processed through our Service. We are incorporated under French law and hosted in the European Union. Contact us at privacy@gojiberry.ai or GojiberryAI, 1 Rue de Rivoli, 75001 Paris, France.`,
  },
  {
    title: '2. Data We Collect',
    content: `We collect: (a) Account data — name, work email, company website, password hash, billing information; (b) Usage data — pages visited, features used, session duration, IP address, browser type; (c) Prospect data — contact information of third-party prospects that you or the Service identifies for outreach; (d) Integration data — data synced from CRM and third-party tools you connect; (e) Communications — emails and messages you send or receive through the Service.`,
  },
  {
    title: '3. How We Use Your Data',
    content: `We use your data to: provide and improve the Service; process payments; send transactional communications (invoices, password resets); send product updates and marketing communications (with consent or legitimate interest); analyze usage to improve features; comply with legal obligations; and prevent fraud and abuse. We do not sell your personal data to third parties.`,
  },
  {
    title: '4. Legal Basis (GDPR)',
    content: `For EU/EEA users, we rely on the following legal bases: Contract performance — to provide the Service you signed up for; Legitimate interests — to improve the Service, prevent fraud, and conduct marketing to existing customers; Consent — for optional marketing communications and non-essential cookies; Legal obligation — to comply with applicable law.`,
  },
  {
    title: '5. Data Sharing',
    content: `We share data with: Infrastructure providers (Vercel, AWS) under data processing agreements; Payment processors (Stripe) for billing; Analytics providers (anonymized/pseudonymized); CRM tools you explicitly integrate; and law enforcement when legally required. We require all sub-processors to maintain data protection standards consistent with GDPR.`,
  },
  {
    title: '6. Prospect Data',
    content: `When you use the Service to identify and contact prospects, you act as the data controller for that prospect data. We act as your data processor. You are responsible for ensuring a lawful basis exists to contact prospects. We maintain prospect opt-out lists and automatically suppress contacts who have requested removal from outreach.`,
  },
  {
    title: '7. Data Retention',
    content: `We retain your account data for the duration of your subscription plus 90 days after termination. Prospect data is retained for up to 12 months or as configured by you. Usage logs are retained for 90 days. You may request deletion of your data at any time through account settings or by contacting privacy@gojiberry.ai.`,
  },
  {
    title: '8. Your Rights',
    content: `Under GDPR and applicable law, you have the right to: access your personal data; correct inaccurate data; request deletion ("right to be forgotten"); restrict processing; data portability; object to processing; and withdraw consent at any time. To exercise these rights, contact privacy@gojiberry.ai. We will respond within 30 days.`,
  },
  {
    title: '9. International Transfers',
    content: `We are hosted in the EU. Where we transfer data outside the EU/EEA, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission or other appropriate safeguards to protect your data.`,
  },
  {
    title: '10. Cookies',
    content: `We use essential cookies (required for the Service to function), analytics cookies (to understand usage, with your consent), and preference cookies (to remember your settings). You can manage cookie preferences via the Cookie Settings link in our footer. We do not use advertising or cross-site tracking cookies.`,
  },
  {
    title: '11. Security',
    content: `We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, SOC 2 Type II compliance, regular penetration testing, and least-privilege access controls. We maintain an incident response plan and will notify you of any data breach affecting your data within 72 hours as required by GDPR.`,
  },
  {
    title: '12. Children',
    content: `The Service is not directed at individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, please contact us immediately.`,
  },
  {
    title: '13. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent notice in the Service at least 14 days before the effective date. The date at the top of this policy reflects the most recent update.`,
  },
];

export default function PrivacyPage() {
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
          <h1 className="font-heading text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-[#64748B] mt-3">Last updated: August 1, 2026 · Effective date: August 8, 2026</p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mb-10">
          {['🇪🇺 EU Hosted', '🔒 SOC 2 Type II', '✅ GDPR Compliant', '🛡️ AES-256 Encrypted'].map((badge) => (
            <span key={badge} className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] shadow-sm">
              {badge}
            </span>
          ))}
        </div>

        <div className="bg-[#FFF2ED] border border-[#FFD9CD] rounded-xl p-5 mb-10 text-sm text-[#475569] leading-relaxed">
          <strong className="text-[#111827]">Summary:</strong> We are hosted in the EU, GDPR compliant, and never sell your data. You have full rights to access, correct, or delete your information. Contact{' '}
          <a href="mailto:privacy@gojiberry.ai" className="text-[#FF5A36] hover:underline font-semibold">privacy@gojiberry.ai</a>{' '}
          with any questions.
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
            <Link href="/terms" className="hover:text-[#FF5A36] transition-colors">Terms of Service</Link>
            <a href="mailto:privacy@gojiberry.ai" className="hover:text-[#FF5A36] transition-colors">Contact Privacy Team</a>
          </div>
        </div>
      </main>
    </div>
  );
}
