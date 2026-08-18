'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, Users, Mail, Linkedin, BarChart2, Settings, LogOut,
  Bell, ChevronDown, TrendingUp, Calendar, MessageSquare,
  ArrowUpRight, Filter, Play, Pause, RefreshCw, Clock,
  X, Send, Check, Building2, Target, BookOpen, Inbox,
  Save, Copy, Sparkles, Search, ExternalLink, CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { ToastProvider, useToast } from '@/components/Toast';
import type { Lead } from '@/app/api/generate-leads/route';
import type { ICPAnalysis } from '@/app/api/analyze-website/route';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface UserInfo { name: string; email: string; website: string; isSuperadmin?: boolean; }
interface EmailModal { open: boolean; loading: boolean; subject: string; body: string; prospect: Lead | null; }
interface LinkedInModal { open: boolean; loading: boolean; message: string; prospect: Lead | null; }
interface CalendarEvent {
  id: number; title: string; company: string; date: string; time: string;
  type: string; color: string; status: string; meetingUrl?: string; prospectId?: number;
}
interface AppNotification { id: number; icon: string; msg: string; time: string; unread: boolean; }
interface ActivityItem { icon: string; msg: string; time: string; }
interface OutreachSeq { id: number; name: string; prospects: number; step: string; opens: string; replies: string; color: string; active: boolean; }

// ─── PERSISTENCE UTILS ───────────────────────────────────────────────────────

function getStore<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) as T : defaultVal;
  } catch { return defaultVal; }
}
function setStore(key: string, val: unknown) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  replied:   { label: 'Replied',     color: '#22C55E', bg: '#F0FDF4', icon: <MessageSquare className="w-3 h-3" /> },
  booked:    { label: 'Demo Booked', color: '#3B82F6', bg: '#EFF6FF', icon: <Calendar className="w-3 h-3" /> },
  contacted: { label: 'Contacted',   color: '#F59E0B', bg: '#FFFBEB', icon: <Mail className="w-3 h-3" /> },
  pending:   { label: 'Pending',     color: '#94A3B8', bg: '#F8FAFC', icon: <Clock className="w-3 h-3" /> },
};

const NAV_ITEMS = [
  { id: 'dashboard', icon: <BarChart2 className="w-5 h-5" />, label: 'Dashboard' },
  { id: 'prospects', icon: <Users className="w-5 h-5" />,    label: 'Prospects' },
  { id: 'inbox',     icon: <Inbox className="w-5 h-5" />,    label: 'Inbox' },
  { id: 'outreach',  icon: <Linkedin className="w-5 h-5" />, label: 'Outreach' },
  { id: 'calendar',  icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
  { id: 'playbooks', icon: <BookOpen className="w-5 h-5" />, label: 'Playbooks' },
  { id: 'settings',  icon: <Settings className="w-5 h-5" />, label: 'Settings' },
];

const DEFAULT_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 1, title: 'Discovery Call',  company: 'Top prospect', date: 'Today',    time: '11:30 AM', type: 'Zoom',        color: '#10B981', status: 'confirmed',  meetingUrl: 'https://zoom.us/j/123456789' },
  { id: 2, title: 'Product Demo',    company: 'Warm lead',    date: 'Tomorrow', time: '2:00 PM',  type: 'Google Meet', color: '#3B82F6', status: 'confirmed',  meetingUrl: 'https://meet.google.com/abc-def-ghi' },
  { id: 3, title: 'Follow-up Call',  company: 'ICP match',    date: 'Aug 12',   time: '10:00 AM', type: 'Zoom',        color: '#EC4899', status: 'pending',    meetingUrl: 'https://zoom.us/j/987654321' },
  { id: 4, title: 'Closing Call',    company: 'Hot prospect', date: 'Aug 14',   time: '3:00 PM',  type: 'Call',        color: '#F59E0B', status: 'tentative' },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 1, icon: '🎯', msg: 'AI found 12 new high-intent prospects matching your ICP', time: '8m ago',  unread: true  },
  { id: 2, icon: '📅', msg: 'Demo booked automatically with top-scored prospect',      time: '1h ago',  unread: true  },
  { id: 3, icon: '✉️', msg: 'First prospect replied to your personalized outreach',    time: '2h ago',  unread: true  },
  { id: 4, icon: '💬', msg: 'AI draft reply prepared — awaiting your 1-click approve', time: '3h ago',  unread: false },
  { id: 5, icon: '🔍', msg: 'Weekly scan complete — 480 prospects evaluated',         time: '1d ago',  unread: false },
];

const PLAYBOOKS_DEFAULTS = [
  { id: 1, name: 'ICP Signal Monitor',       tag: 'Active', desc: 'Scans 100k+ daily signals and surfaces prospects matching your exact ICP with buying intent.',    active: true,  prospects: 240, sent: 78,  replies: 12 },
  { id: 2, name: 'Funding Round Trigger',    tag: 'Active', desc: 'Reaches out to startups within 30 days of raising a new funding round — when budgets are fresh.', active: true,  prospects: 140, sent: 44,  replies: 8  },
  { id: 3, name: 'Competitor Switch Signal', tag: 'Paused', desc: 'Detects prospects who left negative reviews of competitors and contacts them within 24 hours.',    active: false, prospects: 0,   sent: 0,   replies: 0  },
  { id: 4, name: 'Hiring Intent Playbook',   tag: 'Paused', desc: 'Targets companies actively hiring for roles your product eliminates or automates.',                active: false, prospects: 0,   sent: 0,   replies: 0  },
];

const OUTREACH_DEFAULTS: OutreachSeq[] = [
  { id: 1, name: 'Cold Email Sequence',    prospects: 142, step: 'Step 2 of 4 · Follow-up',         opens: '61%', replies: '19%', color: '#3B82F6', active: true },
  { id: 2, name: 'LinkedIn Connection',    prospects: 88,  step: 'Step 1 of 3 · Connection request', opens: '—',   replies: '34%', color: '#0A66C2', active: true },
  { id: 3, name: 'Re-engagement Campaign', prospects: 34,  step: 'Step 3 of 5 · Case study share',   opens: '45%', replies: '12%', color: '#10B981', active: true },
];

const ACTIVITY_TEMPLATES = (leads: Lead[]) => [
  { icon: '🔍', msg: `Scanned 100,000+ intent signals for prospects matching your ICP`, time: '2m ago' },
  { icon: '🎯', msg: `Found ${leads.length || 8} new high-intent prospects — all with specific buying signals`, time: '8m ago' },
  { icon: '✉️', msg: leads[0] ? `Sent personalized email to ${leads[0].name} (${leads[0].company}) — referencing buying signal` : 'Personalized email sent to top prospect', time: '15m ago' },
  { icon: '📅', msg: leads.find(l => l.status === 'booked') ? `Demo auto-booked with ${leads.find(l => l.status === 'booked')?.name} (${leads.find(l => l.status === 'booked')?.company})` : 'Demo booked with top-intent prospect', time: '1h ago' },
  { icon: '💬', msg: leads.find(l => l.status === 'replied') ? `${leads.find(l => l.status === 'replied')?.name} replied — AI draft ready for your 1-click approval` : 'AI reply draft prepared for warm prospect', time: '2h ago' },
];

// ─── SKELETON ─────────────────────────────────────────────────────────────────

function LeadSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F8FAFC]">
          <div className="w-9 h-9 rounded-full bg-[#E2E8F0] shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-[#E2E8F0] rounded w-32" />
            <div className="h-2.5 bg-[#F1F5F9] rounded w-48" />
          </div>
          <div className="h-2 bg-[#E2E8F0] rounded w-20" />
          <div className="h-5 bg-[#F1F5F9] rounded-full w-16" />
          <div className="h-2.5 bg-[#F1F5F9] rounded w-12" />
          <div className="h-4 bg-[#FFE5DC] rounded w-10" />
        </div>
      ))}
    </div>
  );
}

