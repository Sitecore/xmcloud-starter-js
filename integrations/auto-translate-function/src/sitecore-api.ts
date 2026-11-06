import type { TranslationStrategy, WorkerConfig } from './config';

type FetchFn = typeof fetch;

export interface SiteInfo {
  id: string;
  name: string;
  languages: string[];
}

export interface PageState {
  id: string;
  displayName?: string;
  versions?: Array<{ language?: string; version?: number; hasPresentation?: boolean }>;
  /** Workflow state of the requested version (only with withWorkflow). `id` is the state ID. */
  workflow?: { id?: string; displayName?: string; finalState?: boolean };
}

/** Status of a background job (Sites API `GET /api/v1/jobs/{handle}/status`). */
export interface JobStatus {
  name?: string;
  done: boolean;
  errors: string[];
}

/** Status codes worth retrying: timeouts, throttling and server errors. */
export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

export class SitecoreApiError extends Error {
  readonly retryable: boolean;

  constructor(
    readonly status: number,
    readonly operation: string,
    readonly responseBody: string
  ) {
    super(`${operation} failed with HTTP ${status}: ${truncate(responseBody, 500)}`);
    this.name = 'SitecoreApiError';
    this.retryable = isRetryableStatus(status);
  }
}

type ClientOptions = Pick<
  WorkerConfig,
  'clientId' | 'clientSecret' | 'environmentId' | 'apiBaseUrl' | 'authUrl' | 'audience'
> & {
  fetchFn?: FetchFn;
  now?: () => number;
};

/** Refresh the JWT this long before it expires. */
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;
const SITE_CACHE_MS = 10 * 60 * 1000;

/**
 * Minimal client for the SitecoreAI Sites and Pages REST APIs (https://xmapps-api.sitecorecloud.io),
 * authenticated with an environment automation client.
 */
export class SitecoreApiClient {
  private readonly fetchFn: FetchFn;
  private readonly now: () => number;
  private token?: { value: string; expiresAt: number };
  private siteCache = new Map<string, { site: SiteInfo; expiresAt: number }>();

  constructor(private readonly options: ClientOptions) {
    this.fetchFn = options.fetchFn ?? fetch;
    this.now = options.now ?? Date.now;
  }

  /** Finds a site by its system name (for example "main-website"). */
  async findSiteByName(name: string): Promise<SiteInfo | undefined> {
    const key = name.toLowerCase();
    const cached = this.siteCache.get(key);
    if (cached && cached.expiresAt > this.now()) return cached.site;

    const sites = await this.request<Array<Partial<SiteInfo>>>('GET', '/api/v1/sites', 'List sites');
    const match = (sites ?? []).find((site) => site.name?.toLowerCase() === key);
    if (!match?.id || !match.name) return undefined;

    const site: SiteInfo = { id: match.id, name: match.name, languages: match.languages ?? [] };
    this.siteCache.set(key, { site, expiresAt: this.now() + SITE_CACHE_MS });
    return site;
  }

  /** Returns the page state, or undefined when the item isn't a page of the site (HTTP 404). */
  async getPageState(
    pageId: string,
    siteName: string,
    language: string,
    options: { version?: number; withWorkflow?: boolean } = {}
  ): Promise<PageState | undefined> {
    const query: Record<string, string> = { Site: siteName, Language: language, WithVersions: 'true' };
    if (options.version !== undefined) query.Version = String(options.version);
    if (options.withWorkflow) query.WithWorkflow = 'true';
    try {
      return await this.request<PageState>(
        'GET',
        `/api/v1/pages/${encodeURIComponent(pageId)}/state`,
        'Retrieve page state',
        { query }
      );
    } catch (error) {
      if (error instanceof SitecoreApiError && error.status === 404) return undefined;
      throw error;
    }
  }

  /** Highest version number the page has in a language (0 when it has none). */
  async getLatestVersion(pageId: string, siteName: string, language: string): Promise<number> {
    const state = await this.getPageState(pageId, siteName, language);
    const numbers = (state?.versions ?? [])
      .filter((version) => !version.language || version.language.toLowerCase() === language.toLowerCase())
      .map((version) => version.version ?? 0);
    return numbers.length ? Math.max(...numbers) : 0;
  }

