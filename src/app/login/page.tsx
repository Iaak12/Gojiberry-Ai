'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { signIn } = await import('next-auth/react');
      const res = await signIn('resend', { 
        email, 
        redirect: false,
      });
      
      if (res?.error) {
        setError('An error occurred. Please try again.');
        setLoading(false);
        return;
      }
      
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign in.');
      setLoading(false);
    }
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
        <p className="text-sm text-[#475569]">
          No account?{' '}
          <Link href="/signup" className="font-semibold text-[#FF5A36] hover:underline">
            Start for free
          </Link>
        </p>
      </header>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Background glow */}
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
            <div className="text-center mb-8">
              <h1 className="font-heading text-2xl font-extrabold text-[#0F172A]">Welcome back</h1>
              <p className="mt-1.5 text-sm text-[#475569]">Sign in to your Gojiberry account</p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={async () => {
                const { signIn } = await import('next-auth/react');
                signIn('google', { redirectTo: '/dashboard' });
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white hover:bg-[#FAFAFA] transition-colors text-sm font-semibold text-[#0F172A] shadow-sm mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-xs text-[#94A3B8] font-medium">or login with email</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-sm mb-4"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-semibold mb-1">Check your email</p>
                <p>A magic sign-in link has been sent to <strong>{email}</strong>.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5" htmlFor="login-email">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/15 bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
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
                      Sending link...
                    </span>
                  ) : (
                    <>
                      Send magic link
                      <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-center text-xs text-[#94A3B8] mt-6">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-[#FF5A36]">Terms</Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-[#FF5A36]">Privacy Policy</Link>.
            </p>
          </div>

          {/* Bottom trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#94A3B8]">
            <span>🔒 SOC 2</span>
            <span>•</span>
            <span>🇪🇺 GDPR Compliant</span>
            <span>•</span>
            <span>🏅 Y Combinator P26</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
