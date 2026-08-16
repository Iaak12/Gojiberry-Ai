/**
 * Utility to parse email and message templates with lead data.
 */
export function parseEmailTemplate(template: string, lead: any): string {
  if (!template) return '';
  
  let parsed = template;
  
  // Context mapping for available template variables
  const context = {
    firstName: lead?.name?.split(' ')[0] || 'there',
    lastName: lead?.name?.split(' ').slice(1).join(' ') || '',
    fullName: lead?.name || 'there',
    company: lead?.company || 'your company',
    role: lead?.role || 'your role',
    industry: lead?.industry || 'your industry',
    signal: lead?.signal || 'your recent activity',
  };

  // Replace all {{variable}} occurrences (case-insensitive)
  Object.keys(context).forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    // @ts-ignore
    parsed = parsed.replace(regex, context[key] || '');
  });

  return parsed;
}
