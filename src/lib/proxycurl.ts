const PROXYCURL_BASE_URL = 'https://nubela.co/proxycurl/api/v2';

export interface ProxycurlPerson {
  public_identifier: string;
  profile_pic_url: string;
  first_name: string;
  last_name: string;
  occupation: string;
  headline: string;
  summary: string;
  experiences: any[];
}

export async function searchLinkedInProfiles(
  apiKey: string,
  targetRoles: string[],
  targetIndustries: string[],
  limit: number = 5
) {
  if (!apiKey) {
    throw new Error('Proxycurl API key is missing.');
  }

  // Construct search query
  const roleRegex = targetRoles.length > 0 ? targetRoles.map(r => `(?i)${r}`).join('|') : '(?i)founder|ceo|vp|director';
  
  const params = new URLSearchParams();
  params.append('current_role_title', roleRegex);
  params.append('page_size', limit.toString());
  params.append('enrich_profiles', 'enrich'); // Fetch rich profiles instead of just URLs

  try {
    const response = await fetch(`${PROXYCURL_BASE_URL}/search/person?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Proxycurl API Error:', err);
      throw new Error(`Proxycurl error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to search LinkedIn profiles via Proxycurl:', error);
    return [];
  }
}

export async function getLinkedInProfile(profileUrl: string, apiKey: string) {
  if (!apiKey) {
    return null;
  }
  try {
    const res = await fetch(`${PROXYCURL_BASE_URL}/linkedin?url=${encodeURIComponent(profileUrl)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return await res.json();
  } catch (e) {
    console.error("Proxycurl Error:", e);
    return null;
  }
}