  /**
   * Sets the workflow state of one language version in place (Pages API PATCH). Does not run
   * workflow commands or actions, and does not create a new version.
   */
  async setWorkflowState(pageId: string, language: string, version: number, stateId: string): Promise<void> {
    await this.request<unknown>('PATCH', `/api/v1/pages/${encodeURIComponent(pageId)}`, `Set workflow state of ${pageId} ${language} v${version}`, {
      body: { language, versionNumber: version, fields: [{ name: '__Workflow state', value: stateId }] },
    });
  }

  /**
   * Starts SitecoreAI AI translation of one page (and its datasources) into one language.
   * The work runs in a background job; returns its handle (`{"handle":"..."}`), or the raw
   * response text if the response has no handle.
   */
  async translatePage(input: {
    pageId: string;
    siteId: string;
    sourceLanguage: string;
    targetLanguage: string;
    strategy: TranslationStrategy;
  }): Promise<{ handle?: string; raw: string }> {
    const result = await this.request<unknown>(
      'POST',
      `/api/v1/pages/${encodeURIComponent(input.pageId)}/translate`,
      `Translate page ${input.pageId} to ${input.targetLanguage}`,
      {
        query: { siteId: input.siteId },
        body: {
          sourceLanguage: input.sourceLanguage,
          targetLanguage: input.targetLanguage,
          translationStrategy: input.strategy,
        },
      }
    );
    const raw = typeof result === 'string' ? result : JSON.stringify(result ?? '');
    const handle =
      result && typeof result === 'object' && typeof (result as { handle?: unknown }).handle === 'string'
        ? (result as { handle: string }).handle
        : undefined;
    return { handle, raw };
  }

  /**
   * Reads a background job's status. Returns undefined once the job is gone: Sitecore removes
   * finished jobs about a minute after they complete (HTTP 404).
   */
  async getJobStatus(handle: string): Promise<JobStatus | undefined> {
    try {
      const status = await this.request<{ name?: string; done?: boolean; errors?: unknown[] }>(
        'GET',
        `/api/v1/jobs/${encodeURIComponent(handle)}/status`,
        'Retrieve job status'
      );
      return {
        name: status?.name,
        done: status?.done === true,
        errors: (status?.errors ?? []).map((error) => (typeof error === 'string' ? error : JSON.stringify(error))),
      };
    } catch (error) {
      if (error instanceof SitecoreApiError && error.status === 404) return undefined;
      throw error;
    }
  }

  private async getToken(): Promise<string> {
    if (this.token && this.token.expiresAt - TOKEN_REFRESH_MARGIN_MS > this.now()) return this.token.value;

    const response = await this.fetchFn(this.options.authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        grant_type: 'client_credentials',
        audience: this.options.audience,
      }),
    });

    const text = await response.text();
    if (!response.ok) throw new SitecoreApiError(response.status, 'Request JWT', text);

    const json = JSON.parse(text) as { access_token?: string; expires_in?: number };
    if (!json.access_token) throw new SitecoreApiError(response.status, 'Request JWT', 'No access_token in response.');

    this.token = { value: json.access_token, expiresAt: this.now() + (json.expires_in ?? 3600) * 1000 };
    return this.token.value;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH',
    path: string,
    operation: string,
    init: { query?: Record<string, string>; body?: unknown } = {},
    isRetryAfter401 = false
  ): Promise<T> {
    const url = new URL(this.options.apiBaseUrl + path);
    for (const [key, value] of Object.entries(init.query ?? {})) url.searchParams.set(key, value);
    if (this.options.environmentId) url.searchParams.set('environmentId', this.options.environmentId);

    const response = await this.fetchFn(url, {
      method,
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
        Accept: 'application/json',
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });

    const text = await response.text();

    // A revoked or rotated token: fetch a new one and try once more.
    if (response.status === 401 && !isRetryAfter401) {
      this.token = undefined;
      return this.request<T>(method, path, operation, init, true);
    }
    if (!response.ok) throw new SitecoreApiError(response.status, operation, text);

    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  }
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
