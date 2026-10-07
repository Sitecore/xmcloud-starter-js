/**
 * Demo-only session event log for ProfileIdWidget.
 * Intercepts Content SDK event POSTs to Sitecore Edge (`/v1/events/`) and
 * records type + page for display. Display-only — does not alter event delivery.
 */

export type SessionEventEntry = {
  type: string;
  page: string;
  at: number;
};

export const SESSION_EVENTS_KEY = 'sc_demo_session_events';
export const SESSION_EVENTS_CHANGED = 'sc-demo-session-events-changed';

const TRACKING_FLAG = '__scDemoSessionEventTracking';

type TrackingWindow = Window & {
  [TRACKING_FLAG]?: boolean;
  __scDemoOriginalFetch?: typeof fetch;
};

function notifyListeners() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SESSION_EVENTS_CHANGED));
}

export function readSessionEvents(): SessionEventEntry[] {
  try {
    const raw = sessionStorage.getItem(SESSION_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is SessionEventEntry =>
        !!entry &&
        typeof entry === 'object' &&
        typeof (entry as SessionEventEntry).type === 'string' &&
        typeof (entry as SessionEventEntry).page === 'string' &&
        !(entry as SessionEventEntry).type.toUpperCase().startsWith('VIEW')
    );
  } catch {
    return [];
  }
}

export function clearSessionEvents() {
  sessionStorage.removeItem(SESSION_EVENTS_KEY);
  notifyListeners();
}

export function recordSessionEvent(type: string, page?: string) {
  const entry: SessionEventEntry = {
    type: type || 'UNKNOWN',
    page:
      page ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${window.location.search}`
        : ''),
    at: Date.now(),
  };

  const events = readSessionEvents();
  events.push(entry);
  sessionStorage.setItem(SESSION_EVENTS_KEY, JSON.stringify(events));
  notifyListeners();
}

function extractRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function tryRecordFromFetchBody(url: string, body: BodyInit | null | undefined) {
  if (!url.includes('/v1/events/') || body == null) return;

  let payload: { type?: string; page?: string } | null = null;
  if (typeof body === 'string') {
    payload = JSON.parse(body) as { type?: string; page?: string };
  } else if (body instanceof Blob) {
    // Async blob bodies are uncommon for SDK events; skip rather than blocking fetch
    return;
  }

  if (payload?.type) {
    const type = String(payload.type);
    // Page views are already shown under "Pages this session" — skip VIEW events here
    if (type.toUpperCase().startsWith('VIEW')) return;

    const pageUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${window.location.search}`
        : payload.page
          ? String(payload.page)
          : '';
    // Prefer live URL for display; fall back to SDK page name when offline of a window
    recordSessionEvent(type, pageUrl || (payload.page ? String(payload.page) : undefined));
  }
}

/**
 * Installs a one-time window.fetch interceptor that logs Content SDK events.
 * Safe to call multiple times. Returns an uninstall function.
 */
export function installSessionEventTracking(): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const trackingWindow = window as TrackingWindow;
  if (trackingWindow[TRACKING_FLAG]) {
    return () => undefined;
  }

  trackingWindow[TRACKING_FLAG] = true;
  const originalFetch = window.fetch.bind(window);
  trackingWindow.__scDemoOriginalFetch = originalFetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = extractRequestUrl(input);
      const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
      if (method === 'POST') {
        const body = init?.body ?? (input instanceof Request ? undefined : undefined);
        if (init?.body) {
          tryRecordFromFetchBody(url, init.body);
        } else if (input instanceof Request) {
          // Clone so we can read the body without consuming the original request
          const clone = input.clone();
          const text = await clone.text();
          tryRecordFromFetchBody(url, text);
        }
      }
    } catch {
      // Never block event delivery on logging failures
    }

    return originalFetch(input, init);
  };

  return () => {
    if (trackingWindow.__scDemoOriginalFetch) {
      window.fetch = trackingWindow.__scDemoOriginalFetch;
      delete trackingWindow.__scDemoOriginalFetch;
    }
    delete trackingWindow[TRACKING_FLAG];
  };
}
