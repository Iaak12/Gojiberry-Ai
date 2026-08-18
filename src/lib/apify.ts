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

  const actorId = 'apify/google-search-scraper';
  
  const roles = targetRoles.map(r => `"${r}"`).join(' OR ');
  const industries = targetIndustries.map(i => `"${i}"`).join(' OR ');
  
  // Create a precise google dork for linkedin profiles
  const searchQuery = `site:linkedin.com/in/ ${roles ? `(${roles})` : ''} ${industries ? `(${industries})` : ''}`.trim();

  try {
    const syncResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queries: searchQuery,
        resultsPerPage: limit,
        maxPagesPerQuery: 1
      })
    });

    if (!syncResponse.ok) {
      console.error('Apify Sync API Error:', await syncResponse.text());
      return [];
    }

    const items = await syncResponse.json();
    
    // Parse Google Search results into Profile format
    const profiles = items.flatMap((item: any) => {
      const organicResults = item.organicResults || [];
      return organicResults.map((result: any) => {
        // LinkedIn titles are usually "Name - Role - Company | LinkedIn"
        const titleParts = result.title.split(' - ');
        const name = titleParts[0] || '';
        const roleAndCompany = titleParts[1] || '';
        
        return {
          public_identifier: result.url?.split('/').filter(Boolean).pop() || '',
          profile_pic_url: '',
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || '',
          occupation: roleAndCompany || result.description?.slice(0, 50) || '',
          headline: roleAndCompany || '',
          summary: result.description || '',
          experiences: [],
          linkedinUrl: result.url
        };
      });
    });

    return profiles.slice(0, limit);
  } catch (error) {
    console.error('Failed to search LinkedIn profiles via Apify Google Search:', error);
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
