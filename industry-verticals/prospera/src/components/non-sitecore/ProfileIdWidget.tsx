'use client';

/**
 * Demo-only widget that surfaces the visitor's Sitecore AI profile ID and session
 * context (pages visited, geo, device), plus a "Restart as anonymous" reset.
 *
 * Content SDK cookie model:
 *  - `sc_cid`                              Browser / client ID
 *  - `sc_cid_personalize`                  Profile / guest reference (profile ID)
 *  - `sc_<EdgeContextId>`                  Legacy client ID cookie
 *  - `sc_<EdgeContextId>_personalize`      Legacy profile ID cookie
 *
 * Profile ID is resolved via `@sitecore-content-sdk/personalize` (`fetchProfileIdFromEdgeProxy`)
 * after reading the client ID cookie, matching the Content SDK browser adapter flow.
 *
 * Session pages are tracked client-side in sessionStorage for display only.
 * Session events are captured by intercepting Content SDK Edge event POSTs (display only).
 * Geo is resolved once per session via a public IP lookup (display only).
 * Device is inferred from the browser user agent (display only).
 *
 * Note: Bootstrap does not initialize analytics in development or Pages editor / preview.
 * The widget still renders in those modes with an unavailable profile ID message.
 *
 * Docs:
 *  - https://doc.sitecore.com/xmc/en/developers/content-sdk/index.html
 *  - fetchProfileIdFromEdgeProxy (personalize/internal)
 */

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Copy, Check, UserCircle, RotateCcw, X, Loader2 } from 'lucide-react';
import { getCookieValueClientSide } from '@sitecore-content-sdk/analytics-core/utils';
import { fetchProfileIdFromEdgeProxy } from '@sitecore-content-sdk/personalize/internal';
import config from 'sitecore.config';
import {
  clearSessionEvents,
  installSessionEventTracking,
  readSessionEvents,
  SESSION_EVENTS_CHANGED,
  type SessionEventEntry,
} from 'lib/session-event-log';

const CLIENT_ID_COOKIE = 'sc_cid';
const PROFILE_ID_COOKIE = 'sc_cid_personalize';
const SESSION_PAGES_KEY = 'sc_demo_session_pages';
const SESSION_GEO_KEY = 'sc_demo_session_geo';

type GeoInfo = {
  city: string;
  region: string;
  country: string;
};

type ScContentSdkWindow = Window & {
  scContentSDK?: {
    analytics_core?: {
      getProfileId?: () => Promise<string>;
    };
  };
};

const getCookie = (name: string): string => getCookieValueClientSide(name) || '';

const resolveClientId = (contextId: string): string =>
  getCookie(CLIENT_ID_COOKIE) || (contextId ? getCookie(`sc_${contextId}`) : '');

const resolveProfileIdFromCookies = (contextId: string): string =>
  getCookie(PROFILE_ID_COOKIE) ||
  (contextId ? getCookie(`sc_${contextId}_personalize`) : '');

async function resolveProfileId(): Promise<string | null> {
  const contextId = config.api.edge?.clientContextId || '';
  const edgeUrl = config.api.edge?.edgeUrl || '';

  const sdkGetProfileId = (window as ScContentSdkWindow).scContentSDK?.analytics_core
    ?.getProfileId;
  if (typeof sdkGetProfileId === 'function') {
    try {
      const id = await sdkGetProfileId();
      if (id) return id;
    } catch {
      // Fall through to cookie / Edge proxy resolution
    }
  }

  const fromCookie = resolveProfileIdFromCookies(contextId);
  if (fromCookie) return fromCookie;

  const clientId = resolveClientId(contextId);
  if (!clientId || !contextId || !edgeUrl) return null;

  return fetchProfileIdFromEdgeProxy(clientId, contextId, edgeUrl);
}

function readSessionPages(): string[] {
  try {
    const raw = sessionStorage.getItem(SESSION_PAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === 'string') : [];
  } catch {
    return [];
  }
}

function recordSessionPage(url: string): string[] {
  const pages = readSessionPages();
  if (pages[pages.length - 1] !== url) {
    pages.push(url);
    sessionStorage.setItem(SESSION_PAGES_KEY, JSON.stringify(pages));
  }
  return pages;
}

function detectDevice(): string {
  const ua = navigator.userAgent;
  const uaData = (
    navigator as Navigator & {
      userAgentData?: { mobile?: boolean; platform?: string };
    }
  ).userAgentData;

  if (uaData?.mobile) {
    return `Mobile${uaData.platform ? ` (${uaData.platform})` : ''}`;
  }
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  if (/Mobi|Android/i.test(ua)) return 'Mobile';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Desktop (macOS)';
  if (/Windows/i.test(ua)) return 'Desktop (Windows)';
  if (/Linux/i.test(ua)) return 'Desktop (Linux)';
  return 'Desktop';
}

