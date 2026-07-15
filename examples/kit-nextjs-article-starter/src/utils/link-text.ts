/**
 * Utility functions for generating descriptive link text
 * Helps improve SEO by replacing generic "Learn More" with contextual text
 */

/**
 * Checks if link text is generic/non-descriptive
 */
export const isGenericLinkText = (text: string | undefined | null): boolean => {
  if (!text) return true;
  
  const genericPatterns = [
    /^learn\s+more$/i,
    /^read\s+more$/i,
    /^click\s+here$/i,
    /^here$/i,
    /^link$/i,
    /^more$/i,
    /^continue$/i,
    /^go$/i,
    /^view\s+more$/i,
  ];
  
  return genericPatterns.some((pattern) => pattern.test(text.trim()));
};

export const generateDescriptiveLinkText = (
  linkText: string | undefined | null,
  contextTitle?: string | undefined | null,
  linkDestination?: string | undefined | null
): string => {
  // If link text is already descriptive, use it
  if (linkText && !isGenericLinkText(linkText)) {
    return linkText;
  }

  // Generate descriptive text from context
  if (contextTitle) {
    const title = String(contextTitle).trim();
    if (title) {
      // Use context title to create descriptive text
      return `Read about ${title}`;
    }
  }

  // Try to extract meaning from URL
  if (linkDestination) {
    const url = String(linkDestination);
    
    // Extract article/page name from URL
    const articleMatch = url.match(/\/([^/]+?)(?:\.html|$)/);
    if (articleMatch) {
      const pageName = articleMatch[1]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return `Read ${pageName}`;
    }
    
    // For external links, use domain
    if (url.startsWith('http')) {
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        return `Visit ${domain}`;
      } catch {
        // Invalid URL, fall through
      }
    }
  }

  // Final fallback - still better than "Learn More"
  return 'Read article';
};

export const getDescriptiveLinkText = (
  linkField: { value?: { text?: string; href?: string } } | null | undefined,
  contextTitle?: string | undefined | null
): string => {
  const linkText = linkField?.value?.text;
  const linkHref = linkField?.value?.href;
  
  return generateDescriptiveLinkText(linkText, contextTitle, linkHref);
};
