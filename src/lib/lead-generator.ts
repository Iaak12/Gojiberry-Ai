import { searchLinkedInProfiles } from '@/lib/apify';
import { scoreAndEnrichLeads } from '@/lib/lead-scorer';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'];

export async function generateLeadsForUser({
  userEmail,
  icp,
  website,
  geminiKey,
  apifyToken
}: {
  userEmail: string;
  icp: any;
  website: string;
  geminiKey: string;
  apifyToken: string;
}) {
  const targetRoles = icp?.targetRoles || [];
  const targetIndustries = icp?.targetIndustries || [];
  
  const rawProfiles = await searchLinkedInProfiles(apifyToken, targetRoles, targetIndustries, 8);
  
  if (!rawProfiles || rawProfiles.length === 0) {
    return { leads: [], source: 'apify', message: 'No profiles found matching ICP.' };
  }

  const scoredLeads = await scoreAndEnrichLeads(geminiKey, rawProfiles, icp, website);

  if (!scoredLeads || scoredLeads.length === 0) {
    return { leads: [], source: 'gemini', message: 'No profiles met the minimum score threshold.' };
  }

  await connectToDatabase();
  
  const enrichedLeads = scoredLeads.map((lead: any, index: number) => ({
    userEmail,
    name: lead.name || 'Unknown',
    role: lead.role || 'Unknown Role',
    company: lead.company || 'Unknown Company',
    initials: (lead.name || 'Un Known').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
    color: COLORS[index % COLORS.length],
    score: lead.score || 70,
    status: 'pending',
    signal: lead.signal || 'Matches ICP profile',
    time: 'Just now',
    email: lead.email || `${lead.name?.split(' ')[0]}@${lead.company?.replace(/\\s/g, '').toLowerCase()}.com`,
    linkedin: lead.linkedin || '',
    industry: lead.industry || 'Unknown',
    listId: 'default',
    fitStatus: 'unrated'
  }));

  try {
    const insertedLeads = await Lead.insertMany(enrichedLeads);
    return { leads: insertedLeads, source: 'live' };
  } catch (e) {
    console.error("Failed to insert leads to MongoDB:", e);
    return { leads: enrichedLeads, source: 'live' };
  }
}