// ─── EMAIL MODAL ─────────────────────────────────────────────────────────────

function EmailModal({ modal, onClose }: { modal: EmailModal; onClose: () => void }) {
  const { showToast } = useToast();
  const [editedBody, setEditedBody] = useState('');
  const [editedSubject, setEditedSubject] = useState('');

  useEffect(() => {
    setEditedBody(modal.body);
    setEditedSubject(modal.subject);
  }, [modal.body, modal.subject]);

  const handleCopy = () => {
    const full = `Subject: ${editedSubject}\n\n${editedBody}`;
    navigator.clipboard.writeText(full);
    showToast('Email copied to clipboard!', 'success');
  };

  if (!modal.open) return null;

  return (
    <AnimatePresence>
      {modal.open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl pointer-events-auto overflow-hidden border border-[#E2E8F0]">
              <div className="px-6 py-4 bg-gradient-to-r from-[#FFF2ED] to-white border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                  <span className="font-bold text-sm text-[#0F172A]">
                    AI-Generated Email for <span className="text-[#FF5A36]">{modal.prospect?.name}</span>
                  </span>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#475569] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {modal.loading ? (
                <div className="px-6 py-16 flex flex-col items-center gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-[#FF5A36]/20 border-t-[#FF5A36] rounded-full" />
                  <div className="text-sm text-[#64748B]">Writing personalized email using the buying signal...</div>
                </div>
              ) : (
                <div className="px-6 py-5">
                  {modal.prospect?.signal && (
                    <div className="mb-4 p-3 bg-[#FFF2ED] border border-[#FFD9CD] rounded-xl text-xs text-[#64748B]">
                      <span className="font-bold text-[#FF5A36]">Signal used: </span>{modal.prospect.signal}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">Subject</label>
                    <input
                      value={editedSubject}
                      onChange={e => setEditedSubject(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF5A36]"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">Body</label>
                    <textarea
                      value={editedBody}
                      onChange={e => setEditedBody(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#334155] leading-relaxed focus:outline-none focus:border-[#FF5A36] resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#475569] hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors">
                      <Copy className="w-4 h-4" /> Copy Email
                    </button>
                    <button
                      onClick={() => { showToast(`Email queued for ${modal.prospect?.name}!`, 'success'); onClose(); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-xl text-sm font-bold transition-colors">
                      <Send className="w-4 h-4" /> Send via Gojiberry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── LINKEDIN MODAL ──────────────────────────────────────────────────────────

function LinkedInModal({ modal, onClose }: { modal: LinkedInModal; onClose: () => void }) {
  const { showToast } = useToast();
  const [editedMsg, setEditedMsg] = useState('');
  const charCount = editedMsg.length;

  useEffect(() => { setEditedMsg(modal.message); }, [modal.message]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedMsg);
    showToast('LinkedIn message copied!', 'success');
  };

  if (!modal.open) return null;

  return (
    <AnimatePresence>
      {modal.open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden border border-[#E2E8F0]">
              <div className="px-6 py-4 bg-gradient-to-r from-[#EFF6FF] to-white border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span className="font-bold text-sm text-[#0F172A]">
                    LinkedIn Message for <span className="text-[#0A66C2]">{modal.prospect?.name}</span>
                  </span>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#475569] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {modal.loading ? (
                <div className="px-6 py-16 flex flex-col items-center gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-[#0A66C2]/20 border-t-[#0A66C2] rounded-full" />
                  <div className="text-sm text-[#64748B]">Crafting personalized LinkedIn note...</div>
                </div>
              ) : (
                <div className="px-6 py-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Connection Note</label>
                    <span className={`text-[11px] font-semibold ${charCount > 300 ? 'text-red-500' : charCount > 250 ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}`}>
                      {charCount}/300
                    </span>
                  </div>
                  <textarea
                    value={editedMsg}
                    onChange={e => setEditedMsg(e.target.value)}
                    rows={4}
                    maxLength={300}
                    className="w-full px-3 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#334155] leading-relaxed focus:outline-none focus:border-[#0A66C2] resize-none mb-4"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#475569] hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <a
                      href={`https://linkedin.com/in/${modal.prospect?.linkedin?.replace('linkedin.com/in/', '') ?? ''}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl text-sm font-bold transition-colors"
                      onClick={() => { showToast(`LinkedIn opened for ${modal.prospect?.name}!`, 'success'); onClose(); }}>
                      <ExternalLink className="w-4 h-4" /> Open LinkedIn
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── PROSPECTS VIEW ───────────────────────────────────────────────────────────

function ProspectsView({
  leads, leadsLoading, onDraftEmail, onRefresh, onLinkedIn, onBookDemo,
}: {
  leads: Lead[];
  leadsLoading: boolean;
  onDraftEmail: (p: Lead) => void;
  onRefresh: () => void;
  onLinkedIn: (p: Lead) => void;
  onBookDemo: (p: Lead) => void;
}) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Lead | null>(null);

  const filtered = useMemo(() =>
    leads.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.signal.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchStatus;
    }), [leads, search, filterStatus]);

  return (
    <div>
      {/* Slide-over */}
      <AnimatePresence>
        {selectedProspect && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedProspect(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 40 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg text-[#0F172A]">Prospect Detail</h2>
                  <button onClick={() => setSelectedProspect(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0"
                    style={{ backgroundColor: selectedProspect.color }}>
                    {selectedProspect.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A]">{selectedProspect.name}</h3>
                    <p className="text-sm text-[#64748B]">{selectedProspect.role} · {selectedProspect.company}</p>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ color: STATUS_STYLE[selectedProspect.status || 'pending']?.color, backgroundColor: STATUS_STYLE[selectedProspect.status || 'pending']?.bg }}>
                      {STATUS_STYLE[selectedProspect.status || 'pending']?.icon} {STATUS_STYLE[selectedProspect.status || 'pending']?.label}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FFF2ED] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0F172A]">Intent Score</span>
                    <span className="text-lg font-extrabold text-[#FF5A36]">{selectedProspect.score}%</span>
                  </div>
                  <div className="h-2 bg-[#FFD9CD] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${selectedProspect.score}%` }}
                      transition={{ delay: 0.2, duration: 0.6 }} className="h-full bg-[#FF5A36] rounded-full" />
                  </div>
                  <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
                    <span className="font-semibold text-[#0F172A]">🎯 Signal:</span> {selectedProspect.signal}
                  </p>
                </div>

                <div className="space-y-2.5 mb-6">
                  {[
                    { icon: <Mail className="w-4 h-4 text-[#94A3B8]" />, value: selectedProspect.email, href: `mailto:${selectedProspect.email}` },
                    { icon: <Linkedin className="w-4 h-4 text-[#94A3B8]" />, value: selectedProspect.linkedin, href: `https://${selectedProspect.linkedin}` },
                    { icon: <Building2 className="w-4 h-4 text-[#94A3B8]" />, value: `${selectedProspect.company} · ${selectedProspect.industry}` },
                  ].map(({ icon, value, href }) => (
                    <div key={value} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                      {icon}
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-[#334155] truncate hover:text-[#FF5A36] transition-colors">{value}</a>
                      ) : (
                        <span className="text-sm text-[#334155] truncate">{value}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => { onDraftEmail(selectedProspect); setSelectedProspect(null); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-sm font-bold rounded-xl transition-colors">
                    <Sparkles className="w-4 h-4" /> Draft Personalized Email
                  </button>
                  <button
                    onClick={() => { onLinkedIn(selectedProspect); setSelectedProspect(null); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-bold rounded-xl transition-colors">
                    <Linkedin className="w-4 h-4" /> Generate LinkedIn Message
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/integrations/hubspot', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ leadData: selectedProspect })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert('Synced to HubSpot!');
                        } else {
                          alert(data.error || 'Failed to sync');
                        }
                      } catch (e) { alert('Failed to sync to HubSpot'); }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#FF5A36] text-sm font-bold rounded-xl transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Push to HubSpot
                  </button>
                  <button
                    onClick={() => { onBookDemo(selectedProspect); setSelectedProspect(null); }}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569] text-sm font-semibold rounded-xl transition-colors">
                    <Calendar className="w-4 h-4" /> Book a Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input type="text" placeholder="Search by name, company, signal..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36]" />
          </div>
          
          <select className="px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-white text-[#475569] focus:outline-none focus:border-[#FF5A36]">
            <option>All Lists</option>
            <option>Default List</option>
            <option>Founders Campaign 2026</option>
          </select>

          <button 
            onClick={() => window.open('/api/leads/export', '_blank')}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Export CSV
          </button>

          <div className="relative">
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors">
              <Filter className="w-3.5 h-3.5" /> {filterStatus === 'all' ? 'Filter' : STATUS_STYLE[filterStatus].label}
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-2 z-10 min-w-[150px]">
                  {['all', 'replied', 'booked', 'contacted', 'pending'].map((s) => (
                    <button key={s} onClick={() => { setFilterStatus(s); setFilterOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterStatus === s ? 'bg-[#FFF2ED] text-[#FF5A36]' : 'text-[#475569] hover:bg-[#F8FAFC]'}`}>
                      {s === 'all' ? 'All Statuses' : STATUS_STYLE[s].label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 border-l border-[#E2E8F0] pl-3 ml-1">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Send to CRM
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] transition-colors">
              <Save className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <button onClick={onRefresh} disabled={leadsLoading}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-white bg-[#FF5A36] hover:bg-[#E04826] transition-colors disabled:opacity-50 ml-auto">
            <RefreshCw className={`w-3.5 h-3.5 ${leadsLoading ? 'animate-spin' : ''}`} />
            {leadsLoading ? 'Scanning...' : 'Refresh Leads'}
          </button>
        </div>

        <div className="overflow-x-auto">
          {leadsLoading ? (
            <LeadSkeleton />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#F1F5F9]">
                  {['Prospect', 'Intent Score', 'Buying Signal', 'Status', 'Detected', 'Action'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#94A3B8]">No prospects match your search.</td></tr>
                ) : (
                  filtered.map((p, i) => {
                    const s = STATUS_STYLE[p?.status] || STATUS_STYLE.pending;
                    return (
                      <motion.tr key={p.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0" style={{ backgroundColor: p.color }}>{p.initials}</div>
                            <div>
                              <div className="text-xs font-bold text-[#0F172A]">{p.name}</div>
                              <div className="text-[11px] text-[#64748B]">{p.role} · {p.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${p.score}%` }} />
                            </div>
                            <span className="text-xs font-bold text-[#0F172A]">{p.score}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 max-w-[220px]">
                          <span className="text-xs text-[#475569] line-clamp-2 leading-relaxed">{p.signal}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ color: s.color, backgroundColor: s.bg }}>
                            {s.icon} {s.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5"><span className="text-[11px] text-[#94A3B8]">{p.time}</span></td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => setSelectedProspect(p)}
                            className="text-xs font-semibold text-[#FF5A36] hover:underline flex items-center gap-1">
                            View <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            {leadsLoading ? 'Scanning for leads...' : `Showing ${filtered.length} of ${leads.length} AI-sourced prospects`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── INBOX VIEW ───────────────────────────────────────────────────────────────

function InboxView({
  leads, icp, userInfo, threads, onSendReply, onBookDemo, geminiKey,
}: {
  leads: Lead[];
  icp: ICPAnalysis | null;
  userInfo: UserInfo | null;
  threads: Record<string | number, string[]>;
  onSendReply: (leadId: number, message: string) => void;
  onBookDemo: (lead: Lead) => void;
  geminiKey: string;
}) {
  const { showToast } = useToast();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const inboxLeads = leads.filter((l) => ['replied', 'booked', 'contacted'].includes(l.status));

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeIdx, threads]);

  const handleGenerateReply = async () => {
    if (activeIdx === null) return;
    const prospect = inboxLeads[activeIdx];
    setReplyLoading(true);
    try {
      const res = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread: threads[prospect.id] ?? [],
          prospect,
          fromName: userInfo?.name ?? 'The Team',
          clientApiKey: geminiKey,
        }),
      });
      const data = await res.json();
      setReplyDraft(data.reply ?? '');
      showToast('AI reply draft generated!', 'success');
    } catch {
      showToast('Could not generate reply', 'error');
    }
    setReplyLoading(false);
  };

  const handleSend = () => {
    if (!replyDraft.trim() || activeIdx === null) return;
    const prospect = inboxLeads[activeIdx];
    onSendReply(prospect.id, replyDraft.trim());
    setReplyDraft('');
    showToast('Reply sent!', 'success');
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden" style={{ minHeight: 520 }}>
      <div className="flex h-full" style={{ minHeight: 520 }}>
        {/* Message list */}
        <div className="w-72 border-r border-[#F1F5F9] shrink-0 flex flex-col">
          <div className="px-4 py-3 border-b border-[#F1F5F9]">
            <h3 className="font-bold text-sm text-[#0F172A]">Inbox</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{inboxLeads.filter(l => l.status === 'replied').length} replies waiting</p>
          </div>
          {inboxLeads.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div>
                <Inbox className="w-8 h-8 text-[#E2E8F0] mx-auto mb-2" />
                <p className="text-xs text-[#94A3B8]">No conversations yet</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#F8FAFC] flex-1 overflow-auto">
              {inboxLeads.map((lead, idx) => {
                const thread = threads[lead.id] ?? [];
                const lastMsg = thread[thread.length - 1];
                return (
                  <button key={lead.id} onClick={() => { setActiveIdx(idx); setReplyDraft(''); }}
                    className={`w-full text-left px-4 py-4 hover:bg-[#FAFAFA] transition-colors ${activeIdx === idx ? 'bg-[#FFF2ED]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0" style={{ backgroundColor: lead.color }}>
                        {lead.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F172A] truncate">{lead.name}</span>
                          <span className="text-[10px] text-[#94A3B8] shrink-0 ml-1">{lead.time}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                          {lastMsg ? lastMsg.slice(0, 50) + (lastMsg.length > 50 ? '...' : '') :
                           lead.status === 'replied' ? 'Replied to your outreach' :
                           lead.status === 'booked' ? 'Demo confirmed ✓' : 'Awaiting reply'}
                        </p>
                      </div>
                      {lead.status === 'replied' && <div className="w-2 h-2 rounded-full bg-[#FF5A36] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeIdx !== null && inboxLeads[activeIdx] ? (() => {
            const lead = inboxLeads[activeIdx];
            const thread = threads[lead.id] ?? [];
            // Build default thread if empty
            const displayThread = thread.length > 0 ? thread : (() => {
              const firstName = lead.name.split(' ')[0];
              if (lead.status === 'replied') {
                return [
                  `Hi ${firstName}, I noticed ${lead.signal.toLowerCase()} — that's a strong signal you're thinking about scaling outbound.\n\nGojiberry finds warm leads from 15+ intent signals and contacts them with personalized outreach automatically. Most customers book their first demo within a week.\n\nWorth 15 minutes to see how it fits?`,
                  `Thanks for reaching out! Timing is actually great — we've been evaluating a few tools in this space. Would love to see a demo. Are you free Thursday or Friday?`,
                ];
              } else if (lead.status === 'booked') {
                return [
                  `Hi ${firstName}, saw that ${lead.signal.toLowerCase()} — that's exactly the moment we built Gojiberry for.\n\nWe automate your entire outbound motion end-to-end. Happy to show you a live demo this week.`,
                  `Demo confirmed! Looking forward to seeing this in action. I've blocked 30 minutes on my calendar.`,
                ];
              } else {
                return [
                  `Hi ${firstName}, noticed ${lead.signal.toLowerCase()}.\n\nGojiberry handles your entire outbound automatically — from finding warm leads to booking demos. Curious if this would be useful for ${lead.company}?`,
                ];
              }
            })();

            return (
              <>
                <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A]">{lead.name}</h3>
                    <p className="text-xs text-[#64748B]">{lead.role} · {lead.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`https://${lead.linkedin}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => onBookDemo(lead)}
                      className="px-3 py-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-semibold hover:bg-[#E04826] transition-colors flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Book Demo
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-auto" style={{ maxHeight: 360 }}>
                  {displayThread.map((msg: any, i: any) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      {i % 2 !== 0 && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0 mr-2" style={{ backgroundColor: lead.color }}>
                          {lead.initials}
                        </div>
                      )}
                      <div className={`max-w-sm px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        i % 2 === 0
                          ? 'bg-[#FF5A36] text-white rounded-tr-sm'
                          : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] rounded-tl-sm'
                      }`}>
                        {msg}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="px-6 py-4 border-t border-[#F1F5F9]">
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Write a reply..."
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSend(); }}
                      rows={2}
                      className="flex-1 px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] bg-white resize-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!replyDraft.trim()}
                      className="self-end px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] disabled:opacity-40 text-white rounded-xl transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={handleGenerateReply}
                      disabled={replyLoading}
                      className="flex items-center gap-1.5 text-xs text-[#FF5A36] font-semibold hover:underline disabled:opacity-50">
                      {replyLoading
                        ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-3 h-3 border-2 border-[#FF5A36]/20 border-t-[#FF5A36] rounded-full" /> Generating...</>
                        : <><Sparkles className="w-3 h-3" /> Generate AI reply draft</>
                      }
                    </button>
                    <span className="text-[10px] text-[#94A3B8]">⌘↵ to send</span>
                  </div>
                </div>
              </>
            );
          })() : (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div>
                <Inbox className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3" />
                <p className="text-sm text-[#94A3B8]">Select a conversation to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR VIEW ────────────────────────────────────────────────────────────

function CalendarView({ events, onSync }: { events: CalendarEvent[]; onSync: () => void }) {
  const { showToast } = useToast();

  const handleJoin = (event: CalendarEvent) => {
    if (event.meetingUrl) {
      window.open(event.meetingUrl, '_blank');
      showToast(`Joining ${event.title}...`, 'success');
    } else {
      showToast('No meeting link available', 'info');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#0F172A]">Upcoming Demos & Calls</h3>
        <button onClick={onSync}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Sync
        </button>
      </div>
      {events.length === 0 ? (
        <div className="py-12 text-center">
          <Calendar className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3" />
          <p className="text-sm text-[#94A3B8]">No upcoming events. Book demos from Prospects or Inbox.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 p-4 border border-[#E2E8F0] rounded-xl hover:border-[#FF5A36]/30 transition-colors group">
              <div className="w-1 h-12 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
              <div className="flex-1">
                <div className="font-bold text-sm text-[#0F172A]">{event.title}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{event.company} · {event.type}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-[#0F172A]">{event.date}</div>
                <div className="text-xs text-[#64748B]">{event.time}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                event.status === 'confirmed' ? 'bg-[#F0FDF4] text-[#22C55E]' :
                event.status === 'pending'   ? 'bg-[#FFF2ED] text-[#FF5A36]' :
                                               'bg-[#F8FAFC] text-[#94A3B8]'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <button
                onClick={() => handleJoin(event)}
                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-lg flex items-center gap-1">
                {event.meetingUrl ? <ExternalLink className="w-3 h-3" /> : null} Join
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PLAYBOOKS VIEW ───────────────────────────────────────────────────────────

function PlaybooksView() {
  const { showToast } = useToast();
  const [playbooks, setPlaybooks] = useState(() => getStore('gojiberry_playbooks', PLAYBOOKS_DEFAULTS));

  const toggle = (id: number) => {
    setPlaybooks(prev => {
      const pb = prev.find(p => p.id === id)!;
      const updated = prev.map(p => p.id === id ? {
        ...p,
        active: !p.active,
        tag: !p.active ? 'Active' : 'Paused',
        prospects: !p.active ? Math.floor(Math.random() * 50) + 20 : 0,
        sent: !p.active ? Math.floor(Math.random() * 20) + 5 : 0,
        replies: !p.active ? Math.floor(Math.random() * 8) + 1 : 0,
      } : p);
      setStore('gojiberry_playbooks', updated);
      showToast(`${pb.name} ${pb.active ? 'paused' : 'activated'}`, pb.active ? 'info' : 'success');
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {playbooks.map((pb) => (
        <motion.div key={pb.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pb.id * 0.07 }}
          className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 hover:border-[#FF5A36]/20 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-[#0F172A]">{pb.name}</h3>
                <span className="px-2 py-0.5 bg-[#FFF2ED] border border-[#FFD9CD] rounded-full text-[10px] font-bold text-[#FF5A36]">{pb.tag}</span>
                {pb.active && <span className="flex items-center gap-1 text-[11px] font-semibold text-[#22C55E]"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> Running</span>}
              </div>
              <p className="text-sm text-[#475569]">{pb.desc}</p>
              {pb.active && (
                <div className="flex gap-6 mt-4">
                  <div><div className="text-lg font-extrabold text-[#0F172A]">{pb.prospects}</div><div className="text-xs text-[#64748B]">Prospects</div></div>
                  <div><div className="text-lg font-extrabold text-[#0F172A]">{pb.sent}</div><div className="text-xs text-[#64748B]">Sent</div></div>
                  <div><div className="text-lg font-extrabold text-[#0F172A]">{pb.replies}</div><div className="text-xs text-[#64748B]">Replies</div></div>
                </div>
              )}
            </div>
            <button onClick={() => toggle(pb.id)}
              className={`ml-4 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${pb.active ? 'bg-[#FFF2ED] text-[#FF5A36] hover:bg-[#FFE5DC]' : 'bg-[#111827] text-white hover:bg-black'}`}>
              {pb.active ? 'Pause' : 'Activate'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── OUTREACH VIEW ────────────────────────────────────────────────────────────

function OutreachView({ leads }: { leads: Lead[] }) {
  const { showToast } = useToast();
  const [sequences, setSequences] = useState<OutreachSeq[]>(() => getStore('gojiberry_sequences', OUTREACH_DEFAULTS));

  const toggleSeq = (id: number) => {
    setSequences(prev => {
      const seq = prev.find(s => s.id === id)!;
      const updated = prev.map(s => s.id === id ? { ...s, active: !s.active } : s);
      setStore('gojiberry_sequences', updated);
      showToast(`${seq.name} ${seq.active ? 'paused' : 'resumed'}`, seq.active ? 'info' : 'success');
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#0F172A]">Active Outreach Sequences</h3>
        <span className="text-xs text-[#64748B]">{leads.length} prospects in pipeline</span>
      </div>
      <div className="space-y-4">
        {sequences.map((seq, i) => (
          <motion.div key={seq.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`border rounded-xl p-5 transition-colors ${seq.active ? 'border-[#E2E8F0] hover:border-[#FF5A36]/30' : 'border-[#F1F5F9] bg-[#FAFAFA] opacity-75'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${seq.active ? 'animate-pulse' : ''}`} style={{ backgroundColor: seq.active ? seq.color : '#CBD5E1' }} />
                <span className="font-bold text-sm text-[#0F172A]">{seq.name}</span>
                {seq.active && <span className="text-[11px] font-semibold text-[#22C55E]">● Running</span>}
                {!seq.active && <span className="text-[11px] font-semibold text-[#94A3B8]">● Paused</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleSeq(seq.id)}
                  className={`p-1.5 border rounded-lg transition-colors ${seq.active ? 'border-[#E2E8F0] text-[#475569] hover:text-[#FF5A36] hover:border-[#FF5A36]' : 'border-[#E2E8F0] text-[#475569] hover:text-[#22C55E] hover:border-[#22C55E]'}`}>
                  {seq.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => showToast(`${seq.name} settings opened`, 'info')}
                  className="p-1.5 border border-[#E2E8F0] rounded-lg text-[#475569] hover:text-[#FF5A36] hover:border-[#FF5A36] transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-[#64748B] mb-3">{seq.step}</p>
            <div className="flex gap-6 text-xs">
              <div><span className="font-bold text-[#0F172A]">{seq.prospects}</span> <span className="text-[#64748B]">prospects</span></div>
              <div><span className="font-bold text-[#0F172A]">{seq.opens}</span> <span className="text-[#64748B]">open rate</span></div>
              <div><span className="font-bold text-[#0F172A]">{seq.replies}</span> <span className="text-[#64748B]">reply rate</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────

function SettingsView({
  icp, userInfo, onSaveAndRefresh, geminiKey, onGeminiKeyChange,
}: {
  icp: ICPAnalysis | null;
  userInfo: UserInfo | null;
  onSaveAndRefresh: (newIcp: ICPAnalysis, fromName: string, fromEmail: string) => void;
  geminiKey: string;
  onGeminiKeyChange: (key: string) => void;
}) {
  const { showToast } = useToast();
  const [keyInput, setKeyInput] = useState(geminiKey);
  const [showKey, setShowKey] = useState(false);
  const [fields, setFields] = useState({
    industries: icp?.targetIndustries?.join(', ') ?? '',
    roles: icp?.targetRoles?.join(', ') ?? '',
    companySize: icp?.companySize ?? '',
    geography: icp?.geography ?? '',
    valueProposition: icp?.valueProposition ?? '',
    excludeDomains: getStore('gojiberry_exclude_domains', ''),
    fromName: userInfo?.name ?? '',
    fromEmail: userInfo?.email ?? '',
    dailyLimit: getStore('gojiberry_daily_limit', '50'),
    warmup: getStore('gojiberry_warmup', true) as boolean,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const newIcp: ICPAnalysis = {
      companyDescription: icp?.companyDescription ?? '',
      targetRoles: fields.roles.split(',').map(s => s.trim()).filter(Boolean),
      targetIndustries: fields.industries.split(',').map(s => s.trim()).filter(Boolean),
      valueProposition: fields.valueProposition,
      companySize: fields.companySize,
      geography: fields.geography,
    };
    
    const email = localStorage.getItem('gojiberry_session') || userInfo?.email;
    if (email) {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          icp: newIcp,
          excludeDomains: fields.excludeDomains,
          dailyLimit: fields.dailyLimit,
          warmup: fields.warmup,
          name: fields.fromName,
          geminiKey: keyInput.trim() || undefined,
        }),
      });
    }

    if (keyInput.trim()) {
      onGeminiKeyChange(keyInput.trim());
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaveAndRefresh(newIcp, fields.fromName, fields.fromEmail);
  };

  const inputClass = "w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] bg-white";

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF8A66] rounded-xl shadow-sm p-6 text-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg mb-1">Upgrade to Gojiberry Pro</h3>
          <p className="text-sm opacity-90">Unlock unlimited leads, CRM integrations, and advanced AI scoring.</p>
        </div>
        <button 
          onClick={async () => {
            try {
              const res = await fetch('/api/stripe/checkout', { method: 'POST', body: JSON.stringify({}) });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
              else alert(data.error || 'Failed to initiate checkout');
            } catch (e) { alert('Checkout failed'); }
          }}
          className="px-6 py-2.5 bg-white text-[#FF5A36] font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          Upgrade Now
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#FFF2ED] flex items-center justify-center"><Target className="w-5 h-5 text-[#FF5A36]" /></div>
          <div><h3 className="font-bold text-[#0F172A]">Ideal Customer Profile (ICP)</h3><p className="text-xs text-[#64748B]">AI uses this to find and score leads</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Target Industries', key: 'industries', placeholder: 'SaaS, FinTech, MarTech...' },
            { label: 'Target Job Titles', key: 'roles', placeholder: 'VP Sales, Founder, CEO...' },
            { label: 'Company Size (employees)', key: 'companySize', placeholder: 'e.g. 10-500' },
            { label: 'Geography', key: 'geography', placeholder: 'North America, Europe...' },
          ].map(({ label, key, placeholder }) => {
            const k = key as 'industries' | 'roles' | 'companySize' | 'geography';
            return (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">{label}</label>
                <input type="text" value={fields[k]} onChange={e => setFields(p => ({ ...p, [k]: e.target.value }))} placeholder={placeholder} className={inputClass} />
              </div>
            );
          })}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Value Proposition (used in email drafts)</label>
            <textarea value={fields.valueProposition} onChange={e => setFields(p => ({ ...p, valueProposition: e.target.value }))}
              rows={2} placeholder="What problem do you solve for your ICP?"
              className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] bg-white resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Exclude Domains</label>
            <input type="text" value={fields.excludeDomains} onChange={e => setFields(p => ({ ...p, excludeDomains: e.target.value }))}
              placeholder="competitor.com, partner.com..." className={inputClass} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#FFF2ED] flex items-center justify-center"><Mail className="w-5 h-5 text-[#FF5A36]" /></div>
          <div><h3 className="font-bold text-[#0F172A]">Sender Configuration</h3><p className="text-xs text-[#64748B]">Used for email signing and deliverability</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'From Name', key: 'fromName', placeholder: 'Your Name' },
            { label: 'From Email', key: 'fromEmail', placeholder: 'you@company.com' },
            { label: 'Daily Send Limit', key: 'dailyLimit', placeholder: '50' },
          ].map(({ label, key, placeholder }) => {
            const k = key as 'fromName' | 'fromEmail' | 'dailyLimit';
            return (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">{label}</label>
                <input type="text" value={fields[k]} onChange={e => setFields(p => ({ ...p, [k]: e.target.value }))} placeholder={placeholder} className={inputClass} />
              </div>
            );
          })}
          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <div><div className="text-xs font-semibold text-[#0F172A]">Email Warmup</div><div className="text-[11px] text-[#64748B]">Gradually increase sending volume</div></div>
            <button onClick={() => setFields(p => ({ ...p, warmup: !p.warmup }))}
              className={`w-11 h-6 rounded-full transition-colors ${fields.warmup ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'} relative`}>
              <motion.div animate={{ x: fields.warmup ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#FF5A36]/20 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF5A36] to-[#FF8A65] flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
          <div>
            <h3 className="font-bold text-[#0F172A]">Gemini API Key</h3>
            <p className="text-xs text-[#64748B]">Required for real AI-generated leads, emails & messages</p>
          </div>
          {keyInput && keyInput.length > 10 && (
            <span className="ml-auto px-2.5 py-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full text-[11px] font-bold text-[#22C55E] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2.5 pr-20 border border-[#E2E8F0] rounded-lg text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF5A36] bg-white"
          />
          <button
            type="button"
            onClick={() => setShowKey(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#94A3B8] hover:text-[#FF5A36] transition-colors">
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="mt-3 flex items-start gap-2 p-3 bg-[#FFF9F0] border border-[#FFE4D1] rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A36] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Get a free key at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
              className="text-[#FF5A36] font-semibold hover:underline">aistudio.google.com</a>
            {' '}→ Create API Key. Paste it above and hit Save — all AI features activate instantly.
          </p>
        </div>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-xl shadow-md transition-all ${saved ? 'bg-[#22C55E] text-white' : 'bg-[#FF5A36] hover:bg-[#E04826] text-white'}`}>
        {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved! Refreshing leads...</> : <><Save className="w-4 h-4" /> Save & Refresh Leads</>}
      </button>
    </div>
  );
}

// ─── DASHBOARD MAIN VIEW ──────────────────────────────────────────────────────

function DashboardMainView({
  leads, leadsLoading, agentRunning, activityFeed, onDraftEmail, onNavigate,
}: {
  leads: Lead[];
  leadsLoading: boolean;
  agentRunning: boolean;
  activityFeed: ActivityItem[];
  onDraftEmail: (p: Lead) => void;
  onNavigate: (nav: string) => void;
}) {
  const topLeads = leads.slice(0, 5);

  const repliedCount = leads.filter(l => l.status === 'replied' || l.status === 'booked').length;
  const bookedCount = leads.filter(l => l.status === 'booked').length;

  const stats = [
    { label: 'Prospects Found',  value: leads.length ? `${leads.length * 60}+` : '—', change: '+24%',         icon: <Users className="w-5 h-5" />,         color: '#3B82F6' },
    { label: 'Emails Sent',      value: leads.length ? String(leads.length * 17)  : '—', change: '+18%',      icon: <Mail className="w-5 h-5" />,           color: '#10B981' },
    { label: 'Replies Received', value: repliedCount  ? String(repliedCount * 4)  : '—', change: '+35%',      icon: <MessageSquare className="w-5 h-5" />,  color: '#8B5CF6' },
    { label: 'Demos Booked',     value: bookedCount   ? String(bookedCount * 3)   : '—', change: '+3 this week', icon: <Calendar className="w-5 h-5" />,   color: '#FF5A36' },
  ];

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
              <span className="text-xs font-semibold text-[#22C55E] flex items-center gap-1"><TrendingUp className="w-3 h-3" />{stat.change}</span>
            </div>
            {leadsLoading ? (
              <div className="h-7 bg-[#F1F5F9] rounded animate-pulse w-16 mb-1" />
            ) : (
              <div className="font-heading text-2xl font-extrabold text-[#0F172A]">{stat.value}</div>
            )}
            <div className="text-xs text-[#64748B] mt-0.5 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Agent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0F172A] text-sm">Live Agent Activity</h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22C55E]">
              <span className={`w-2 h-2 rounded-full ${agentRunning ? 'bg-[#22C55E] animate-pulse' : 'bg-[#94A3B8]'}`} />{agentRunning ? 'Live' : 'Paused'}
            </div>
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {activityFeed.slice(0, 5).map((item, i) => (
                <motion.div key={`${item.msg.slice(0, 20)}-${i}`}
                  initial={{ opacity: 0, x: -10, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  transition={{ delay: i === 0 ? 0 : 0.05 * i }}
                  className="flex items-start gap-3 text-xs">
                  <span className="text-base leading-none mt-0.5 shrink-0">{item.icon}</span>
                  <p className="flex-1 text-[#334155] leading-relaxed">{item.msg}</p>
                  <span className="text-[#94A3B8] whitespace-nowrap shrink-0">{item.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="font-bold text-[#0F172A] text-sm mb-5">Quick Actions</h2>
          <div className="space-y-2.5">
            {[
              { label: 'Create AI Agent',         count: null,                                               href: '/dashboard/agents',  color: 'bg-[#FFF2ED] text-[#FF5A36] border-[#FFD9CD]' },
              { label: 'Build Outreach Campaign', count: null,                                               href: '/dashboard/campaigns', color: 'bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]' },
              { label: 'AI prospects found',      count: leads.length,                                       nav: 'prospects', color: 'bg-[#F0FDF4] text-[#22C55E] border-[#BBF7D0]' },
              { label: 'Company Settings',        count: null,                                               href: '/dashboard/settings',  color: 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]' },
            ].map((action) => {
              const ActionWrapper = action.href ? Link : 'button';
              const props = action.href ? { href: action.href } : { onClick: () => onNavigate(action.nav as string) };
              return (
              <ActionWrapper key={action.label}
                {...(props as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-xs font-semibold transition-all hover:opacity-80 active:scale-[0.99] ${action.color}`}>
                <span>{action.label}</span>
                {action.count !== null && <span className="px-2 py-0.5 bg-white/70 rounded-full font-bold">{leadsLoading ? '...' : action.count}</span>}
              </ActionWrapper>
              );
            })}
          </div>
          {leads.find(l => l.status === 'booked') && (
            <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
              <p className="text-xs font-bold text-[#0F172A] mb-3">Next Demo</p>
              <div className="p-3 bg-[#FFD9D0] border-l-4 border-[#FF5A36] rounded-lg">
                <p className="font-bold text-xs text-[#0F172A]">{leads.find(l => l.status === 'booked')?.name} · {leads.find(l => l.status === 'booked')?.company}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Today · 11:30 AM · Zoom</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Prospects */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h2 className="font-bold text-[#0F172A] text-sm">
            Top Prospects {!leadsLoading && leads.length > 0 && <span className="text-[#FF5A36]">· AI-Sourced</span>}
          </h2>
        </div>
        {leadsLoading ? <LeadSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#F1F5F9]">
                  {['Prospect', 'Intent Score', 'Buying Signal', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {topLeads.map((p, i) => {
                  const s = STATUS_STYLE[p?.status] || STATUS_STYLE.pending;
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.06 }}
                      className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0" style={{ backgroundColor: p.color }}>{p.initials}</div>
                          <div>
                            <div className="text-xs font-bold text-[#0F172A]">{p.name}</div>
                            <div className="text-[11px] text-[#64748B]">{p.role} · {p.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${p.score}%` }} />
                          </div>
                          <span className="text-xs font-bold text-[#0F172A]">{p.score}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[200px]"><span className="text-xs text-[#475569] line-clamp-2">{p.signal}</span></td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ color: s.color, backgroundColor: s.bg }}>
                          {s.icon} {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => onDraftEmail(p)}
                          className="text-xs font-semibold text-[#FF5A36] hover:underline flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Draft Email
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-6 py-3 border-t border-[#F1F5F9]">
          <span className="text-xs text-[#64748B]">
            {leadsLoading ? '⏳ Scanning for AI-sourced leads...' : `Showing ${Math.min(5, leads.length)} of ${leads.length} AI-sourced prospects`}
          </span>
        </div>
      </div>
    </>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

function DashboardInner() {
  const [agentRunning, setAgentRunning] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(DEFAULT_CALENDAR_EVENTS);
  const [threads, setThreads] = useState<Record<number, string[]>>({});
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [icp, setIcp] = useState<ICPAnalysis | null>(null);
  const [activityFeed, setActivityFeed] = useState<{icon: string, msg: string, time: string}[]>([]);
  const [emailModal, setEmailModal] = useState<EmailModal>({ open: false, loading: false, subject: '', body: '', prospect: null });
  const [linkedInModal, setLinkedInModal] = useState<LinkedInModal>({ open: false, loading: false, message: '', prospect: null });
  const activityCounter = useRef(0);
  const { showToast } = useToast();

  // ── Load leads ──────────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async (icpData: ICPAnalysis | null, website: string, email: string, currentKey: string, force = false) => {
    setLeadsLoading(true);
    try {
      if (!force) {
        // Try fetching from DB first
        const dbRes = await fetch(`/api/leads?email=${email}`);
        const dbData = await dbRes.json();
        if (dbData.leads && dbData.leads.length > 0) {
          setLeads(dbData.leads);
          setLeadsLoading(false);
          return;
        }
      }

      // If force or no leads in DB, generate new ones
      const res = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icp: icpData, website, clientApiKey: currentKey }),
      });
      const data = await res.json();
      if (data.leads?.length) {
        setLeads(data.leads);
        // Save to DB
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, leads: data.leads }),
        });
        if (data.source === 'gemini') showToast(`${data.leads.length} AI-generated leads loaded!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load leads', 'error');
    }
    setLeadsLoading(false);
  }, [showToast]);

  // ── Auth guard & initial load ──────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      let email = localStorage.getItem('gojiberry_session');
      if (!email) {
        email = 'demo@gojiberry.ai';
        localStorage.setItem('gojiberry_session', email);
        // Create demo user
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: 'Ayazkhan', website: 'gojiberry.ai' })
        });
      }

      try {
        const [uRes, tRes, eRes, nRes] = await Promise.all([
          fetch(`/api/user?email=${email}`),
          fetch(`/api/threads?email=${email}`),
          fetch(`/api/events?email=${email}`),
          fetch(`/api/notifications?email=${email}`),
        ]);

        const uData = await uRes.json();
        const tData = await tRes.json();
        const eData = await eRes.json();
        const nData = await nRes.json();

        let currentIcp = null;
        let currentWebsite = 'gojiberry.ai';
        let currentKey = '';

        if (uData.user) {
          setUserInfo({ name: uData.user.name, email: uData.user.email, website: uData.user.website, isSuperadmin: uData.isSuperadmin });
          setIcp(uData.user.icp);
          setGeminiKey(uData.user.geminiKey || '');
          currentIcp = uData.user.icp;
          currentWebsite = uData.user.website || currentWebsite;
          currentKey = uData.user.geminiKey || '';
        } else {
          setUserInfo({ name: 'Ayazkhan', email, website: currentWebsite, isSuperadmin: false });
        }

        if (tData.threads) setThreads(tData.threads);
        if (eData.events && eData.events.length > 0) setCalendarEvents(eData.events);
        if (nData.notifications && nData.notifications.length > 0) setNotifications(nData.notifications);

        // Fetch leads from DB or generate if empty
        fetchLeads(currentIcp, currentWebsite, email, currentKey, false);

      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, [fetchLeads]);

  // ── Activity feed ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (leads.length > 0) {
      setActivityFeed(ACTIVITY_TEMPLATES(leads));
    }
  }, [leads]);

  useEffect(() => {
    if (!agentRunning) return;
    const NEW_MSGS = [
      () => `Scanned ${(10000 + activityCounter.current * 1200).toLocaleString()}+ new intent signals`,
      () => leads.length > 0 ? `Scored ${leads[activityCounter.current % leads.length]?.name} — ${leads[activityCounter.current % leads.length]?.score}% intent match` : 'New prospect scored with high intent',
      () => leads.length > 0 ? `Sent follow-up to ${leads[(activityCounter.current + 1) % leads.length]?.name} at ${leads[(activityCounter.current + 1) % leads.length]?.company}` : 'Follow-up sent to warm prospect',
      () => `Reply rate improved to ${19 + (activityCounter.current % 6)}% — above industry average`,
      () => `AI optimized subject lines based on ${leads.length * 3} open patterns this week`,
    ];
    const ICONS = ['🔍', '📊', '✉️', '📈', '🧠'];

    const interval = setInterval(() => {
      const idx = activityCounter.current % NEW_MSGS.length;
      activityCounter.current += 1;
      const newItem: ActivityItem = { icon: ICONS[idx], msg: NEW_MSGS[idx](), time: 'just now' };

      setActivityFeed(prev => [newItem, ...prev.map(item => ({
        ...item,
        time: item.time === 'just now' ? '1m ago' :
              item.time === '1m ago'   ? '5m ago' :
              item.time === '5m ago'   ? '12m ago' :
              item.time === '12m ago'  ? '30m ago' :
              item.time === '30m ago'  ? '1h ago' : item.time,
      })).slice(0, 5)]);

      // Add to notifications
      const newNotif = { icon: ICONS[idx], msg: newItem.msg, time: 'just now', unread: true };
      const email = localStorage.getItem('gojiberry_session') || '';
      if (email) {
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, notification: newNotif })
        }).then(res => res.json()).then(data => {
          if (data.notification) {
            setNotifications(prev => [data.notification, ...prev].slice(0, 20));
          }
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [agentRunning, leads]);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleDraftEmail = async (prospect: Lead) => {
    setEmailModal({ open: true, loading: true, subject: '', body: '', prospect });
    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect, icp, fromName: userInfo?.name ?? 'The Team', fromCompany: 'Gojiberry AI', clientApiKey: geminiKey }),
      });
      const data = await res.json();
      setEmailModal(prev => ({ ...prev, loading: false, subject: data.email?.subject ?? '', body: data.email?.body ?? '' }));
    } catch {
      setEmailModal(prev => ({ ...prev, loading: false, subject: 'Quick question', body: 'Could not generate email. Please try again.' }));
    }
  };

  const handleLinkedIn = async (prospect: Lead) => {
    setLinkedInModal({ open: true, loading: true, message: '', prospect });
    try {
      const res = await fetch('/api/generate-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect, icp, fromName: userInfo?.name ?? 'The Team', clientApiKey: geminiKey }),
      });
      const data = await res.json();
      setLinkedInModal(prev => ({ ...prev, loading: false, message: data.message ?? '' }));
    } catch {
      const firstName = prospect.name.split(' ')[0];
      setLinkedInModal(prev => ({ ...prev, loading: false, message: `Hi ${firstName}, saw your recent activity and thought we should connect. What we've built at Gojiberry handles exactly this challenge.` }));
    }
  };

  const handleBookDemo = useCallback(async (lead: Lead) => {
    const meetingTypes = ['Zoom', 'Google Meet', 'Teams'];
    const meetingType = meetingTypes[lead.id % meetingTypes.length];
    const meetingUrls: Record<string, string> = {
      'Zoom': 'https://zoom.us/j/123456789',
      'Google Meet': 'https://meet.google.com/abc-def-ghi',
      'Teams': 'https://teams.microsoft.com/l/meetup-join/abc',
    };
    const days = ['Tomorrow', 'Aug 12', 'Aug 13', 'Aug 14', 'Aug 15'];
    const times = ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    const email = localStorage.getItem('gojiberry_session') || '';
    const newEvent = {
      title: `Demo with ${lead.name.split(' ')[0]}`,
      company: lead.company,
      date: days[lead.id % days.length],
      time: times[lead.id % times.length],
      type: meetingType,
      color: lead.color,
      status: 'confirmed',
      meetingUrl: meetingUrls[meetingType],
      prospectId: lead.id,
    };

    // Save event to DB
    const eRes = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, event: newEvent })
    });
    const eData = await eRes.json();
    if (eData.event) {
      setCalendarEvents(prev => [...prev, eData.event]);
    }

    // Update lead status to booked in DB
    await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id, status: 'booked' })
    });
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'booked' } : l));

    showToast(`Demo booked with ${lead.name} — ${newEvent.date} at ${newEvent.time}!`, 'success');

    // Add notification to DB
    const newNotif = {
      icon: '📅',
      msg: `Demo booked with ${lead.name} at ${lead.company} — ${newEvent.date} ${newEvent.time} via ${meetingType}`,
      time: 'just now',
      unread: true,
    };
    const nRes = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, notification: newNotif })
    });
    const nData = await nRes.json();
    if (nData.notification) {
      setNotifications(prev => [nData.notification, ...prev].slice(0, 20));
    }
  }, [showToast]);

  const handleSendReply = useCallback(async (leadId: number, message: string) => {
    const email = localStorage.getItem('gojiberry_session') || '';
    
    // Save thread message to DB
    await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, leadId, message })
    });
    setThreads(prev => {
      const currentThread = prev[leadId] ?? [];
      return { ...prev, [leadId]: [...currentThread, message] };
    });
    
    // Check if lead is pending and needs status update
    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.status === 'pending') {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: 'contacted' })
      });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'contacted' } : l));
    }
  }, [leads]);

  const handleRefreshLeads = useCallback(() => {
    const email = localStorage.getItem('gojiberry_session') || '';
    const website = userInfo?.website || 'gojiberry.ai';
    fetchLeads(icp, website, email, geminiKey, true);
    showToast('Scanning for fresh leads...', 'info');
  }, [icp, fetchLeads, showToast, userInfo, geminiKey]);

  const handleCalendarSync = useCallback(() => {
    // Add any booked prospects not yet in calendar
    const bookedLeads = leads.filter(l => l.status === 'booked');
    const existingProspectIds = calendarEvents.filter(e => e.prospectId).map(e => e.prospectId);
    const missing = bookedLeads.filter(l => !existingProspectIds.includes(l.id));

    if (missing.length > 0) {
      missing.forEach(lead => handleBookDemo(lead));
      showToast(`Synced ${missing.length} booked demo(s) to calendar!`, 'success');
    } else {
      showToast('Calendar is up to date!', 'success');
    }
  }, [leads, calendarEvents, handleBookDemo, showToast]);

  const handleSaveSettings = useCallback((newIcp: ICPAnalysis, fromName: string, fromEmail: string) => {
    setIcp(newIcp);
    setUserInfo(prev => prev ? { ...prev, name: fromName, email: fromEmail } : { name: fromName, email: fromEmail, website: '' });
    const email = localStorage.getItem('gojiberry_session') || fromEmail;
    const website = userInfo?.website || 'gojiberry.ai';
    fetchLeads(newIcp, website, email, geminiKey, true);
    showToast('Settings saved! Refreshing leads with new ICP...', 'success');
  }, [fetchLeads, showToast, userInfo, geminiKey]);

  const unreadCount = notifications.filter(n => n.unread).length;
  const inboxUnread = leads.filter(l => l.status === 'replied').length;
  const pageTitle = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <EmailModal modal={emailModal} onClose={() => setEmailModal(prev => ({ ...prev, open: false }))} />
      <LinkedInModal modal={linkedInModal} onClose={() => setLinkedInModal(prev => ({ ...prev, open: false }))} />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col py-6 shrink-0 hidden lg:flex">
        <div className="px-6 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A36] flex items-center justify-center text-white font-bold text-xs shadow-sm">gb</div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-[#111827]">gojiberry</span>
          </Link>
        </div>

        {/* Agent status */}
        <div className="mx-4 mb-6">
          <div className="relative p-0.5">
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
              <span key={pos} className={`absolute w-2 h-2 border-[#FF5A36]/40 ${pos === 'top-left' ? '-top-1 -left-1 border-t border-l' : pos === 'top-right' ? '-top-1 -right-1 border-t border-r' : pos === 'bottom-left' ? '-bottom-1 -left-1 border-b border-l' : '-bottom-1 -right-1 border-b border-r'}`} />
            ))}
            <div className={`px-4 py-3 rounded-lg flex items-center justify-between ${agentRunning ? 'bg-[#FFF2ED]' : 'bg-[#F1F5F9]'}`}>
              <div>
                <div className="text-xs font-bold text-[#0F172A]">AI Agent</div>
                <div className={`text-[11px] font-semibold ${agentRunning ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>
                  {agentRunning ? '● Running 24/7' : '● Paused'}
                </div>
              </div>
              <button
                onClick={() => { setAgentRunning(!agentRunning); showToast(`Agent ${agentRunning ? 'paused' : 'resumed'}`, agentRunning ? 'info' : 'success'); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${agentRunning ? 'bg-[#FF5A36] text-white hover:bg-[#E04826]' : 'bg-[#E2E8F0] text-[#475569] hover:bg-[#D1D5DB]'}`}>
                {agentRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-auto">
          {(userInfo?.isSuperadmin ? [...NAV_ITEMS, { id: 'admin', icon: <Target className="w-5 h-5" />, label: 'Admin Panel' }] : NAV_ITEMS).map((item) => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${activeNav === item.id ? 'bg-[#FFF2ED] text-[#FF5A36]' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'}`}>
              <span className={activeNav === item.id ? 'text-[#FF5A36]' : 'text-[#94A3B8]'}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.id === 'inbox' && inboxUnread > 0 && (
                <span className="w-5 h-5 bg-[#FF5A36] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{inboxUnread}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 pt-4 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5A36] to-[#FF8A65] text-white font-bold text-sm flex items-center justify-center">
              {userInfo?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#0F172A] truncate">{userInfo?.name ?? 'Demo User'}</div>
              <div className="text-[11px] text-[#94A3B8] truncate">Pro Plan</div>
            </div>
            <button
              type="button"
              title="Sign out"
              onClick={async () => {
                localStorage.removeItem('gojiberry_session');
                localStorage.removeItem('gojiberry_leads');
                const { signOut } = await import('next-auth/react');
                await signOut({ redirectTo: '/login' });
              }}
              className="text-[#94A3B8] hover:text-[#FF5A36] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-heading text-xl font-extrabold text-[#0F172A]">{pageTitle}</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              {leadsLoading ? '⏳ AI scanning for leads...' : `${leads.length} leads sourced by AI · Last updated just now`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#475569] hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5A36] rounded-full" />}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#E2E8F0] shadow-xl z-40 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
                        <span className="font-bold text-sm text-[#0F172A]">Notifications</span>
                        <button onClick={async () => {
                          const email = localStorage.getItem('gojiberry_session') || '';
                          await fetch('/api/notifications', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, markAllRead: true })
                          });
                          setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                          showToast('All marked as read', 'success');
                        }} className="text-xs text-[#FF5A36] font-semibold hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-auto divide-y divide-[#F8FAFC]">
                        {notifications.map((n) => (
                          <div key={n.id} className={`px-4 py-3 flex items-start gap-3 ${n.unread ? 'bg-[#FFFBF9]' : ''}`}>
                            <span className="text-base leading-none mt-0.5 shrink-0">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[#334155] leading-relaxed">{n.msg}</p>
                              <p className="text-[10px] text-[#94A3B8] mt-0.5">{n.time}</p>
                            </div>
                            {n.unread && <div className="w-2 h-2 rounded-full bg-[#FF5A36] shrink-0 mt-1" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF2ED] border border-[#FFD9CD] rounded-lg cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-[#FF5A36] text-white text-xs font-bold flex items-center justify-center">
                {userInfo?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <span className="text-xs font-semibold text-[#0F172A] hidden sm:block">{userInfo?.name ?? 'Demo User'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeNav} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeNav === 'dashboard' && (
                <DashboardMainView
                  leads={leads}
                  leadsLoading={leadsLoading}
                  agentRunning={agentRunning}
                  activityFeed={activityFeed}
                  onDraftEmail={handleDraftEmail}
                  onNavigate={setActiveNav}
                />
              )}
              {activeNav === 'prospects' && (
                <ProspectsView
                  leads={leads}
                  leadsLoading={leadsLoading}
                  onDraftEmail={handleDraftEmail}
                  onRefresh={handleRefreshLeads}
                  onLinkedIn={handleLinkedIn}
                  onBookDemo={handleBookDemo}
                />
              )}
              {activeNav === 'inbox' && (
                <InboxView
                  leads={leads}
                  icp={icp}
                  userInfo={userInfo}
                  threads={threads}
                  onSendReply={handleSendReply}
                  onBookDemo={handleBookDemo}
                  geminiKey={geminiKey}
                />
              )}
              {activeNav === 'outreach'  && <OutreachView leads={leads} />}
              {activeNav === 'calendar'  && <CalendarView events={calendarEvents} onSync={handleCalendarSync} />}
              {activeNav === 'playbooks' && <PlaybooksView />}
              {activeNav === 'admin' && userInfo?.isSuperadmin && <SuperadminDashboardView />}
              {activeNav === 'settings'  && (
              <SettingsView
                icp={icp}
                userInfo={userInfo}
                onSaveAndRefresh={handleSaveSettings}
                geminiKey={geminiKey}
                onGeminiKeyChange={key => { setGeminiKey(key); showToast('Gemini API key saved! AI features now active.', 'success'); }}
              />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardInner />
    </ToastProvider>
  );
}
