'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Mail, Lock, Globe, User, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ICPAnalysis } from '@/app/api/analyze-website/route';

const STEPS = ['Your website', 'Your account', 'Launch agent'];

const ANALYZING_MSGS = [
  'Reading website content...',
  'Identifying your value proposition...',
  'Building ideal customer profile...',
  'Finding first warm leads...',
];

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialWebsite = searchParams.get('website') || '';

  const [step, setStep] = useState(initialWebsite ? 1 : 0);
  const [website, setWebsite] = useState(initialWebsite);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [icp, setIcp] = useState<ICPAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleWebsiteNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website) { setError('Please enter your website URL.'); return; }
    setError('');
    setAnalyzing(true);
    setAnalyzeStep(0);

    // Animate through analysis steps while calling API
    const stepInterval = setInterval(() => {
      setAnalyzeStep((prev) => Math.min(prev + 1, ANALYZING_MSGS.length - 1));
    }, 700);

    try {
      const res = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: website }),
      });
      const data = await res.json();
      if (data.icp) {
        setIcp(data.icp);
        // Persist for dashboard
        localStorage.setItem('gojiberry_icp', JSON.stringify(data.icp));
        localStorage.setItem('gojiberry_website', website);
        // Clear any old cached leads so dashboard generates fresh ones
        localStorage.removeItem('gojiberry_leads');
      }
    } catch {
      // ignore, just continue without ICP data
    }

    clearInterval(stepInterval);
    setAnalyzeStep(ANALYZING_MSGS.length - 1);
    await new Promise((r) => setTimeout(r, 400));
    setAnalyzing(false);
    setStep(1);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setLoading(true);

    try {
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, website, icp }),
      });

      const regData = await regRes.json();
      if (!regRes.ok || regData.error) {
        setError(regData.error || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // Auto sign-in with credentials
      const { signIn } = await import('next-auth/react');
      await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      // Save session for dashboard
      localStorage.setItem('gojiberry_session', email.trim().toLowerCase());
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'An error occurred during signup.');
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep(2);
    
    // Simulate finding leads in background
    await new Promise((r) => setTimeout(r, 2200));
    router.push('/dashboard');
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
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#FF5A36] hover:underline">Login</Link>
        </p>
      </header>

      {/* Progress Steps */}
      {!analyzing && (
        <div className="flex items-center justify-center gap-0 mt-6 mb-2">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step ? 'bg-[#FF5A36] text-white' :
                  i === step ? 'bg-[#111827] text-white' :
                  'bg-[#E2E8F0] text-[#94A3B8]'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`mt-1.5 text-[11px] font-semibold transition-colors ${i === step ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mb-5 transition-colors duration-300 ${i < step ? 'bg-[#FF5A36]' : 'bg-[#E2E8F0]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#FF5A36]/8 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Analyzing overlay */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative w-full max-w-md text-center"
            >
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 shadow-xl">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-[#FF5A36]/20 border-t-[#FF5A36]"
                  />
                  <div className="absolute inset-2 rounded-full bg-[#FFF2ED] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#FF5A36]" />
                  </div>
                </div>
                <h2 className="font-heading text-xl font-extrabold text-[#0F172A] mb-2">Analyzing your website...</h2>
                <p className="text-sm text-[#64748B] mb-6">AI is reading your site and building your ICP</p>
                <div className="space-y-2.5">
                  {ANALYZING_MSGS.map((msg, i) => (
                    <motion.div
                      key={msg}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: i <= analyzeStep ? 1 : 0.3, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2.5 text-xs text-[#64748B] text-left"
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${i <= analyzeStep ? 'bg-[#FF5A36]' : 'bg-[#E2E8F0]'}`}>
                        {i <= analyzeStep
                          ? <Check className="w-2.5 h-2.5 text-white" />
                          : <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                        }
                      </div>
                      {msg}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!analyzing && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-md"
          >
            <span className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF5A36]" />
            <span className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF5A36]" />
            <span className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#FF5A36]" />
            <span className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#FF5A36]" />

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xl">

              {/* ── STEP 0: Website ── */}
              {step === 0 && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#FFF2ED] border border-[#FFD9CD] flex items-center justify-center">
                      <Globe className="w-7 h-7 text-[#FF5A36]" />
                    </div>
                    <h1 className="font-heading text-2xl font-extrabold text-[#0F172A]">Enter your website</h1>
                    <p className="mt-1.5 text-sm text-[#475569]">Gojiberry will learn your business and build your ICP automatically.</p>
                  </div>
                  <form onSubmit={handleWebsiteNext} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1.5" htmlFor="signup-website">Website URL</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <input
                          id="signup-website"
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="w-full pl-10 pr-4 py-3.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/15 bg-white transition-all"
                        />
                      </div>
                      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#111827] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      Analyze my website <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
                    </button>
                  </form>
                  <div className="mt-6 pt-6 border-t border-[#F1F5F9] space-y-2">
                    {[
                      'AI reads your site and builds ICP in under 60 seconds',
                      'Free trial · No credit card required',
                      'First results in under 5 minutes',
                    ].map((txt) => (
                      <div key={txt} className="flex items-center gap-2.5 text-xs text-[#64748B]">
                        <div className="w-5 h-5 rounded-full bg-[#FFF2ED] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-[#FF5A36]" />
                        </div>
                        {txt}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── STEP 1: Account ── */}
              {step === 1 && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#FFF2ED] border border-[#FFD9CD] flex items-center justify-center">
                      <User className="w-7 h-7 text-[#FF5A36]" />
                    </div>
                    <h1 className="font-heading text-2xl font-extrabold text-[#0F172A]">Create your account</h1>
                    <p className="mt-1.5 text-sm text-[#475569]">
                      Your agent for <span className="font-semibold text-[#FF5A36]">{website || 'your site'}</span> is ready to launch.
                    </p>
                  </div>

                  {/* ICP preview if we got data */}
                  {icp && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-xs font-bold text-[#166534]">ICP Generated by AI</span>
                      </div>
                      <p className="text-xs text-[#166534] leading-relaxed">{icp.valueProposition}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {icp.targetRoles.slice(0, 3).map((role) => (
                          <span key={role} className="px-2 py-0.5 bg-white border border-[#BBF7D0] rounded-full text-[10px] font-semibold text-[#166534]">
                            {role}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Google */}
                  <button
                    type="button"
                    onClick={async () => {
                      const { signIn } = await import('next-auth/react');
                      signIn('google', { redirectTo: '/dashboard' });
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E2E8F0] rounded-xl bg-white hover:bg-[#FAFAFA] transition-colors text-sm font-semibold text-[#0F172A] shadow-sm mb-5 cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                  </button>

                  <div className="relative flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-[#E2E8F0]" />
                    <span className="text-xs text-[#94A3B8] font-medium">or</span>
                    <div className="flex-1 h-px bg-[#E2E8F0]" />
                  </div>

                  <form onSubmit={handleSignup} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1.5" htmlFor="signup-name">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <input id="signup-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith"
                          className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/15 bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1.5" htmlFor="signup-email">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                          className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/15 bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1.5" htmlFor="signup-password">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                        <input id="signup-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                          className="w-full pl-10 pr-11 py-3 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/15 bg-white" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-1"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        <>Launch my agent for free <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                    <p className="text-center text-xs text-[#94A3B8] mt-1">
                      By signing up, you agree to our{' '}
                      <Link href="/terms" className="underline hover:text-[#FF5A36]">Terms</Link> &amp;{' '}
                      <Link href="/privacy" className="underline hover:text-[#FF5A36]">Privacy Policy</Link>.
                    </p>
                  </form>

                  <button onClick={() => setStep(0)} className="mt-4 text-xs text-[#94A3B8] hover:text-[#475569] transition-colors w-full text-center">
                    ← Change website
                  </button>
                </>
              )}

              {/* ── STEP 2: Launching ── */}
              {step === 2 && (
                <div className="text-center py-6">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-4 border-[#FF5A36]/20 border-t-[#FF5A36]"
                    />
                    <div className="absolute inset-2 rounded-full bg-[#FFF2ED] flex items-center justify-center">
                      <span className="font-bold text-[#FF5A36] text-lg">gb</span>
                    </div>
                  </div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#0F172A]">Launching your agent...</h2>
                  <p className="mt-2 text-sm text-[#475569]">
                    Reading <span className="font-semibold text-[#FF5A36]">{website}</span><br />
                    Building your ICP and finding first leads.
                  </p>
                  {icp && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-5 p-4 bg-[#FFF2ED] border border-[#FFD9CD] rounded-xl text-left"
                    >
                      <p className="text-xs font-bold text-[#FF5A36] mb-2">🎯 Your ICP</p>
                      <p className="text-xs text-[#475569] mb-2">{icp.companyDescription}</p>
                      <div className="flex flex-wrap gap-1">
                        {[...icp.targetRoles.slice(0, 2), ...icp.targetIndustries.slice(0, 2)].map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-white border border-[#FFD9CD] rounded-full text-[10px] font-semibold text-[#FF5A36]">{tag}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div className="mt-6 space-y-2 max-w-xs mx-auto">
                    {['Reading website content...', 'Building ideal customer profile...', 'Finding first warm leads...'].map((msg, i) => (
                      <motion.div key={msg} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }}
                        className="flex items-center gap-2.5 text-xs text-[#64748B] text-left">
                        <div className="w-4 h-4 rounded-full bg-[#FFF2ED] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#FF5A36]" />
                        </div>
                        {msg}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#94A3B8]">
              <span>🔒 SOC 2</span><span>•</span>
              <span>🇪🇺 GDPR Compliant</span><span>•</span>
              <span>🏅 Y Combinator P26</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
