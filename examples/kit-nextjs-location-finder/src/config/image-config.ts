/**
 * Image configuration constants
 * These match the remotePatterns defined in next.config.ts
 * Extracted here to avoid importing next.config which can cause bundling issues
 */
export const IMAGE_REMOTE_PATTERNS = [
  {
    protocol: 'https',
    hostname: 'edge*.**',
    port: '',
  },
  {
    protocol: 'https',
    hostname: 'xmc-*.**',
    port: '',
  },
] as const;

const HOSTNAME_GLOB_SUFFIX = '*.**';

/**
 * Match Next.js-style hostname patterns like `edge*.**` without building `RegExp` from config
 * strings (ReDoS-safe, linear in hostname length).
 */
export function hostnameMatchesImageRemotePattern(hostname: string, patternHostname: string): boolean {
  const wildIdx = patternHostname.indexOf(HOSTNAME_GLOB_SUFFIX);
  if (wildIdx === -1) {
    return hostname === patternHostname;
  }
  const prefix = patternHostname.slice(0, wildIdx);
  if (!hostname.startsWith(prefix)) {
    return false;
  }
  return hostname.slice(prefix.length).includes('.');
}

