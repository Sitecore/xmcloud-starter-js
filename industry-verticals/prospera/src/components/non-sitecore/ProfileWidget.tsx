'use client';

/**
 * Demo-only sticky widget that loads the current visitor profile via
 * `@sitecore-content-sdk/personalize` (`personalize({ friendlyId: 'profile' })`)
 * and surfaces identity, sessions, events, and affinity scores.
 *
 * If personalize fails or returns an unexpected payload, falls back to
 * `ProfileIdWidget` and logs the error to the console for debugging.
 *
 * Note: Bootstrap does not initialize analytics/personalize in development or
 * Pages editor / preview — that path uses the ProfileIdWidget fallback.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { UserCircle, X, Loader2, RotateCcw, Copy, Check } from 'lucide-react';
import { personalize } from '@sitecore-content-sdk/personalize';
import { ProfileIdWidget } from 'components/non-sitecore/ProfileIdWidget';

type ProfileIdentifier = {
  provider?: string;
  id?: string;
};

type ProfileContact = {
  firstName?: string;
  lastName?: string;
};

type ProfileEvent = {
  type?: string;
  name?: string;
  createdAt?: string;
  customData?: Record<string, unknown>;
  arbitraryData?: Record<string, unknown>;
  custom?: Record<string, unknown>;
  ext?: Record<string, unknown>;
  data?: Record<string, unknown>;
  core?: Record<string, unknown>;
  [key: string]: unknown;
};

type ProfileGeolocation = {
  city?: string;
  region?: string;
  country?: string;
  continent?: string;
};

type ProfileClientDevice = {
  type?: string;
  software?: string;
  softwareVersion?: string;
  operatingSystem?: string;
  operatingSystemVersion?: string;
};

type ProfileSession = {
  status?: string;
  state?: string;
  name?: string;
  endedAt?: string | null;
  closedAt?: string | null;
  geolocation?: ProfileGeolocation;
  clientDevice?: ProfileClientDevice;
  events?: ProfileEvent[];
  [key: string]: unknown;
};

type AffinityEntry = {
  name: string;
  score: number;
};

type AffinityCategory = {
  category: string;
  entries: AffinityEntry[];
};

type GuestProfile = {
  id?: string;
  type?: string;
  contact?: ProfileContact;
  identifiers?: ProfileIdentifier[];
  sessions?: ProfileSession[];
  traits?: {
    affinities?: unknown;
  };
  [key: string]: unknown;
};

const regionDisplayNames =
  typeof Intl !== 'undefined' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;

const formatCountryName = (countryCode?: string): string => {
  const code = countryCode?.trim();
  if (!code) return '';
  try {
    return regionDisplayNames?.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
};

const formatGeolocation = (geo?: ProfileGeolocation): string => {
  if (!geo) return '';
  return [geo.city, geo.region, formatCountryName(geo.country)].filter(Boolean).join(', ');
};

const formatClientDevice = (device?: ProfileClientDevice): string => {
  if (!device) return '';
  const typeOs = device.operatingSystem
    ? `${device.type || 'Device'} (${device.operatingSystem})`
    : device.type || '';
  return [typeOs, device.software].filter(Boolean).join(', ');
};

const isFailedPersonalizeResponse = (
  value: unknown
): value is { status?: string; message?: string; code?: string } =>
  Boolean(value && typeof value === 'object' && 'status' in value && 'code' in value);

const extractProfile = (response: unknown): GuestProfile | null => {
  if (!response || typeof response !== 'object' || isFailedPersonalizeResponse(response)) {
    return null;
  }

  const record = response as Record<string, unknown>;
  if (record.profile && typeof record.profile === 'object') {
    return record.profile as GuestProfile;
  }

  // Some flows return the guest object at the root.
  if ('type' in record || 'sessions' in record || 'traits' in record) {
    return record as GuestProfile;
  }

  return null;
};

const isOpenSession = (session: ProfileSession): boolean => {
  const status = String(session.status || session.state || '').toUpperCase();
  if (status === 'OPEN') return true;
  if (status === 'CLOSED') return false;
  if (session.endedAt || session.closedAt) return false;
  return !session.endedAt && !session.closedAt;
};

const isPageViewEvent = (event: ProfileEvent): boolean => {
  const type = String(event.type || '').toLowerCase();
  return type === 'pageview' || type === 'view';
};

const getEventCustomData = (event: ProfileEvent): Record<string, unknown> | null => {
  const candidates = [
    event.customData,
    event.arbitraryData,
    event.custom,
    event.ext,
    event.data,
  ];
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object' && Object.keys(candidate).length > 0) {
      return candidate;
    }
  }

  return null;
};

const parseAffinityScore = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value && typeof value === 'object' && 'score' in value) {
    const score = (value as { score?: unknown }).score;
    if (typeof score === 'number' && Number.isFinite(score)) return score;
  }
  return null;
};

const parseAffinityName = (value: unknown, fallback: string): string => {
  if (value && typeof value === 'object') {
    const record = value as { name?: unknown; value?: unknown };
    if (typeof record.name === 'string' && record.name.trim()) return record.name.trim();
    if (typeof record.value === 'string' && record.value.trim()) return record.value.trim();
  }
  return fallback;
};

const parseAffinities = (affinities: unknown): AffinityCategory[] => {
  if (!affinities) return [];

  if (Array.isArray(affinities)) {
    return affinities
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const record = item as Record<string, unknown>;
        const category = String(record.category || record.name || 'affinity');
        const values = record.values || record.affinities || record.entries;
        if (!Array.isArray(values)) return null;
        const entries = values
          .map((entry, index) => {
            const score = parseAffinityScore(entry);
            if (score === null) return null;
            return {
              name: parseAffinityName(entry, `item-${index + 1}`),
              score,
            };
          })
          .filter((entry): entry is AffinityEntry => Boolean(entry))
          .sort((a, b) => b.score - a.score);
        return entries.length ? { category, entries } : null;
      })
      .filter((item): item is AffinityCategory => Boolean(item));
  }

  if (typeof affinities !== 'object') return [];

  return Object.entries(affinities as Record<string, unknown>)
    .map(([category, value]) => {
      if (Array.isArray(value)) {
        const entries = value
          .map((entry, index) => {
            const score = parseAffinityScore(entry);
            if (score === null) return null;
            return {
              name: parseAffinityName(entry, `item-${index + 1}`),
              score,
            };
          })
          .filter((entry): entry is AffinityEntry => Boolean(entry))
          .sort((a, b) => b.score - a.score);
        return entries.length ? { category, entries } : null;
      }

      if (!value || typeof value !== 'object') return null;

      const entries = Object.entries(value as Record<string, unknown>)
        .map(([name, entryValue]) => {
          const score = parseAffinityScore(entryValue);
          if (score === null) return null;
          return { name: parseAffinityName(entryValue, name), score };
        })
        .filter((entry): entry is AffinityEntry => Boolean(entry))
        .sort((a, b) => b.score - a.score);

      return entries.length ? { category, entries } : null;
    })
    .filter((item): item is AffinityCategory => Boolean(item));
};

const AffinityBars = ({ categories }: { categories: AffinityCategory[] }) => {
  if (!categories.length) {
    return <p className="text-foreground/50 m-0">No affinities yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="text-foreground/80 text-sm font-semibold">Top affinities</div>
      <div className="text-foreground/40 grid grid-cols-[minmax(0,1fr)_7.5rem] gap-3 text-[10px] font-medium tracking-wide uppercase">
        <span>Affinity</span>
        <span>Score</span>
      </div>

      {categories.map((category) => (
        <div key={category.category} className="space-y-1.5">
          <div className="text-foreground/40 text-[10px] font-semibold tracking-wide lowercase">
            {category.category}
          </div>
          <div className="divide-y divide-neutral-100 border-t border-neutral-100">
            {category.entries.map((entry, index) => {
              const widthPct = Math.max(Math.min(entry.score, 1) * 100, 12);
              const isTop = index === 0;
              return (
                <div
                  key={`${category.category}-${entry.name}`}
                  className="grid grid-cols-[minmax(0,1fr)_7.5rem] items-center gap-3 py-1.5"
                >
                  <span className="text-foreground/85 truncate text-[11px] font-semibold">
                    {entry.name}
                  </span>
                  <div className="h-5 overflow-hidden rounded-full bg-violet-100">
                    <div
                      className={`flex h-full min-w-[2.75rem] items-center justify-end rounded-full px-2 text-[10px] font-semibold ${
                        isTop ? 'bg-violet-900 text-white' : 'bg-violet-300 text-violet-950'
                      }`}
                      style={{ width: `${widthPct}%` }}
                      title={entry.score.toFixed(2)}
                    >
                      {entry.score.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProfileWidget = () => {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  const activateFallback = useCallback((reason: string, details?: unknown) => {
    console.error('[ProfileWidget] Falling back to ProfileIdWidget:', reason, details ?? '');
    setProfile(null);
    setUseFallback(true);
    setLoading(false);
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await personalize({
        channel: 'WEB',
        friendlyId: 'profile',
      });

      if (!response) {
        activateFallback('personalize returned no data');
        return;
      }

      if (isFailedPersonalizeResponse(response)) {
        activateFallback(response.message || 'personalize request failed', response);
        return;
      }

      const nextProfile = extractProfile(response);
      if (!nextProfile) {
        activateFallback('unexpected personalize response shape', response);
        return;
      }

      setUseFallback(false);
      setProfile(nextProfile);
      setLoading(false);
    } catch (err) {
      activateFallback(
        err instanceof Error ? err.message : 'personalize threw an unexpected error',
        err
      );
    }
  }, [activateFallback]);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      void loadProfile();
    }, 600);
    return () => clearTimeout(timer);
  }, [loadProfile]);

  const handleCopy = useCallback(async () => {
    if (!profile?.id) return;
    await navigator.clipboard.writeText(profile.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profile?.id]);

  const handleReset = useCallback(() => {
    setResetting(true);

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

    setTimeout(() => window.location.reload(), 600);
  }, []);

  const isIdentified = String(profile?.type || '').toLowerCase() === 'identified';
  const identityLabel = isIdentified ? 'Identified' : 'Anonymous';

  const contactName = useMemo(() => {
    if (!isIdentified) return null;
    const first = profile?.contact?.firstName?.trim() || '';
    const last = profile?.contact?.lastName?.trim() || '';
    const full = `${first} ${last}`.trim();
    return full || null;
  }, [isIdentified, profile?.contact?.firstName, profile?.contact?.lastName]);

  const identifierLabel = useMemo(() => {
    const first = profile?.identifiers?.[0];
    if (!first?.provider && !first?.id) return '-';
    return `${first.provider || 'unknown'} - ${first.id || 'unknown'}`;
  }, [profile?.identifiers]);

  const sessions = profile?.sessions || [];
  const openSession = useMemo(
    () => sessions.find(isOpenSession) || sessions.find((session) => !session.endedAt),
    [sessions]
  );

  const geoLabel = useMemo(
    () => formatGeolocation(openSession?.geolocation),
    [openSession?.geolocation]
  );

  const deviceLabel = useMemo(
    () => formatClientDevice(openSession?.clientDevice),
    [openSession?.clientDevice]
  );

  const pageViews = useMemo(() => {
    const events = openSession?.events || [];
    return [...events]
      .filter(isPageViewEvent)
      .sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return aTime - bTime;
      });
  }, [openSession]);

  const otherEvents = useMemo(() => {
    const events = openSession?.events || [];
    return [...events]
      .filter((event) => !isPageViewEvent(event))
      .sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return aTime - bTime;
      });
  }, [openSession]);

  const affinityCategories = useMemo(
    () => parseAffinities(profile?.traits?.affinities),
    [profile?.traits?.affinities]
  );

  if (!mounted) return null;

  if (useFallback) {
    return <ProfileIdWidget />;
  }

  const widget = (
    <div
      className="pointer-events-none fixed inset-y-0 right-4 z-[2147483000] flex flex-col items-end gap-2 py-4"
      style={{ position: 'fixed', right: '1rem', top: 0, bottom: 0 }}
    >
      {expanded && (
        <div className="pointer-events-auto flex min-h-0 w-[26rem] flex-1 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-lg">
          <div className="border-border flex shrink-0 items-center justify-between border-b px-3 py-2">
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

          {loading ? (
            <div className="text-foreground/50 flex items-center gap-2 px-3 py-4 text-xs">
              <Loader2 size={14} className="animate-spin" />
              Loading profile…
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                {profile?.id ? (
                  <>
                    <span
                      className="text-foreground/80 min-w-0 flex-1 truncate font-mono text-xs select-all"
                      title={profile.id}
                    >
                      {profile.id}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="text-foreground/50 hover:text-foreground shrink-0 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check size={13} className="text-green-500" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </>
                ) : (
                  <span className="text-foreground/50 text-xs">Profile ID unavailable</span>
                )}
              </div>

              <div>
                <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                  Type
                </div>
                <p className="text-foreground/80 m-0 font-semibold">{identityLabel}</p>
                {contactName ? (
                  <p className="text-foreground/80 m-0 mt-1">{contactName}</p>
                ) : null}
              </div>

              <div>
                <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                  Identifier
                </div>
                <p className="text-foreground/80 m-0 break-all">{identifierLabel}</p>
              </div>

              <div>
                <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                  Sessions
                </div>
                <p className="text-foreground/80 m-0">{sessions.length}</p>
              </div>

              <div>
                <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                  Current session
                </div>
                {geoLabel ? (
                  <p className="text-foreground/80 m-0 mb-1">
                    <span className="text-foreground/50">Geo: </span>
                    {geoLabel}
                  </p>
                ) : null}
                {deviceLabel ? (
                  <p className="text-foreground/80 m-0 mb-2">
                    <span className="text-foreground/50">Device: </span>
                    {deviceLabel}
                  </p>
                ) : null}
                {pageViews.length ? (
                  <ol className="text-foreground/80 m-0 list-decimal space-y-1 pl-4">
                    {pageViews.map((event, index) => (
                      <li key={`${index}-${event.createdAt}-${event.name}`} className="break-all">
                        {event.name || 'Untitled page'}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-foreground/50 m-0">No page views in the open session.</p>
                )}
              </div>

              <div>
                <div className="text-foreground/50 mb-1 font-medium tracking-wider uppercase">
                  Events ({otherEvents.length})
                </div>
                {otherEvents.length ? (
                  <ul className="m-0 list-none space-y-2 p-0">
                    {otherEvents.map((event, index) => {
                      const custom = getEventCustomData(event);
                      return (
                        <li
                          key={`${index}-${event.type}-${event.createdAt}`}
                          className="rounded border border-neutral-100 bg-neutral-50 px-2 py-1.5"
                        >
                          <div className="text-foreground/80 break-all font-semibold">
                            {event.name || 'Untitled'}
                          </div>
                          <div className="text-foreground/50 mt-0.5">{event.type || 'unknown'}</div>
                          {custom ? (
                            <pre className="text-foreground/70 mt-1 max-h-28 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-1.5 font-mono text-[10px]">
                              {JSON.stringify(custom, null, 2)}
                            </pre>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-foreground/50 m-0">No non-pageView events.</p>
                )}
              </div>

              <div className="border-border border-t pt-3">
                <AffinityBars categories={affinityCategories} />
              </div>
            </div>
          )}

          <div className="border-border shrink-0 border-t px-2 py-2">
            <button
              onClick={handleReset}
              disabled={resetting}
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
        onClick={() => {
          setExpanded((prev) => {
            const next = !prev;
            if (next && !loading && !useFallback) {
              void loadProfile();
            }
            return next;
          });
        }}
        className="pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 shadow-md transition-all hover:bg-neutral-50 hover:text-neutral-900"
        title="Sitecore AI Profile"
      >
        <UserCircle size={16} />
      </button>
    </div>
  );

  return createPortal(widget, document.body);
};