async function resolveGeo(): Promise<GeoInfo | null> {
  try {
    const cached = sessionStorage.getItem(SESSION_GEO_KEY);
    if (cached) {
      return JSON.parse(cached) as GeoInfo;
    }

    const response = await fetch('https://ipwho.is/');
    if (!response.ok) return null;

    const data = (await response.json()) as {
      success?: boolean;
      city?: string;
      region?: string;
      country?: string;
    };

    if (!data.success) return null;

    const geo: GeoInfo = {
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country || 'Unknown',
    };
    sessionStorage.setItem(SESSION_GEO_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return null;
  }
}

export const ProfileIdWidget = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileResolved, setProfileResolved] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [events, setEvents] = useState<SessionEventEntry[]>([]);
  const [geo, setGeo] = useState<GeoInfo | null>(null);
  const [device, setDevice] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDevice(detectDevice());
    setEvents(readSessionEvents());
    const uninstall = installSessionEventTracking();
    const onEventsChanged = () => setEvents(readSessionEvents());
    window.addEventListener(SESSION_EVENTS_CHANGED, onEventsChanged);
    void resolveGeo().then((value) => setGeo(value));

    return () => {
      uninstall();
      window.removeEventListener(SESSION_EVENTS_CHANGED, onEventsChanged);
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const url = `${window.location.origin}${pathname}${window.location.search}`;
    setPages(recordSessionPage(url));
  }, [pathname]);

  useEffect(() => {
    let active = true;
    let attempts = 0;

    const tryGetId = async () => {
      try {
        const id = await resolveProfileId();
        if (!active) return;
        if (id) {
          setProfileId(id);
          setProfileResolved(true);
          return;
        }
      } catch {
        // Retry while analytics cookies / SDK finish initializing
      }

      attempts++;
      if (active && attempts < 8) {
        setTimeout(tryGetId, 1500);
      } else if (active) {
        setProfileResolved(true);
      }
    };

    const timer = setTimeout(tryGetId, 500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (!profileId) return;
    await navigator.clipboard.writeText(profileId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profileId]);

  const handleReset = useCallback(() => {
    setResetting(true);

    // Content SDK sets sc_* cookies with a Domain attribute (see Bootstrap.tsx cookieDomain),
    // so a cookie is only deleted when the expiry is set with that same Domain. Expire across
    // every domain scope from the full host up to the registrable domain, plus host-only.
    const expireCookie = (name: string) => {
      const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
      const hostParts = window.location.hostname.split('.');
      const domainVariants = [''];
      for (let i = 0; i < hostParts.length - 1; i++) {
        const domain = hostParts.slice(i).join('.');
        domainVariants.push(domain, '.' + domain);
      }
      domainVariants.forEach((domain) => {
        document.cookie = `${name}=; ${expiry}; path=/;${domain ? ` domain=${domain};` : ''}`;
      });
    };

    document.cookie
      .split(';')
      .map((c) => c.split('=')[0].trim())
      .filter((name) => name.startsWith('sc_'))
      .forEach(expireCookie);

    sessionStorage.removeItem(SESSION_PAGES_KEY);
    sessionStorage.removeItem(SESSION_GEO_KEY);
    clearSessionEvents();

    setTimeout(() => window.location.reload(), 600);
  }, []);

  if (!mounted) return null;

  const widget = (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-[2147483000] flex flex-col items-end gap-2"
      style={{ position: 'fixed', right: '1rem', bottom: '1rem' }}
    >
      {expanded && (
        <div className="pointer-events-auto w-80 max-h-[min(80vh,36rem)] overflow-y-auto rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-lg">
          <div className="border-border flex items-center justify-between border-b px-3 py-2">
            <span className="text-foreground/50 text-xs font-medium tracking-wider uppercase">
              Sitecore AI Profile
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-foreground/40 hover:text-foreground transition-colors"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5">
            {profileId ? (
              <>
                <span
                  className="text-foreground/80 min-w-0 flex-1 truncate font-mono text-xs select-all"
                  title={profileId}
                >
                  {profileId}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-foreground/50 hover:text-foreground shrink-0 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                </button>
              </>
            ) : (
              <span className="text-foreground/50 text-xs leading-snug">
                {profileResolved
                  ? 'Profile ID unavailable — analytics is not initialized in editing, preview, or development.'
                  : 'Resolving profile ID…'}
              </span>
            )}
          </div>

          <div className="border-border space-y-3 border-t px-3 py-2.5 text-xs">
            <div>
              <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                Pages this session ({pages.length})
              </div>
              {pages.length ? (
                <ol className="text-foreground/80 m-0 list-decimal space-y-1 pl-4">
                  {pages.map((pageUrl, index) => (
                    <li key={`${index}-${pageUrl}`} className="break-all">
                      {pageUrl}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-foreground/50 m-0">No pages recorded yet.</p>
              )}
            </div>

            <div>
              <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                Events this session ({events.length})
              </div>
              {events.length ? (
                <ol className="text-foreground/80 m-0 list-decimal space-y-1 pl-4">
                  {events.map((entry, index) => (
                    <li key={`${index}-${entry.type}-${entry.at}`} className="break-all">
                      {entry.type}
                      {entry.page ? ` (${entry.page})` : ''}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-foreground/50 m-0">No events triggered</p>
              )}
            </div>

            <div>
              <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">Geo</div>
              {geo ? (
                <p className="text-foreground/80 m-0">
                  {[geo.city, geo.region, geo.country].filter(Boolean).join(', ')}
                </p>
              ) : (
                <p className="text-foreground/50 m-0">Unavailable</p>
              )}
            </div>

            <div>
              <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                Device
              </div>
              <p className="text-foreground/80 m-0">{device || 'Unknown'}</p>
            </div>
          </div>

          <div className="border-border border-t px-2 py-2">
            <button
              onClick={handleReset}
              disabled={resetting || !profileId}
              className="text-foreground/60 hover:text-foreground hover:bg-background-muted flex w-full items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs transition-colors disabled:opacity-50"
              title="Clear session cookies and reload as a new anonymous profile"
            >
              {resetting ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
              Restart as anonymous
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 shadow-md transition-all hover:bg-neutral-50 hover:text-neutral-900"
        title="Profile ID"
      >
        <UserCircle size={16} />
      </button>
    </div>
  );

  return createPortal(widget, document.body);
};
