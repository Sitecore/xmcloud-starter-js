import { describe, expect, it, vi } from 'vitest';
import { SitecoreApiClient, SitecoreApiError } from '../src/sitecore-api';

const OPTIONS = {
  clientId: 'id',
  clientSecret: 'secret',
  apiBaseUrl: 'https://xmapps-api.example',
  authUrl: 'https://auth.example/oauth/token',
  audience: 'https://api.sitecorecloud.io',
};

function json(body: unknown, status = 200): Response {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
}

/** Routes requests by URL; the token endpoint always succeeds. */
function fakeFetch(routes: Record<string, () => Response>) {
  return vi.fn(async (input: string | URL | Request, _init?: RequestInit) => {
    const url = String(input);
    if (url === OPTIONS.authUrl) return json({ access_token: 'jwt', expires_in: 86400 });
    const key = Object.keys(routes).find((path) => url.includes(path));
    if (!key) throw new Error(`Unexpected request: ${url}`);
    return routes[key]!();
  });
}

describe('SitecoreApiClient', () => {
  it('translates a page with the documented request body and reuses the token', async () => {
    const fetchFn = fakeFetch({ '/translate': () => json({ handle: 'job-1' }) });
    const client = new SitecoreApiClient({ ...OPTIONS, environmentId: 'env-1', fetchFn });

    const input = { pageId: 'p1', siteId: 's1', sourceLanguage: 'en', targetLanguage: 'de-DE', strategy: 'AddVersion' as const };
    await expect(client.translatePage(input)).resolves.toEqual({ handle: 'job-1', raw: '{"handle":"job-1"}' });
    await client.translatePage(input);

    const calls = fetchFn.mock.calls;
    expect(calls.filter(([url]) => String(url) === OPTIONS.authUrl)).toHaveLength(1);

    const [url, init] = calls[1]!;
    expect(String(url)).toBe('https://xmapps-api.example/api/v1/pages/p1/translate?siteId=s1&environmentId=env-1');
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer jwt');
    expect(JSON.parse(String(init?.body))).toEqual({
      sourceLanguage: 'en',
      targetLanguage: 'de-DE',
      translationStrategy: 'AddVersion',
    });
  });

  it('finds a site by name, case-insensitively, and caches it', async () => {
    const fetchFn = fakeFetch({
      '/api/v1/sites': () => json([{ id: 's1', name: 'main-website', languages: ['en', 'de-DE'] }]),
    });
    const client = new SitecoreApiClient({ ...OPTIONS, fetchFn });

    await expect(client.findSiteByName('Main-Website')).resolves.toEqual({
      id: 's1',
      name: 'main-website',
      languages: ['en', 'de-DE'],
    });
    await client.findSiteByName('main-website');
    expect(fetchFn.mock.calls.filter(([url]) => String(url).includes('/api/v1/sites'))).toHaveLength(1);
  });

  it('returns undefined page state for a 404 (the item is not a page)', async () => {
    const fetchFn = fakeFetch({ '/state': () => json({ title: 'Not found' }, 404) });
    const client = new SitecoreApiClient({ ...OPTIONS, fetchFn });
    await expect(client.getPageState('ds1', 'main-website', 'en')).resolves.toBeUndefined();
  });

  it('marks 429 and 5xx as retryable and 400 as permanent', async () => {
    let status = 429;
    const fetchFn = fakeFetch({ '/translate': () => json({ detail: 'nope' }, status) });
    const client = new SitecoreApiClient({ ...OPTIONS, fetchFn });
    const input = { pageId: 'p1', siteId: 's1', sourceLanguage: 'en', targetLanguage: 'de-DE', strategy: 'SkipIfExists' as const };

    await expect(client.translatePage(input)).rejects.toMatchObject({ status: 429, retryable: true });
    status = 503;
    await expect(client.translatePage(input)).rejects.toMatchObject({ status: 503, retryable: true });
    status = 400;
    const error = await client.translatePage(input).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SitecoreApiError);
    expect(error).toMatchObject({ status: 400, retryable: false });
  });

  it('gets a new token and retries once after a 401', async () => {
    let first = true;
    const fetchFn = fakeFetch({
      '/translate': () => {
        if (first) {
          first = false;
          return json('', 401);
        }
        return json('"ok"');
      },
    });
    const client = new SitecoreApiClient({ ...OPTIONS, fetchFn });
    const input = { pageId: 'p1', siteId: 's1', sourceLanguage: 'en', targetLanguage: 'de-DE', strategy: 'AddVersion' as const };

    await expect(client.translatePage(input)).resolves.toEqual({ handle: undefined, raw: 'ok' });
    expect(fetchFn.mock.calls.filter(([url]) => String(url) === OPTIONS.authUrl)).toHaveLength(2);
  });

  it('reads job status while running and returns undefined once the job is gone', async () => {
    let gone = false;
    const fetchFn = fakeFetch({
      '/api/v1/jobs/': () =>
        gone ? json({ title: 'Not Found' }, 404) : json({ name: 'Translate page', done: true, errors: [{ message: 'x' }] }),
    });
    const client = new SitecoreApiClient({ ...OPTIONS, fetchFn });

    await expect(client.getJobStatus('h;1')).resolves.toEqual({
      name: 'Translate page',
      done: true,
      errors: ['{"message":"x"}'],
    });
    expect(String(fetchFn.mock.calls[1]![0])).toContain('/api/v1/jobs/h%3B1/status');
    gone = true;
    await expect(client.getJobStatus('h;1')).resolves.toBeUndefined();
  });
});
