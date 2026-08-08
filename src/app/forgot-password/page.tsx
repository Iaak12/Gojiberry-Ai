'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex flex-col">
      {/* Minimal Navbar */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#FF5A36] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 2.89.21 5.37 1.83 6.64 4.28 1.12 2.15 1.08 4.29.15 5.44zm1.14-11.85c-1.63-.78-2.97-2.09-3.76-3.72-.78 1.63-2.12 2.94-3.75 3.72 1.63.78 2.97 2.09 3.75 3.72.79-1.63 2.13-2.94 3.76-3.72zM19.79 10.21c.13.58.21 1.17.21 1.79 0 4.08-3.05 7.44-7 7.93-.93-1.15-.97-3.29.15-5.44 1.27-2.45 3.75-4.07 6.64-4.28z"/>
            </svg>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-[#111827]">gojiberry</span>
        </Link>
        <Link href="/login" className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#FF5A36] transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </header>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#FF5A36]/8 to-transparent blur-3xl pointer-events-none rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative w-full max-w-md"
        >
          {/* Corner brackets */}
          <span className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF5A36]" />
          <span className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF5A36]" />
          <span className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#FF5A36]" />
          <span className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#FF5A36]" />

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xl">
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#FFF2ED] border border-[#FFD9CD] flex items-center justify-center">
                      <Mail className="w-7 h-7 text-[#FF5A36]" />
                    </div>
                    <h1 className="font-heading text-2xl font-extrabold text-[#0F172A]">Reset your password</h1>
                    <p className="mt-1.5 text-sm text-[#475569]">
                      Enter your work email and we&apos;ll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1.5" htmlFor="forgot-email">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <input
                          id="forgot-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/15 bg-white transition-all"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-medium">
                        {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#111827] hover:bg-black disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>Send reset link <ArrowRight className="w-4 h-4 text-[#FF5A36]" /></>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-xs text-[#94A3B8] mt-6">
                    Remembered it?{' '}
                    <Link href="/login" className="font-semibold text-[#FF5A36] hover:underline">Sign in</Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                  </div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#0F172A]">Check your inbox</h2>
                  <p className="mt-2 text-sm text-[#475569]">
                    We&apos;ve sent a password reset link to{' '}
                    <span className="font-semibold text-[#FF5A36]">{email}</span>.
                  </p>
                  <p className="mt-4 text-xs text-[#94A3B8]">Didn&apos;t receive it? Check your spam folder or{' '}
                    <button onClick={() => { setSent(false); setEmail(''); }} className="text-[#FF5A36] font-semibold hover:underline">try again</button>.
                  </p>
                  <Link
                    href="/login"
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] hover:bg-black text-white text-sm font-bold rounded-xl shadow-md transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#94A3B8]">
            <span>🔒 SOC 2</span><span>•</span>
            <span>🇪🇺 GDPR Compliant</span><span>•</span>
            <span>🏅 Y Combinator P26</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
