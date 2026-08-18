export interface ApifyPerson {
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
  apiToken: string,
  targetRoles: string[],
  targetIndustries: string[],
  limit: number = 5
) {
  if (!apiToken) {
    throw new Error('Apify API token is missing.');
  }

  // Fallback to mock data or simplified search if Apify actor is not specified.
  // Note: Apify's API requires specifying an Actor ID. 
  // For this implementation, we will assume a generic LinkedIn search actor.
  // E.g. 'rockapis/linkedin-search-scraper'
  const actorId = 'rockapis/linkedin-search-scraper';
  
  const keywords = [...targetRoles, ...targetIndustries].join(' ');
  const searchQuery = keywords || 'founder OR ceo';

  try {
    const syncResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}`,
        limit: limit
      })
    });

    if (!syncResponse.ok) {
      console.error('Apify Sync API Error:', await syncResponse.text());
      return [];
    }

    const items = await syncResponse.json();
    
    // Map Apify output to Proxycurl format to minimize changes in other files
    return items.map((item: any) => ({
      public_identifier: item.linkedinUrl?.split('/').filter(Boolean).pop() || item.id,
      profile_pic_url: item.profilePicture || '',
      first_name: item.firstName || item.name?.split(' ')[0] || '',
      last_name: item.lastName || item.name?.split(' ').slice(1).join(' ') || '',
      occupation: item.headline || '',
      headline: item.headline || '',
      summary: item.summary || item.about || '',
      experiences: item.experience || []
    }));
  } catch (error) {
    console.error('Failed to search LinkedIn profiles via Apify:', error);
    return [];
  }
}

export async function getLinkedInProfile(profileUrl: string, apiToken: string) {
  if (!apiToken) {
    return null;
  }
  
  const actorId = 'rockapis/linkedin-profile-scraper';

  try {
    const syncResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileUrls: [profileUrl]
      })
    });

    if (!syncResponse.ok) {
      console.error('Apify Sync API Error for profile:', await syncResponse.text());
      return null;
    }

    const items = await syncResponse.json();
    const item = items[0];

    if (!item) return null;

    return {
      public_identifier: profileUrl.split('/').filter(Boolean).pop(),
      profile_pic_url: item.profilePicture,
      first_name: item.firstName,
      last_name: item.lastName,
      occupation: item.headline,
      headline: item.headline,
      summary: item.about,
      experiences: item.experience || []
    };
  } catch (e) {
    console.error("Apify Error:", e);
    return null;
  }
}
