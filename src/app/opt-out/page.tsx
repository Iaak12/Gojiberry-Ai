import React from 'react';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OptOutPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5A36] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[#0F172A] mb-8">Opt-out & Privacy Request</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8F0] prose prose-slate max-w-none">
          <p>Submit a request to opt-out of data collection or manage your privacy settings.</p>
          <p>Content coming soon.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
